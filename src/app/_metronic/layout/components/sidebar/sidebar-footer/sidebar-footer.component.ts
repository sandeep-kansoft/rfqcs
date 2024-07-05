import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';
import { environment } from '../../../../../../environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-footer',
  templateUrl: './sidebar-footer.component.html',
  styleUrls: ['./sidebar-footer.component.scss'],
})
export class SidebarFooterComponent implements OnInit {
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  showPreviousLoginBtn: boolean = false;
  previousUserName: string = '';

  constructor(private auth: AuthService, 
    private chr: ChangeDetectorRef,
    private commonService: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

    this.commonService.showPreviousUserLoginObj$.subscribe((show) => {
        this.showPreviousLoginBtn = show;
      this.cdr.detectChanges();
    });

    const showPreviousUserLoginBtn = localStorage.getItem(`showPreviousUserLoginBtn`)
    if(showPreviousUserLoginBtn != undefined && showPreviousUserLoginBtn != null && showPreviousUserLoginBtn != ''){
      this.showPreviousLoginBtn = showPreviousUserLoginBtn == 'true' ? true : false;
    }

    this.commonService.previousUserNameObj$.subscribe((userNmae) => {
      this.previousUserName = userNmae;
    this.cdr.detectChanges();
  });

  const previousUserFullName = localStorage.getItem(`previousUserFullName`)
  if(previousUserFullName != undefined && previousUserFullName != null && previousUserFullName != ''){
    this.previousUserName = previousUserFullName?previousUserFullName : 'Previous User';
  }

  }

  logout() {
    this.auth.logout();
    document.location.reload();
    this.chr.detectChanges();
  }

  PreviousUserLogin(){
    const MainsUser = this.auth.getMainUserData();
    if (!MainsUser || !MainsUser.accessToken) {
      
    }
    else{
      const result = this.auth.setAuthFromLocalStorage(MainsUser);
      if (result) {
        this.previousUserName = '';
        this.commonService.updatePreviousUserLoginBtn(false);
        localStorage.removeItem(`showPreviousUserLoginBtn`);
        localStorage.removeItem(`previousUserFullName`);
        this.auth.removeMainUser();
        this.router.navigate(['/']);
        this.commonService.callInitDataService();
        this.commonService.setTheme();
        this.cdr.detectChanges();
      }
    }
  }
}
