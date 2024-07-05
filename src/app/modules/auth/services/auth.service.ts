import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LoginRequestDto } from '../models/LoginRequestDto.model';
import { LoginApi, baseUrl } from 'src/app/shared/constants/urlconfig';
import { HttpClient } from '@angular/common/http';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  baseUrl: string = '';
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private http: HttpClient,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
    this.baseUrl = baseUrl;
  }

  // public methods
  login(payload: LoginRequestDto): Observable<any> {
    return this.authHttpService.login(payload);
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    localStorage.removeItem(`showPreviousUserLoginBtn`);
    localStorage.removeItem(`previousUserFullName`);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });

  }
 LogOut(
  payload:any
  ): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      LoginApi.logout;
    return this.http.post<any>(url_, payload);
  }


  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.accessToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.userId).pipe(
      map((user: UserType) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);

    const payload: LoginRequestDto = {
      AzureToken: '',
      Password: user.password,
      UserNameOrEmailAddress: user.email,
      SingleSignIn: false,
      DirectLogin:false
    };
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(payload)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  public setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.accessToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  public getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  public setMainUserData(mainUserData: AuthModel | undefined){
    localStorage.setItem(`${this.authLocalStorageToken}_MainUser`, JSON.stringify(mainUserData));
  }

  public getMainUserData() : AuthModel | undefined {
    const mainUserData = localStorage.getItem(`${this.authLocalStorageToken}_MainUser`);
      if (!mainUserData) {
        return undefined;
      }
      const authData = JSON.parse(mainUserData);
      return authData;
  }

  public removeMainUser(){
    localStorage.removeItem(`${this.authLocalStorageToken}_MainUser`);
  }

  switchToEps(

  ): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      LoginApi.switchtoeps;
    return this.http.post<any>(url_, {});
  }



}
