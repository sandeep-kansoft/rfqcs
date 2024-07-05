import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import * as crypto from 'crypto-js';
import { EventService } from '../../event.service';
import { AddVendorsComponent } from './add-vendors/add-vendors.component';
import {
  EventDashboardEnums,
  IGetAllEventVendor,
  IRfqDetailDataDto,
} from '../../event.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { LoginRequestDto } from 'src/app/modules/auth/models/LoginRequestDto.model';
import { AuthService } from 'src/app/modules/auth';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
import { Router } from '@angular/router';
import { AddVendorEmailPopupComponent } from './add-vendor-email-popup/add-vendor-email-popup.component';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
})
export class VendorsComponent {
  public gridView: GridDataResult;
  // count: number = 0;
  columnWidth = 150;
  eventVendorList: IGetAllEventVendor[] = [];
  headerStyle = 'fw-bold';

  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  rfqPrData: any;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  vendorList: any = [];
  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  authData: AuthModel | null | undefined;
  @Output() updateCheckList$ = new EventEmitter();

  @Input() rfqDetail: IRfqDetailDataDto;

  // @Output() setTabCompletedStatus$ = new EventEmitter<{
  //   type: string;
  //   status: boolean;
  // }>();
  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private addVendorModel: NgbModal,
    private commonService: CommonService,
    private authService: AuthService,
    private authHttpService: AuthHTTPService,
    private router: Router,
  ) {
    this.authData = this.commonService.getAuthData();
  }
  public ngOnInit() {
    // this.saveEventVendors();
    this.getAllEventVendor();
  }
  saveEventVendors() {
    const payload: any = {
      eventId: 0,
      vendorIds: [
        {
          id: 0,
        },
      ],
    };

    this.eventService.SaveEventVendors(payload).subscribe({
      next: (result: any) => {
        this.cdr.detectChanges();
      },
      error: (err) => { },
    });
  }

  openAddVendorModel(type: string) {
    const modelRef = this.addVendorModel.open(AddVendorsComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });

    modelRef.componentInstance.type = type;

    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.result
      .then(
        (result) => {
          // this.loadData(result);

          this.getAllEventVendor();
          this.cdr.detectChanges();
          // this.gridView = result;
        },
        () => { }
      )
      .catch((e) => {
        console.log('Error occured', e);
      });
  }
  terminateModalConfirmation(item: IGetAllEventVendor) {
    this.commonService
      .showAlertForWarning(
        'Delete',
        'Are you sure, you want to Remove this Vendor?'
      )
      .then((result) => {
        if (result) {
          this.deleteEventVendor(item);
        }
      });
  }

  deleteEventVendor(item: IGetAllEventVendor) {
    this.eventService
      .deleteEventVendor(this.rfqDetail.eventid, item.vendorId)
      .subscribe({
        next: (result: any) => {
          if (result.success) {
            debugger;
            // this.rfqPrData[index].is_Terminate = true;
            // this.rfqPrData[index].evenT_STATUS = 'TERMINATED';
            this.commonService.showToaster(
              'Event terminated successfully.',
              true
            );
            this.getAllEventVendor();
          } else {
            this.commonService.showToaster(result.errorDetail, false);
          }
          this.cdr.detectChanges();
        },
        error: (err) => { },
      });
  }
  getAllEventVendor() {
    // this.loading = true;
    this.eventService.GetAllEventVendor(this.rfqDetail.eventid).subscribe({
      next: (result: any) => {
        // if (result.data.length != 0) {
        //   this.setTabCompleteStatus(true);
        // } else {
        //   this.setTabCompleteStatus(false);
        // }

        let data = result.data.sort(
          (a: any, b: any) => a.rankAmount - b.rankAmount
        );
        this.eventVendorList = result.data;
        let count = 0;
        // for (let i = 0; i < this.eventVendorList.length; i++) {
        //   if (this.eventVendorList[i].rankAmount != 0) {
        //     count = count + 1;
        //     if (
        //       i != 0 &&
        //       this.eventVendorList[i].rankAmount ==
        //       this.eventVendorList[i - 1].rankAmount
        //     ) {
        //       this.eventVendorList[i].rank = this.eventVendorList[i - 1].rank;
        //       count = count - 1;
        //     } else {
        //       this.eventVendorList[i].rank = `L${count}`;
        //     }
        //   } else {
        //     this.eventVendorList[i].rank = '';
        //   }
        // }

        let ls = this.eventVendorList.map((val) => {
          val.emailList = val.vendorEmail.split(',');
          return val;
        });
        // for (let i = 0; i < this.eventVendorList.length; i++) {
        //   this.eventVendorList[i].vendorEmailUpdated = this.eventVendorList[
        //     i
        //   ].vendorEmail.substring(
        //     0,
        //     this.eventVendorList[i].vendorEmail.indexOf(',')
        //   );
        //   this.eventVendorList[i].updatedEmailToolTip = this.eventVendorList[
        //     i
        //   ].vendorEmail.substring(
        //     this.eventVendorList[i].vendorEmail.indexOf(',') + 1,
        //     this.eventVendorList[i].vendorEmail.length
        //   );
        // }

        this.updateCheckList();
        this.loadData(ls);
      },
      error: (err) => { },
    });
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.vendorList = data;
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
  }

  public onStateChange(state: any) {
    this.sort = state.sort;
    this.filter = state.filter;
    this.state = state;
    // let pageSize = state.skip / state.take + 1;
    // if (pageSize != this.pageNumber) {
    //   this.pageNumber = pageSize;
    //   this.getMyPrList();
    // } else {
    // }

    this.loadData(this.vendorList);

  }

  saveExcelHandler(grid: GridComponent) {
    grid.saveAsExcel();
  }

  // setTabCompleteStatus(status: boolean) {
  //   this.setTabCompletedStatus$.emit({
  //     type: EventDashboardEnums.VENDORS,
  //     status: status,
  //   });
  // }

  addVendorCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Unpublished') {
          return true;
        } else if (eventStatus == 'Closed') {
          return false;
        } else if (eventStatus == 'Deleted') {
          return false;
        } else if (eventStatus == 'Terminated') {
          return false;
        }
        break;
    }
  }

  deleteActionButton() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return true;
        } else if (eventStatus == 'Closed') {
          return false;
        } else if (eventStatus == 'Deleted') {
          return false;
        } else if (eventStatus == 'Terminated') {
          return false;
        }
        break;
    }
  }
  RankAmountCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return false;
        } else if (eventStatus == 'Closed') {
          return true;
        } else if (eventStatus == 'Deleted') {
          return false;
        } else if (eventStatus == 'Terminated') {
          return false;
        }
        break;
    }
  }

  updateCheckList() {
    this.updateCheckList$.emit();
  }

  surrogateLoginCondition() {

    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return true;
        } else {
          return false;
        }
        break;
      case 'Vendor':
        return false
        break;
      case 'Requester/Technical':
        return false
        break;

      default:
        return false;
        break;
    }

  }


  surrogateLogin(vendorData: any) {

    var pswd = crypto.enc.Base64.parse(vendorData.secretKey);
    var pswdString = crypto.enc.Utf8.stringify(pswd);
    const payload: LoginRequestDto = {
      AzureToken: '',
      Password: pswdString,
      UserNameOrEmailAddress: vendorData.vendorCode,
      SingleSignIn: false,
      DirectLogin: false
    };

    const MainUser = this.authService.getAuthFromLocalStorage();
    this.authService.setMainUserData(MainUser);
    const FullName = localStorage.getItem(`${MainUser?.userId}_FullName`)
    localStorage.setItem(`previousUserFullName`, FullName ? FullName : '');
    this.commonService.previousUserName$.next(FullName ? FullName : '');

    this.authHttpService.login(payload).subscribe({
      next: (auth: AuthModel) => {
        if (auth) {
          const result = this.authService.setAuthFromLocalStorage(auth);
          if (result) {
            this.router.navigate(['/']);
            this.commonService.callInitDataService();
            this.commonService.setTheme();
            localStorage.setItem(`showPreviousUserLoginBtn`, 'true');
            this.commonService.updatePreviousUserLoginBtn(true);
            this.cdr.detectChanges();
            window.location.reload()

            // this.gotoEventDashboard(this.rfqDetail)
          }
        }
      },
      error: (err) => {
        this.cdr.detectChanges();
      }
    });
  }

  openAddVendorEmailPopup(vendorId: number,vendorEmail:any) {
    this.commonService.clearToaster();
    const modal: NgbModalRef = this.addVendorModel.open(
      AddVendorEmailPopupComponent,
      { centered: true }
    );

    modal.componentInstance.vendorId = vendorId;
    modal.componentInstance.eventId = this.rfqDetail.eventid;
    modal.componentInstance.vendorEmail=vendorEmail;
    modal.componentInstance.eventStatus=this.rfqDetail.eventStatus;
  }

  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }
}
