import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMenuDataDto } from 'src/app/shared/services/common.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  menuList: IMenuDataDto[];
  activeLink: string;

  constructor(private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.commonService.menuListData$.subscribe((menuData: any) => {
      if (menuData.length != 0) {
        this.menuList = menuData;
        //console.log("this.menuList Json data : ", JSON.stringify(this.menuList))
      }
      this.cdr.detectChanges();
    });
  }

  clickOnItem(menu: any, childMenu: any) {

    if (menu.menuCode.toLowerCase().includes('help')) {
      this.commonService.previewLinkInNewTab(this.commonService.helpMenuLink)
    } else {
      this.commonService.activeLink = childMenu.menuCode;
      this.router.navigate(['/' + menu.menuCode + '/' + childMenu.menuCode]);
    }

  }





  getActiveLink() {
    return this.commonService.activeLink;
  }
}
