import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthComponent } from './auth.component';
import { TranslationModule } from '../i18n/translation.module';
import { ForgotPasswordPopUpComponent } from './components/login/forgot-password-pop-up/forgot-password-pop-up.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { OtpVerificationPopUpComponent } from './components/login/otp-verification-pop-up/otp-verification-pop-up.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ResetPasswordPopUpComponent } from './components/login/reset-password-pop-up/reset-password-pop-up.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    AuthComponent,
    ForgotPasswordPopUpComponent,
    OtpVerificationPopUpComponent,
    ResetPasswordPopUpComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule,
    NgOtpInputModule
  ],
})
export class AuthModule {}
