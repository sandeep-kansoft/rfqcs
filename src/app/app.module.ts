import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { GridModule } from '@progress/kendo-angular-grid';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { SharedComponentsModule } from './shared/components/shared-components.module';
import { Select2Module } from 'ng-select2-component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TokenInterceptor } from './shared/interceptors/token.interceptors';
import { ErrorInterceptor } from './shared/interceptors/error.interceptors';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { ErrorHandlerService } from './shared/error-handler.service';
import { SharedModule } from './shared/shared.module';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ToastrModule } from 'ngx-toastr';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { MsalModule, MsalInterceptor, MsalGuardConfiguration, MsalInterceptorConfiguration, MSAL_INTERCEPTOR_CONFIG, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalBroadcastService, MsalGuard, MsalService } from '@azure/msal-angular';
import { LogLevel, IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, InteractionType } from '@azure/msal-browser';
import { NgOtpInputModule } from 'ng-otp-input';
import { ReActiveEventStatusRoutingModule } from './modules/reactive-event-status/re-active-event-status-routing.module';
import { PushnotificationService } from './shared/services/pushnotification.service';
import { SharedDirectivesModule } from './shared/directives/shared-directives.module';


function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      //@ts-ignore
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

/**
 * azure sso login config
 */
const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1; // Remove this line to use Angular Universal

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msalConfig.auth.clientId,
      authority: `${environment.msalConfig.auth.authority}/${environment.msalConfig.auth.tanentId}`,
      redirectUri: environment.msalConfig.auth.redirectLoginUri,
      postLogoutRedirectUri: '/'
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11. Remove this line to use Angular Universal
    },
    system: {
      allowNativeBroker: false, // Disables WAM Broker
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(environment.apiConfig.uri, environment.apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...environment.apiConfig.scopes]
    },
    loginFailedRoute: '/login-failed'
  };
}
/**
 * azure sso login config
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    GridModule,
    PDFModule,
    ExcelModule,
    ClipboardModule,
    DateInputsModule,
    CKEditorModule,
    NgxDropzoneModule,
    InfiniteScrollModule,
    ChartsModule,
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    SharedComponentsModule,
    Select2Module,
    SharedModule,
    InfiniteScrollModule,
    SharedDirectivesModule,

    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: false,
    }),
    NgxSkeletonLoaderModule.forRoot(),
    MsalModule,
    NgOtpInputModule,
    ReActiveEventStatusRoutingModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    PushnotificationService
  ],
  bootstrap: [AppComponent],
  exports: [SharedModule],
})
export class AppModule { }

