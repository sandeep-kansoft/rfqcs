import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { IMenuDataDto } from 'src/app/shared/services/common.interface';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit {
  menuList: IMenuDataDto[];
  authData: AuthModel | null | undefined;
  isAccordionOpen = true;

  constructor(private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { this.authData = this.commonService.getAuthData(); }

  ngOnInit(): void {
    this.commonService.menuListData$.subscribe((menuData) => {
      if (menuData) {
        this.menuList = menuData;
      }
      this.cdr.detectChanges();
    });

    this.expandConditionChecking();
    this.isAccordionOpen = true

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

  expandConditionChecking() {
    if (this.authData?.userRole == 'Vendor') {
      console.log("hey")
      return true;
    }
    else {
      console.log("no hey");
      return false;

    }
  }

}
