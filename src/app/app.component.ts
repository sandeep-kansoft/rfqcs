import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  OnInit,
} from '@angular/core';
import { TranslationService } from './modules/i18n';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { CommonService } from './shared/services/common.service';
import { environment } from 'src/environments/environment';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest, PopupRequest, AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { PushnotificationService } from './shared/services/pushnotification.service';
import { ActivatedRoute } from '@angular/router';
// import { environment } from './environments/environment';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  screenWidth: number = 0;
  NavigateThroughEPS:boolean=false;
  isAdminCondition: boolean = false
  userData: any
  @HostListener('window:resize', ['$event']) onResize(event: any) {
    if (this.screenWidth != window.innerWidth) {
      this.screenWidth = window.innerWidth;
      const maxScreenWidth: number = 990,
        minScreenWidth: number = 768;
      if (
        !this.commonService.isMobileBrowser &&
        window.innerWidth <= maxScreenWidth
      ) {
        this.commonService.screenResize(window.innerWidth);
      }
      if (
        window.innerWidth > maxScreenWidth &&
        this.commonService.isMobileBrowser
      ) {
        this.commonService.isMobileBrowser = false;
      }
    }
  }
  /**
   * Azure login variables
   */
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService,
    private commonService: CommonService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private notificationService: PushnotificationService,
    private route: ActivatedRoute,
  ) {

    let self_ = this
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );

    setTimeout(() => {
      let splash = document.getElementById('splash-screen');
      if (splash) {
        splash.remove();
      }
    }, 1000);

    this.commonService.userDataObserve$.subscribe({
      next: (result) => {
        this.userData = result
      }, error: (err) => {
        console.log("")
      }
    })

    /* Subscribing to an observable `isReadOnlyRfqcsView$` from the `CommonService` and setting the
    value of `isAdminCondition` based on the emitted value from the observable. Whenever there is a new
    value emitted from the observable, the `next` function is called with the emitted value, and the
    `isAdminCondition` is updated accordingly. */
    /* Subscribing to an observable `isReadOnlyRfqcsView$` from the `CommonService` and setting the
    value of `isAdminCondition` based on the emitted value from the observable. Whenever there is a new
    value emitted from the observable, the `next` function is called with the emitted value, and the
    `isAdminCondition` is updated accordingly. */
    this.commonService.isReadOnlyRfqcsView$.subscribe({
      next: (result) => {
        this.isAdminCondition = result
      },
    })


    const targetNode = document.querySelector('body');
    /* It  observe changes to the DOM (Document Object Model) and trigger a callback function when changes occur. */
    const observer = new MutationObserver((mutationsList, observer) => {
      const buttonElement = document.querySelectorAll('[aria-role-check="yes"]')

      if (this.commonService.getAdminViewFlag()) {
        buttonElement.forEach((item) => {
          item.classList.add('d-none')
        })
 
      }
      
    });
    if (targetNode) {
      observer.observe(targetNode, { childList: true, subtree: true });
    }
  }

  ngOnInit() {
    // alert(environment.production);
    this.route.queryParams.subscribe(params => {
      // Check if the 'NavigateThroughEPS' parameter exists in the query params
      if (params.hasOwnProperty('NavigateThroughEPS')) {
        // Convert the parameter value to boolean
        this.NavigateThroughEPS = params['NavigateThroughEPS'] === 'true';
        // Now you have access to the NavigateThroughEPS parameter
        console.log('NavigateThroughEPS:', this.NavigateThroughEPS);
      }
      
    });
    console.log('NavigateThroughEPSouterconsole:', this.NavigateThroughEPS);
    if (environment.production) {
      console.log = () => { };
      console.log = () => { };
    }
    let self_ = this
    this.modeService.init();

    setTimeout(() => {
    if (this.commonService.getAuthData() && (this.commonService.getAuthData()?.accessToken && !this.NavigateThroughEPS)) {
      this.commonService.callInitDataService();
      console.log('NavigateThroughEPSinbetweenconsole:', this.NavigateThroughEPS);
    } else {
console.log("called in else loop",this.NavigateThroughEPS);
    }
  }, 1000);
    this.initAzureSSO()

    this.notificationService.requestPermission();
    
    setTimeout(() => {
    if(this.commonService._hubConnection == undefined || this.commonService._hubConnection == null){
      this.commonService.createConnection();
    }
    if(this.commonService._hubConnection.state == "Disconnected" && this.userData != undefined && this.userData != null && this.userData.userId){
      this.commonService.startConnection(this.userData.userId);
      this.commonService.registerOnServerEvents();
    }
  }, 5000);
    
  setTimeout(() => {
    this.commonService.stopConnection();
  }, 2 * 60 * 1000);
}

ngOnDestroy(){
  this.commonService.stopConnection();
}
  /**
   * azure loggin
   *
   */
  initAzureSSO() {
    this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal
    this.setLoginDisplay();

    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = "/";
        } else {
          this.setLoginDisplay();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      })
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  loginRedirect() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  loginPopup() {

    if (this.msalGuardConfig.authRequest) {
      this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe({
          next: (response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          },
          error: (err) => {
            console.log("err", err)
          }
        });
    } else {
      this.authService.loginPopup()
        .subscribe({
          next: (response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          },
          error: (err) => {
            console.log("err", err)
          }
        });
    }
  }

  logout(popup?: boolean) {
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: "/"
      });
    } else {
      this.authService.logoutRedirect();
    }
  }
}
