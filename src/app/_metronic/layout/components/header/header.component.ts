import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { map, share, Subscription, timer } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { MenuComponent } from '../../../kt/components';
import { ILayout, LayoutType } from '../../core/configs/config';
import { AuthService } from 'src/app/modules/auth';
import { CommonService } from 'src/app/shared/services/common.service';
import { IUserDataDto } from 'src/app/shared/services/common.interface';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  // Public props
  currentLayoutType: LayoutType | null;
  asideDisplay: boolean = true;
  appHeaderDisplay: boolean;
  appHeaderDefaultFixedDesktop: boolean;
  appHeaderDefaultFixedMobile: boolean;
  authData: AuthModel | null | undefined;
  appHeaderDefaultContainer: 'fixed' | 'fluid';
  headerContainerCssClass: string = '';
  appHeaderDefaultContainerClass: string = '';

  appHeaderDefaultStacked: boolean;
  initialNames = '';
  // view
  appSidebarDefaultCollapseDesktopEnabled: boolean;
  appSidebarDisplay: boolean;
  appHeaderDefaultContent: string = '';
  appHeaderDefaulMenuDisplay: boolean;
  appPageTitleDisplay: boolean;
  userData: IUserDataDto;
  userType: string | undefined;
  constructor(
    private layout: LayoutService,
    private router: Router,
    private auth: AuthService,
    private chr: ChangeDetectorRef,
    private commonService: CommonService,
    private azureAuthService: MsalService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,



  ) {
    this.authData = this.commonService.getAuthData();
    this.routingChanges();
  }

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription: Subscription;

  updateProps(config: ILayout) {
    this.appHeaderDisplay = this.layout.getProp(
      'app.header.display',
      config
    ) as boolean;
    // view
    this.appSidebarDefaultCollapseDesktopEnabled = this.layout.getProp(
      'app.sidebar.default.collapse.desktop.enabled',
      config
    ) as boolean;
    this.appSidebarDisplay = this.layout.getProp(
      'app.sidebar.display',
      config
    ) as boolean;
    this.appHeaderDefaultContent = this.layout.getProp(
      'app.header.default.content',
      config
    ) as string;
    this.appHeaderDefaulMenuDisplay = this.layout.getProp(
      'app.header.default.menu.display',
      config
    ) as boolean;
    this.appPageTitleDisplay = this.layout.getProp(
      'app.pageTitle.display',
      config
    ) as boolean;

    // body attrs and container css classes
    this.appHeaderDefaultFixedDesktop = this.layout.getProp(
      'app.header.default.fixed.desktop',
      config
    ) as boolean;
    if (this.appHeaderDefaultFixedDesktop) {
      document.body.setAttribute('data-kt-app-header-fixed', 'true');
    }

    this.appHeaderDefaultFixedMobile = this.layout.getProp(
      'app.header.default.fixed.mobile',
      config
    ) as boolean;
    if (this.appHeaderDefaultFixedMobile) {
      document.body.setAttribute('data-kt-app-header-fixed-mobile', 'true');
    }

    this.appHeaderDefaultContainer = this.layout.getProp(
      'appHeaderDefaultContainer',
      config
    ) as 'fixed' | 'fluid';
    this.headerContainerCssClass =
      this.appHeaderDefaultContainer === 'fixed'
        ? 'container-xxl'
        : 'container-fluid';

    this.appHeaderDefaultContainerClass = this.layout.getProp(
      'app.header.default.containerClass',
      config
    ) as string;
    if (this.appHeaderDefaultContainerClass) {
      this.headerContainerCssClass += ` ${this.appHeaderDefaultContainerClass}`;
    }

    this.appHeaderDefaultStacked = this.layout.getProp(
      'app.header.default.stacked',
      config
    ) as boolean;
    if (this.appHeaderDefaultStacked) {
      document.body.setAttribute('data-kt-app-header-stacked', 'true');
    }

    // Primary header
    // Secondary header
  }

  ngOnInit(): void {
    const subscr = this.layout.layoutConfigSubject
      .asObservable()
      .subscribe((config: ILayout) => {
        this.updateProps(config);
      });
    this.unsubscribe.push(subscr);
    const layoutSubscr = this.layout.currentLayoutTypeSubject
      .asObservable()
      .subscribe((layout) => {
        this.currentLayoutType = layout;
      });
    this.unsubscribe.push(layoutSubscr);

    // time
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // Using RxJS Timer
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe((time) => {
        this.rxTime = new Date();
        this.chr.detectChanges();
      });

    this.commonService.userDataObserve$.subscribe((userData: any) => {
      if (userData) {
        this.userData = userData;
        this.initialNames = this.getInitialNames();
        //console.log("this.menuList Json data : ", JSON.stringify(this.menuList))
      }
      this.chr.detectChanges();
    });
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        MenuComponent.reinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    // this.auth.LogOut();
    
    let payload = {
      token: this.authData?.accessToken,
      userId: this.authData?.userId,
      userRole: this.authData?.userRole
    }
    this.auth.LogOut(payload).subscribe({
      next: (
        result: any
      ) => {

        if (this.authData?.isAzureLogin) {
          this.azureLogout();
        }
        document.location.reload();
        this.chr.detectChanges();
      },
      error: (err) => {
        console.log(err);

      },
    });

    localStorage.clear()

  }
  switchToeps() {
    this.auth.switchToEps().subscribe({
      next: (
        result: any
      ) => {
        window.open(result.data, '_newtab')
      },
      error: (err) => {
        console.log(err);

      },
    });

  }

  getInitialNames() {
    if (this.userData?.fullName) {
      let name = '';
      let regex = /^[a-zA-Z0-9]*$/;
      let userName = this.userData?.fullName.replace(/\s{2,}/g, ' ').trim();
      let namesList = userName.split(' ');
      namesList.forEach((val: string) => {
        if (regex.test(val[0]) && name.length <= 2) {
          name += val[0];
        }
      });
      return name;
    }
    else {
      return ''
    }
  }

  switchtoepscondition() {
    this.userType = this.authData?.userRole;
    // console.log("this is user type",this.userType,this.authData?.userRole)
    switch (this.userType) {
      case 'Buyer':
        return true;
        break;
      case 'Vendor':
        return false;
        break;
      case 'Admin':
        return true;
        break;
      case 'Requester/Technical':
        return true;
        break;


      default:
        return false;
        break;
    }
  }


  azureLogout() {
    // this.azureAuthService.logout().subscribe({
    //   next: (result) => {
    //     document.location.reload();
    //     this.chr.detectChanges();
    //   }, error: () => { }
    // })
  }
}
