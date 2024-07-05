import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moments from 'moment-timezone';
import {
  NgbActiveModal,
  NgbActiveOffcanvas,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import * as crypto from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  Observable,
  of,
} from 'rxjs';
import { LayoutService } from 'src/app/_metronic/layout';
import { environment } from 'src/environments/environment';
import { AuthModel } from '../../modules/auth/models/auth.model';
import { AlertModalComponent } from '../components/alert-modal/alert-modal.component';
import { baseUrl, commonApiModule, eventCommunicationApis } from '../constants/urlconfig';
import {
  ICommmonDataDto,
  IDateRangeDataDto,
  IMenuDataDto,
  IMenuResponseDataDto,
  IPermissionDataDto,
  IPermissionlistDataDto,
  IUserDataDto,
} from './common.interface';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { PermissionService } from './permission.service';
import { PushnotificationService } from './pushnotification.service';
import { EventService } from 'src/app/modules/event/event.service';
import { IRfqDataDtoById } from 'src/app/modules/event/event.interface';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  toasts: any = [];
  viewOnlyCondition: boolean = false;
  isMobileBrowser: boolean = false;
  public toasterList$ = new BehaviorSubject([]);
  public currentToasterList$ = this.toasterList$.asObservable();
  baseUrl: string;
  commonBaseUrl: string;
  menuApiResponse: IMenuDataDto[];
  isAppHeader: boolean = false;
  public menuList$ = new BehaviorSubject([]);
  public menuListData$ = this.menuList$.asObservable();

  public showPreviousUserLogin$ = new BehaviorSubject(false);
  public showPreviousUserLoginObj$ = this.showPreviousUserLogin$.asObservable();

  public previousUserName$ = new BehaviorSubject('');
  public previousUserNameObj$ = this.previousUserName$.asObservable();

  public globalLoader = new BehaviorSubject<boolean>(false);

  public userData$ = new BehaviorSubject({});
  public userDataObserve$ = this.userData$.asObservable();

  public permissionByUserId: IPermissionlistDataDto[] = [];
  public allPermissions: IPermissionlistDataDto[] = [];
  public userData: IUserDataDto;
  public threeDecimalRegex: RegExp = /^\d+(\.\d{1,3})?$/
  public twoDecimalRegex: RegExp = /^\d+(\.\d{1,2})?$/
  public activeLink: string; //for show selected side menu
  public isReadOnlyRfqcsView$ = new BehaviorSubject<boolean>(false);
  public helpMenuLink: string = ''
  public _hubConnection: HubConnection;
  public _msgCount:number;
  public _msgCount$ = new BehaviorSubject<number>(0);
  private lastMsgId:string = '';
  //common date range list
  dateRangeList: IDateRangeDataDto[] = [
    {
      rangeName: 'Last 30 Days',
      rangeType: 'LAST_30_DAYS',
      days: 30,
      isVisible: false,
      isDefault: false,
      startDate: null,
      endDate: null,
    },
    {
      rangeName: 'Last 60 Days',
      rangeType: 'LAST_60_DAYS',
      days: 60,
      isVisible: true,
      isDefault: true,
      startDate: null,
      endDate: null,
    },
    {
      rangeName: 'Last 3 Months',
      rangeType: 'LAST_3_MONTHS',
      days: 90,
      isVisible: true,
      isDefault: false,
      startDate: null,
      endDate: null,
    },
    {
      rangeName: 'Last Year',
      rangeType: 'LAST_YEAR',
      days: 366,
      isVisible: true,
      isDefault: false,
      startDate: null,
      endDate: null,
    },
    {
      rangeName: 'Custom Range',
      rangeType: 'CUSTOM_RANGE',
      days: 0,
      isVisible: true,
      isDefault: false,
      startDate: null,
      endDate: null,
    },
  ];

  updatePreviousUserLoginBtn(show: boolean) {
    this.showPreviousUserLogin$.next(show);
  }

  updatePreviousUserName(name: string) {
    this.previousUserName$.next(name);
  }

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private router: Router,
    private layout: LayoutService,
    private toastService: ToastrService,
    private permissionService: PermissionService,
    private notificationService : PushnotificationService,
    // private eventService: EventService,
  ) {
    this.baseUrl = `${baseUrl}/${commonApiModule.usersApi}`;
    this.commonBaseUrl = `${baseUrl}/${commonApiModule.commonApi}`;
  }

  MarkMessageAsRead(data: any): Observable<any> {
    let url_ = `${baseUrl}/${eventCommunicationApis.markAsRead}`;
    return this.http.post<any>(url_, data);
  }

  GetUnreadMsgCountByUser(data: any): Observable<any> {
    let url_ = `${baseUrl}/${eventCommunicationApis.getUnreadMsgCountByUser}`;
    return this.http.post<any>(url_, data);
  }

  createConnection() {  
    this._hubConnection = new HubConnectionBuilder()  
      .withUrl(baseUrl + '/chat'
      // , {skipNegotiation: true}
      )  
      .build();  

      this._hubConnection.serverTimeoutInMilliseconds = 1000 * 60 * 10; // for  10 minute;
    // this._hubConnection.keepAliveIntervalInMilliseconds = 59000;
  }

  startConnection(_userId: any): void {  
    this._hubConnection  
      .start()  
      .then(() => {  
        this._hubConnection.invoke('SetActiveThread', _userId.toString(), this._hubConnection.connectionId?.toString())
        // console.log('Hub connection started');  
      })  
      .catch(err => {  
        console.log('Error while establishing connection, retrying...');
      });  
  }

  registerOnServerEvents(): void {  
    this._hubConnection.on('AuctionBCastMessageReceived', (data: any) => {  
      var myMsg = JSON.parse(data);
      if(this._hubConnection.connectionId != myMsg.connectionId && this.lastMsgId != myMsg.messageId){
        // this._msgCount = this._msgCount+1;
        this.lastMsgId = myMsg.messageId;
        this._msgCount$.next(this._msgCount$.value + 1);
        this.notificationService.showNotification('Message from '+ myMsg.fromFullName +' - '+ myMsg.eventTitle, {body: myMsg.text});
      }
    });

    this._hubConnection.on('ReceiveEventNotification', (data: any) => {  
      var myMsg = JSON.parse(data);
      if(this._hubConnection.connectionId != myMsg.connectionId){
        this.notificationService.showNotification('Message from '+ myMsg.fromFullName +' - '+ myMsg.eventTitle, {body: myMsg.text});
      }
    });
  }

  stopConnection(): void {
    this._hubConnection?.stop().then(() => {
      if(this._hubConnection == undefined || this._hubConnection == null){
        this.createConnection();
      }
      if(this._hubConnection.state == "Disconnected" && this.userData != undefined && this.userData != null && this.userData.userId){
        this.startConnection(this.userData.userId);
        this.registerOnServerEvents();
      }
    });
  }

  //   public createButtonSubject$ = new BehaviorSubject("");
  //   public createButtonSubjectObs$ = this.toasterList$.asObservable();

  public sendData = new EventEmitter<any>();

  setTheme() {
    // this.layout.setBaseLayoutType('dark-header');
    // this.layout.setBaseLayoutType('dark-sidebar');
  }

  sendDataFromclassic(type: string) {
    this.sendData.emit(type);
  }

  clearToaster() {
    this.toasts.splice(0, this.toasts.length);
    this.toasterList$.next(this.toasts);
  }
  confirmationInfoModal() {
    this.clearToaster();
    return this.modalService
      .open(AlertModalComponent, { centered: true })
      .result.then(
        (result) => { },
        (reason) => {
          return reason;
        }
      );
  }

  removeToaster(toast: any) {
    this.toasts = this.toasts.filter((t: any) => t !== toast);
    this.toasterList$.next(this.toasts);
  }
  showToaster(comment: string, success: boolean, options: any = {}) {
    if (comment != null && comment != undefined && comment != '') {
      // setTimeout(() => {
      //   this.toasts.push({ comment, success, ...options });
      //   this.toasterList$.next(this.toasts);
      // }, 100);
      if (success) this.toastService.success(comment);
      else this.toastService.error(comment);
    }
  }

  screenResize(width: any) {
    const maxWidth: number = 990;
    this.isMobileBrowser = width > maxWidth ? false : true;
  }

  getAuthData(): AuthModel | undefined | null {
    let item = localStorage.getItem(
      `${environment.appVersion}-${environment.USERDATA_KEY}`
    );
    if (item) {
      let authData: AuthModel = JSON.parse(item);
      return authData;
    }
    return null;
  }

  logout() {
    localStorage.removeItem(
      `${environment.appVersion}-${environment.USERDATA_KEY}`
    );
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  //call initData service
  callInitDataService() {
    forkJoin([
      this.getMenuData().pipe(
        map((res) => res),
        catchError((e) => of(e))
      ),
      this.getPermissionDataByUserId().pipe(
        map((res) => res),
        catchError((e) => of(e))
      ),
      this.getAllPermissionData().pipe(
        map((res) => res),
        catchError((e) => of(e))
      ),
      this.getUser().pipe(
        map((res) => res),
        catchError((e) => of(e))
      ),
      this.getHelpDocument().pipe(
        map((res) => res),
        catchError((e) => of(e))
      ),
    ]).subscribe({
      next: (response: any) => {
        this.permissionByUserId = response[1]?.data;
        this.allPermissions = response[2]?.data;
        this.userData = response[3].data;
        this.userData$.next(this.userData);
        this.setMenuData(response[0].data);
        localStorage.setItem(
          `${this.userData.userId}_FullName`,
          this.userData.fullName
        );
        this.helpMenuLink = response[4].data[1]
      },
      error: (error: any) => {
        this.showToaster(error?.error, false);
      },
    });
  }

  setMenuData(menuData: IMenuDataDto[]) {
    let pageName =
      this.router.url.split('/').length >= 2
        ? this.router.url.split('/')[1]
        : this.router.url;

    let parentMenuData: any = [];
    this.menuApiResponse = menuData;
    // menuData.filter(async (element) => {

    //   if (element.childmenu) {
    //     element.childmenu = element.childmenu.filter((o: any) => {
    //       o.filePath = './assets/images/menu-icons/' + o.menuCode + '.svg';
    //       return o;
    //     });
    //   } else {
    //     if (element.menuCode == pageName) {
    //       this.isAppHeader = false;
    //     }
    //   }

    //   element.filePath =
    //     './assets/images/menu-icons/' + element.menuCode + '.svg';
    //   return element;

    // });

    menuData.forEach((element) => {
      if (
        element.permissionlist.length != 0 &&
        this.checkPermissionForUser(element.permissionlist[0].permissionCode)
      ) {
        let childmenu: any = [];
        element.childmenu.forEach((val: any) => {
          if (
            val.permissionlist.length != 0 &&
            this.checkPermissionForUser(val.permissionlist[0].permissionCode)
          ) {
            let i = {
              ...val,
              filePath: './assets/images/menu-icons/' + val.menuCode + '.svg',
            };
            childmenu.push(i);
          }
        });

        let item = {
          ...element,
          filePath: './assets/images/menu-icons/' + element.menuCode + '.svg',
          childmenu: childmenu,
        };

        parentMenuData.push(item);
      }
    });

    this.menuList$.next(parentMenuData);
  }

  /**
   * @return Success
   */
  getMenuData(): Observable<IMenuResponseDataDto> {
    let url_ = this.baseUrl + '/GetAllMenuItems';
    return this.http.get<IMenuResponseDataDto>(url_);
  }

  /**
   * @return Success
   */
  getPermissionDataByUserId(): Observable<IMenuDataDto> {
    let url_ = this.baseUrl + '/GetPermissionsByUserId';
    return this.http.get<IMenuDataDto>(url_);
  }

  /**
   * @return Success
   */
  getAllPermissionData(): Observable<IMenuDataDto> {
    let url_ = this.baseUrl + '/GetAllPermissions';
    return this.http.get<IMenuDataDto>(url_);
  }

  //Currecies api
  getCurrenciesList(): Observable<ICommmonDataDto> {
    let url_ = this.commonBaseUrl + '/BindCurrency';
    return this.http.get<ICommmonDataDto>(url_);
  }

  /**
   * @return Success
   */
  getUser(): Observable<ICommmonDataDto> {
    let url_ = this.baseUrl + '/GetUser';
    return this.http.get<ICommmonDataDto>(url_);
  }

  /**
 * @return Success
 */
  getHelpDocument(): Observable<ICommmonDataDto> {
    let url_ = `${baseUrl}/${commonApiModule.getDocumentPath}?Type=SupplierManual`
    return this.http.get<ICommmonDataDto>(url_);
  }

  //  confirmation modal
  confirmationModal(title?: string, bodyContent?: string) {
    this.clearToaster();
    const modal: NgbModalRef = this.modalService.open(AlertModalComponent, {
      centered: true,
    });
    modal.componentInstance.title = title;
    modal.componentInstance.bodyContent = bodyContent;
    return modal.result.then(
      (result) => { },
      (reason) => {
        return reason;
      }
    );
  }

  getLastDateFromRange(days: number) {
    return new Date(new Date().setDate(new Date().getDate() - days));
  }

  getFutureDateFromRange(days: number) {
    return new Date(new Date().setDate(new Date().getDate() + days));
  }

  //alert for common use of warning
  showAlertForWarning(
    title: string,
    subtitle: string,
    showCancelButton: boolean = true,
    primaryButtonText?: string,
    secondaryButtonText?: string
  ) {
    return Swal.fire({
      title: title,
      text: subtitle,
      icon: 'warning',
      showCancelButton: showCancelButton,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: secondaryButtonText ? secondaryButtonText : 'No',
      confirmButtonText: primaryButtonText ? primaryButtonText : 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else if (result.isDismissed) {
        return false;
      }
    });
  }

  //alert for common use of success
  showAlertForSuccess(
    title: string,
    subtitle: string,
    primaryButtonText?: string,
    secondaryButtonText?: string
  ) {
    return Swal.fire({
      title: title,
      text: subtitle,
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: secondaryButtonText ? secondaryButtonText : 'No',
      confirmButtonText: primaryButtonText ? primaryButtonText : 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else if (result.isDismissed) {
        return false;
      }
    });
  }

  //alert for common use of error
  showAlertForError(
    title: string,
    subtitle: string,
    primaryButtonText?: string,
    secondaryButtonText?: string
  ) {
    return Swal.fire({
      title: title,
      text: subtitle,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: secondaryButtonText ? secondaryButtonText : 'No',
      confirmButtonText: primaryButtonText ? primaryButtonText : 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else if (result.isDismissed) {
        return false;
      }
    });
  }

  getTimeFormatString(date: string | Date, format: string) {
    return moment(date).format(format);
  }

  checkPermissionForItem() {
    if (this.permissionByUserId.length != 0) {
      this.permissionByUserId.forEach(
        (permissionUser: IPermissionlistDataDto, index: number) => {
          this.allPermissions.forEach((element: IPermissionlistDataDto) => {
            if (permissionUser.permissionName == element.permissionName) {
              return true;
            }
          });
          if (index + 1 === this.permissionByUserId.length) {
            return false;
          }
        }
      );
    } else {
      return false;
    }
  }

  checkPermissionForUser(permissionCode: string) {
    if (this.permissionByUserId.length != 0) {
      let data = this.permissionByUserId.filter(
        (val: IPermissionlistDataDto) => val.permissionCode == permissionCode
      );
      if (data.length != 0) return true;
      else return false;
    } else {
      return false;
    }
  }

  getDateFormatString(date: string | Date |null, format: string)  {
    return moment(date).format(format);
  }
  convertStringToDate(date:string | Date | any ){
    let dateConverted = date.replace(" ", "T") + "Z";
    let newdate = new Date(dateConverted);
 return newdate.toISOString();
  }
  // by pankaj kumar to get start date
  getStartDateRange(days: number, format: string) {
    return moment(moment().subtract(days, 'days')).format(format);
  }

  getDefaultDateRange() {
    return this.dateRangeList.filter((val: any) => val.isDefault)[0];
  }

  downloadFile(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = this.getFileNameFromUrl(url);
    a.click();
  }

  previewLinkInNewTab(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank'
    a.click();
  }

  getFileNameFromUrl(name: string) {
    let arr = name.split('/');
    let nameWithExtension = arr[arr.length - 1];
    let tempName = nameWithExtension.split('.');
    return tempName[0];
  }

  decryptString(data: any) {
    var pswd = crypto.enc.Base64.parse(data);
    var pswdString = crypto.enc.Utf8.stringify(pswd);
    return pswdString;
  }

  eventStatusAndTypeMapping(type: string): string {
    //     1    Unpublished
    // 2    Published
    // 3    Closed
    // 4    Deleted
    // 5    Terminated
    // 6    Awarded
    // 7    Partly Awarded

    let result = '';
    switch (type) {
      case '1':
        result = 'Unpublished';
        break;
      case '2':
        result = 'Published';
        break;
      case '3':
        result = 'Closed';
        break;
      case '4':
        result = 'Deleted';
        break;
      case '5':
        result = 'Terminated';
        break;
      case '6':
        result = 'Awarded';
        break;
      case '7':
        result = 'Partly Awarded';
        break;
      case '8':
        result = 'Extended';
        break;

      default:
        break;
    }
    return result;
  }
  eventTypeMapping(type: string): string {
    //     1    Unpublished
    // 2    Published
    // 3    Closed
    // 4    Deleted
    // 5    Terminated
    // 6    Awarded
    // 7    Partly Awarded

    let result = '';
    switch (type) {
      case '1':
        result = 'RFQ';
        break;
      case '2':
        result = 'Forward Auction';
        break;
      case '3':
        result = 'Reverse Auction';
        break;
      default:
        break;
    }
    return result;
  }

  isAfterGivenDate(date1: string | Date, date2: string | Date): boolean {
    return moment(date1).isAfter(date2);
  }

  isBeforeGivenDate(date1: string | Date, date2: string | Date): boolean {
    return moment(date1).isBefore(date2);
  }

  getFixedDecimalValue(value: number) {
    return parseFloat(value.toFixed(2));
  }

  setGlobalLoaderStatus(status: boolean) {
    this.globalLoader.next(status)
  }
  getAdminViewFlag() {
    let value: any = localStorage.getItem('isAdminViewOnlyFlag')
    return JSON.parse(value)?.isAdminViewOnlyFlag
  }

  setAdminViewFlag(status: boolean) {
    localStorage.setItem('isAdminViewOnlyFlag', JSON.stringify({ isAdminViewOnlyFlag: status }))
  }

  public checkPermission(key: string,) {
    let currentPageName = this.getCurrentRouteName();
    return this.permissionService.permissionList[currentPageName] && this.permissionService.permissionList[currentPageName]?.includes(key)
  }
  getCurrentRouteName() {
    let ls = this.router.url.split('?')[0].split('/')
    let currentPageName: string = ls[ls.length - 1];
    return currentPageName || ''
  }
  async eventPublishedChecker(eventId: any): Promise<boolean> {
    try {
        const result: IRfqDataDtoById | undefined = await this.getRFQDetailsById(eventId).toPromise();
        let outcome = result?.data;
        if (outcome?.eventStatus == "Published") {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}



getRFQDetailsById(eventId: any): Observable<IRfqDataDtoById> {
  let url_ =
    `${baseUrl}` + '/' + 'api/RFQCS/GetRFQDetailsById' + '?EventId=' + eventId;
  return this.http.get<IRfqDataDtoById>(url_);
}

  convertTimeZone(dateStr: any,fromTimeZone: string,toTimeZone: string,format:any): string {

    if(fromTimeZone=="default"){
      let DefaultTimeZone="Asia/Kolkata";
      const date = moments.tz(dateStr, format, DefaultTimeZone);

      // Convert the date to the target time zone
      const convertedDate = date.tz(toTimeZone);
  
      // Format the date back to a string (can adjust format as needed)
      return convertedDate.format(format);
    }
    else{
    // Parse the date in the source time zone
    const date = moments.tz(dateStr, format, fromTimeZone);

    // Convert the date to the target time zone
    const convertedDate = date.tz(toTimeZone);

    // Format the date back to a string (can adjust format as needed)
    return convertedDate.format(format);
  }
  }
}
