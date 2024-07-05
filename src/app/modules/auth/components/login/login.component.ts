import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, Subject } from 'rxjs';
import { filter, first, map, takeUntil } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

import { ActivatedRoute, Router } from '@angular/router';
import { LoginRequestDto } from '../../models/LoginRequestDto.model';
import { AuthModel } from '../../models/auth.model';
import { AuthHTTPService } from '../../services/auth-http';
import { CommonService } from 'src/app/shared/services/common.service';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, PopupRequest } from '@azure/msal-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordPopUpComponent } from './forgot-password-pop-up/forgot-password-pop-up.component';
import { OtpVerificationPopUpComponent } from './otp-verification-pop-up/otp-verification-pop-up.component';
import { ResetPasswordPopUpComponent } from './reset-password-pop-up/reset-password-pop-up.component';
import * as moment from 'moment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: '',
    password: '',
  };
  diffInDays: number;
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  // isLoading$: Observable<boolean>;
  errorMessage: string = 'The login details are incorrect';
  isLoading: boolean = false;
  isSubmitButtonClicked: boolean = false;
  username: any;
  usersecret: any;
  expiryDate: any;
  loginDisplay: boolean = false
  isIframe = false;
  private readonly _destroying$ = new Subject<void>();
  isInvalidate: boolean = false
  // forgot vendor code
  vendorId: number | null
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private authHttpService: AuthHTTPService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msAlAuthService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private forgotPasswordModal: NgbModal,
    private activeModal: NgbModal




    // private singleSignon: MsalService
  ) {
    // this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/purchase-requisition/pr-overview']);
    }
    // console.log(this.route.queryParams.subscribe({}));

  }

  ngOnInit(): void {
    // let a :any= "MjE2ODE%3D"
    // let b:any=this.commonService.decryptString(a)
    // console.log("this is expiry date time",b);
    // console.log("this is user seceret",this.commonService.decryptString("MjE2ODE%3D"))
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] ||
      '/purchase-requisition/pr-overview';

    this.route.queryParams.subscribe(params => {
      this.username = params['Username'];
      this.usersecret = params['UserSecret'];
      console.log("this is the route", this.route)
      this.vendorId = params['forgot_vcode']? parseInt(this.commonService.decryptString(params['forgot_vcode'])): null;
      this.expiryDate = params['ExipryDateTime']?this.commonService.decryptString(params['ExipryDateTime']):null;
      let date = moment(this.expiryDate, "DD/MM/YYYY HH:mm:ss");
      let formattedDate = date.format("DD/MM/YYYY");
      var givenDate = moment(formattedDate, "DD/MM/YYYY");
      let currentDate = moment();
      this.diffInDays = givenDate.diff(currentDate, 'days')

      if (this.vendorId) {
        // open modal to verify forgot password
        this.otpVerifyScreen()
      }

      if (this.username && this.usersecret && (this.diffInDays >= 0)) {
        this.rfqcslogin();
      }
    });
    this.initAzureSSO();

  }
    rfqcslogin() {
    // let decryptedusername=this.commonService.decryptString(this.username);
    // let decrypteduserpassword=this.commonService.decryptString(this.usersecret);
    // console.log("this are decrypted userid password",decryptedusername,decrypteduserpassword);

    const payload: LoginRequestDto = {
      AzureToken: '',
      Password: this.usersecret,
      UserNameOrEmailAddress: this.username,
      SingleSignIn: false,
      DirectLogin: true
    };

    this.authHttpService.login(payload).subscribe({
      next: (auth: AuthModel) => {
        if (auth) {
          const result = this.authService.setAuthFromLocalStorage(auth);
          if (result) {
            this.router.navigate(['/']);
            this.commonService.callInitDataService();
            this.commonService.setTheme();
            this.commonService.createConnection();
            this.commonService.startConnection(auth.userId);
          }
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = err?.ErrorDetail;
        this.cdr.detectChanges();
      },
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit(isAzureLogin: boolean, azureToken: string = '') {
    this.isSubmitButtonClicked = true;
    if (this.isLoading) this.hasError = false;
    this.isLoading = true;
    let payload: LoginRequestDto;
    if (isAzureLogin) {
      payload = {
        AzureToken: azureToken,
        Password: '',
        UserNameOrEmailAddress: '',
        SingleSignIn: true,
        DirectLogin: false
      }

    } else {
      payload = {
        AzureToken: '',
        Password: this.f.password.value,
        UserNameOrEmailAddress: this.f.email.value,
        SingleSignIn: false,
        DirectLogin: false
      }
    }


    this.isInvalidate = true
    this.authHttpService.login(payload).subscribe({
      next: (auth: AuthModel) => {
        if (auth) {
          auth.isAzureLogin = isAzureLogin
          const result = this.authService.setAuthFromLocalStorage(auth);
          if (result) {
            this.router.navigate(['/']);
            this.commonService.callInitDataService();
            this.commonService.setTheme();
            this.commonService.createConnection();
            this.commonService.startConnection(auth.userId);
          }
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = err?.ErrorDetail;
        this.cdr.detectChanges();
      },
    });

    this.cdr.detectChanges();

  }

  ngOnDestroy() {
    this.loginForm.reset();
    this.cdr.detach();
    if (this.activeModal.hasOpenModals()) {
      this.activeModal.dismissAll();
    }
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  loginPopup() {
    if (this.msalGuardConfig.authRequest) {
      this.msAlAuthService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe({
          next: (response: AuthenticationResult) => {
            this.submit(true, response.idToken)
            this.msAlAuthService.instance.setActiveAccount(response.account);

          },
          error: (err) => {
            console.log("err", err)
          }
        });
    } else {
      this.msAlAuthService.loginPopup()
        .subscribe({
          next: (response: AuthenticationResult) => {
            this.submit(true, response.idToken)
            this.msAlAuthService.instance.setActiveAccount(response.account);
          },
          error: (err) => {
            console.log("err", err)
          }
        });
    }
  }

  initAzureSSO() {
    this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal
    this.setLoginDisplay();

    this.msAlAuthService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.msAlAuthService.instance.getAllAccounts().length === 0) {
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
    this.loginDisplay = this.msAlAuthService.instance.getAllAccounts().length > 0;
  }
  checkAndSetActiveAccount() {
    let activeAccount = this.msAlAuthService.instance.getActiveAccount();
    if (!activeAccount && this.msAlAuthService.instance.getAllAccounts().length > 0) {
      let accounts = this.msAlAuthService.instance.getAllAccounts();
      this.msAlAuthService.instance.setActiveAccount(accounts[0]);
    }
  }

  otpVerifyScreen() {

    const modelRef = this.forgotPasswordModal.open(OtpVerificationPopUpComponent, {
      centered: true,
      animation: true,
      scrollable: true,
    });

    modelRef.componentInstance.vendorId = this.vendorId
    modelRef.result.then(
      (fulfilled) => {
        // If OTP is verified, then an update pop will be shown.
        this.resetPasswordPopUp();
      },
      (rejected) => {
      }
    );

  }

  forgotPasswordPopup() {

    const modelRef = this.forgotPasswordModal.open(ForgotPasswordPopUpComponent, {
      centered: true,
      animation: true,
      scrollable: true,
    });

    modelRef.result.then(
      (err) => { },
      (data) => { }
    );

  }

  resetPasswordPopUp() {

    const modelRef = this.forgotPasswordModal.open(ResetPasswordPopUpComponent, {
      centered: true,
      animation: true,
      scrollable: true,
    });
    modelRef.componentInstance.vendorId = this.vendorId

    modelRef.result.then(
      (err) => { },
      (data) => { }
    );

  }



}
