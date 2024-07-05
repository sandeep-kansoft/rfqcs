import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router, Params } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  IAllVendorsList,
  IAllVendorsResponse,
  IGetAllEventVendor,
  IPriceBidResultDataDto,
  IRfqDataDtoById,
  IRfqDetailDataDto,
} from '../../event.interface';
import { EventService } from '../../event.service';
import { ChatComponent } from './chat/chat.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrModalComponent } from './pr-modal/pr-modal.component';
import { SkuModalComponent } from './sku-modal/sku-modal.component';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import * as crypto from 'crypto-js';
import { LoginRequestDto } from 'src/app/modules/auth/models/LoginRequestDto.model';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
import { AuthService } from 'src/app/modules/auth';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  @Input() rfqDetail: IRfqDetailDataDto;
  @Output() changeActiveTab = new EventEmitter<any>();
  @Output() syncRfqDetail = new EventEmitter();

  loading: boolean = false;
  selectedVendorsList: IAllVendorsList[];
  newSelectedVendorList: IAllVendorsList[];
  suggestedVendorsList: IAllVendorsList[];
  public getassigneduser: boolean = false;
  collaborativeUserList: any = [];
  priceBidLinesList: any;
  charecterLength: number = 150;
  authData: AuthModel | null | undefined;
  eventVendorList: IAllVendorsList[] = [];

  constructor(
    private commonService: CommonService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private prmodal: NgbModal,
    private skumodal: NgbModal,
    private authHttpService: AuthHTTPService,
    private authService: AuthService
  ) {
    this.authData = this.commonService.getAuthData();
  }

  public ngOnInit() {
    //this.getGetAllVendorsServiceCall();
    this.getAssignedCollaborativeUser();
    this.getPriceBidLinesServiceCall();
    this.getAllEventVendor();
    this.getSuggestedVendors();
    // this is just to update data whenever summary page is loaded
    // this.getRfqDetailById()
    this.reloadRfqDetail();
  }

  getAllEventVendor() {
    debugger;
    // this.loading = true;
    this.eventService.GetAllEventVendor(this.rfqDetail.eventid).subscribe({
      next: (result: any) => {
        this.selectedVendorsList = result.data;
        this.newSelectedVendorList = result.data.sort(
          (a: any, b: any) => a.totalAmount - b.totalAmount);
        this.eventVendorList = this.newSelectedVendorList;
        let count = 0;
        for (let i = 0; i < this.eventVendorList.length; i++) {
          if (this.eventVendorList[i].totalAmount != 0) {
            count = count + 1;
            this.eventVendorList[i].rank = `L${count}`;
          } else {
            this.eventVendorList[i].rank = '';
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => { },
    });
  }

  getSuggestedVendors() {
    debugger;
    let payload = {
      eventId: this.rfqDetail.eventid,
      searchText: '',
      pageSize: 100,
      pageIndex: 1,
      sorting: 1,
    };

    this.eventService.getSuggestedVendors(payload).subscribe({
      next: (result: any) => {
        this.suggestedVendorsList = result.data;
        this.cdr.detectChanges();
      },
      error: (err) => { },
    });
  }

  // getGetAllVendorsServiceCall() {
  //   this.loading = true;
  //   let data = {
  //     eventId: this.rfqDetail?.eventid,
  //     searchText: '',
  //     pageSize: 5,
  //     pageIndex: 1,
  //     sorting: 1,
  //   };

  //   this.eventService.getAllVendors(data).subscribe({
  //     next: (result: IAllVendorsResponse) => {
  //       this.loading = false;
  //       this.selectedVendorsList = result.data;
  //       console.log('All Vendors List : ', this.selectedVendorsList);
  //       this.cdr.detectChanges();
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.loading = false;
  //     },
  //   });
  // }
  //buyer id is pending in below api
  getAssignedCollaborativeUser() {
    this.eventService
      .getAssignedcollaborativeuser(this.rfqDetail.eventid)
      .subscribe({
        next: (result: any) => {
          this.collaborativeUserList = result.data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.getassigneduser = false;
        },
      });
  }

  //Price bid lines
  getPriceBidLinesServiceCall() {
    this.loading = true;
    this.eventService.getPriceBidLines(this.rfqDetail.eventid).subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.priceBidLinesList = result.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  openskumodal() {
    const modelRef = this.skumodal.open(SkuModalComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });

    modelRef.componentInstance.rfqDetail = this.rfqDetail;
    modelRef.result.then(
      (err) => {
        console.log('Detail', err);
      },
      (data) => {
        if (data) {
          // this.getPriceBidColumnsServiceCall();
          this.cdr.detectChanges();
        }
      }
    );
  }
  handleEvent(event: any) {
  }
  openprmodal(rfqDetail: IRfqDetailDataDto) {
    const modelRef = this.prmodal.open(PrModalComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.componentInstance.eventTitle = this.rfqDetail.eventTitle;
    modelRef.result.then(
      (err) => {
        console.log('Detail', err);
      },
      (data) => {
        if (data) {
          // this.getPriceBidColumnsServiceCall();
          this.cdr.detectChanges();
        }
      }
    );
  }
  openChatPopUp(threadId: string, sendTo: number) {
    const modelRef = this.modalService.open(ChatComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });

    // modelRef.componentInstance.otherChargesParameterList = JSON.stringify(this.otherChargesParameterList);
    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.componentInstance.chatThreadId = threadId;
    modelRef.componentInstance.chatForBuyer = true;
    modelRef.componentInstance.isModel = true;
    modelRef.componentInstance.eventName = this.rfqDetail.eventTitle;
    modelRef.componentInstance.writeable = true;
    modelRef.componentInstance.msgSendTo = sendTo;
    modelRef.result.then(
      (err) => {
      },
      (data) => {
        if (data) {
          // this.getPriceBidColumnsServiceCall();
          this.cdr.detectChanges();
        }
      }
    );
  }

  saveEventVendors(item: IAllVendorsList, index: number) {
    const payload: any = {
      eventId: this.rfqDetail.eventid,
      vendorIds: [
        {
          id: item.vendorId,
        },
      ],
    };

    this.eventService.SaveEventVendors(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          console.log('saveeventvendors', result);
          this.commonService.showToaster('Vendor added Succesfully', true);
          this.selectedVendorsList.push(item);
          this.suggestedVendorsList.splice(index, 1);

          this.cdr.detectChanges();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
          //this.saveEventLoader = false;
        }
      },
      error: (err) => {
        //this.saveEventLoader = false;
      },
    });
  }

  changeActiveTabFunction(activeTab: string) {
    //alert(activeTab);
    this.changeActiveTab.emit(activeTab);
  }

  summaryPageCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        return true;

        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return false;
        }
        break;
      case 'Requester/Technical':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return false;
        }
        break;

      default:
        return false;
        break;
    }
  }

  vendorCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        return true;

        break;
      case 'Vendor':
        return false;
        break;
      case 'Requester/Technical':
        return true;
        break;

      default:
        return false;
        break;
    }
  }
  collaboratorCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        return true;

        break;
      case 'Vendor':
        return false;
        break;
      case 'Requester/Technical':
        return false;
        break;

      default:
        return false;
        break;
    }
  }

  viewAllVendorCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        return true;

        break;
      case 'Vendor':
        return false;
        break;
      case 'Requester/Technical':
        return false;
        break;

      default:
        return false;
        break;
    }
  }

  prLineViewVendorCondition() {
    switch (this.authData?.userRole) {
      case 'Buyer':
        return true;

        break;
      case 'Vendor':
        return false;
        break;
      case 'Requester/Technical':
        return false;
        break;

      default:
        return false;
        break;
    }
  }

  vendorTabChatOption() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Closed') {
          return true;
        } else if (eventStatus == 'Unpublished') {
          return false;
        } else if (eventStatus == 'Terminated') {
          return false;
        }

        break;
      case 'Vendor':
        return false;
        break;
      case 'Requester/Technical':
        return false;
        break;

      default:
        return false;
        break;
    }
  }

  totalPriceAndRankCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Closed') {
          return true;
        } else if (eventStatus == 'Unpublished') {
          return false;
        } else if (eventStatus == 'Terminated') {
          return false;
        }

        break;
      case 'Vendor':
        return false;
        break;
      case 'Requester/Technical':
        return false;
        break;

      default:
        return false;
        break;
    }
  }

  // getRfqDetailById() {
  //   this.loading = true;
  //   this.eventService.getRFQDetailsById(this.rfqDetail.eventid).subscribe({
  //     next: (result: IRfqDataDtoById) => {
  //       this.loading = false;
  //       this.rfqDetail = result.data;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.loading = false;
  //     },
  //   });
  // }

  surrogateLogin(vendorData: any) {

    var pswd = crypto.enc.Base64.parse(vendorData.secretKey);
    var pswdString = crypto.enc.Utf8.stringify(pswd);
    const payload: LoginRequestDto = {
      AzureToken: '',
      Password: pswdString,
      UserNameOrEmailAddress: vendorData.vendorCode,
      SingleSignIn: false,
      DirectLogin:false
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


  gotoEventDashboard(eventDetail: any) {
    this.router.navigate(['/Event/EventDashboard'], {
      state: {
        EventId: this.rfqDetail.eventid,
        // threadid: this.rfqDetail.t,
        eventName: this.rfqDetail.eventTitle,
        // vendorId: eventDetail.vendorid

      },
    });
  }

  surrogateLoginCondition() {

    let eventStatus = this.rfqDetail.eventStatus;
    // console.log("curr rfq", this.rfqDetail)

    switch (this.authData?.userRole) {
      case 'Buyer':

        /* The above code is checking if the event status is "Published" and the event type is RFQ*/
        if (eventStatus == 'Published' ) {
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

  reloadRfqDetail() {
    this.syncRfqDetail.emit();
  }
  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }
}

