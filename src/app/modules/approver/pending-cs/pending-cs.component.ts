import { Component, ChangeDetectorRef } from '@angular/core';
import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
// import { ViewCSComponent } from '../../event/components/view-cs/view-cs.component';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import { RemarkSubmitPopupComponent } from '../components/remark-submit-popup/remark-submit-popup.component';
import { NgbActiveModal, NgbAlert, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { ReviewPendingCsPopupComponent } from '../components/review-pending-cs-popup/review-pending-cs-popup.component';
import { ApproverService } from '../approver.service';
import {
  IDefaultResponseDto,
  IGetAssignnedCollabrativeUserDataDta,
  IRfqDataDtoById,
  IRfqDetailDataDto,
} from '../../event/event.interface';
import { IPendingResponseListDto } from '../approver-interface';
import { SingleInputModalComponent } from '../../event/components/single-input-modal/single-input-modal.component';
import { EventService } from '../../event/event.service';
import { CsItemListPopupComponent } from '../../event/components/cs-item-list-popup/cs-item-list-popup.component';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';

@Component({
  selector: 'app-pending-cs',
  templateUrl: './pending-cs.component.html',
  styleUrls: ['./pending-cs.component.scss'],
})
export class PendingCsComponent {
  columnWidth = 150;
  public gridView: GridDataResult;
  headerStyle = 'fw-bold';
  isRfqDetailAvailable: boolean = false;
  smallColumnWidth = 120;
  longColumnWidth = 200;
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  middleColumnWidth = 100;
  MediumColumnWidth = 130;
  isViewCsOpen: boolean = false;
  LargeColumnWidth = 170;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  approveRejectLoader: boolean = false;
  currentCollaboratorPermission: IGetAssignnedCollabrativeUserDataDta;
  rfqDetail: IRfqDetailDataDto;
  rfqDetailLoader: boolean = false
  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  authData: any;
  pendingCsList: IPendingResponseListDto[] = [];
  tempdata: any = [
    {
      CsNo: '123',
      EventNo: '213',
      BuyerName: 'Gaurav Choudhary',
      CsSubMDT: '22/03/2023',
      VendorName: 'Abhishek Enterprices',
      TotalVAlue: '550.00',
      PR_NO: 'WCL23PPO-385936',
      Project_Name: 'RFQCS',
      SiteName: 'CPP',
      Department: 'Mechanical',
    },
  ];
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;

  dropdownListdata:any[]=[]
  refreshComponent: boolean = true;
  customFilter: ICustomFilterDataDto = {
    dateRangeSelected: null,
    prNo: '',
    department: '',
    isPrFieldVisible: false,
    isDepartmentVisible: false,
    ppoNumber: '',
    isSearchByPPONumber: false,
    isSearchItemNumber: false,
    ItemNumber: '',
    site: '',
    isSiteVisible: false,
  };
  serachText: string = '';
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  csId: number = 0

  constructor(
    private addVendorModel: NgbModal,
    private commonService: CommonService,
    private approveService: ApproverService,
    private cdr: ChangeDetectorRef,
    private activeModel: NgbModal,
    private eventService: EventService,
    private popupCtrl: NgbModal,
    private offcanvasService: NgbOffcanvas,
  ) {
    // this.gridView = process(this.tempdata, this.state);
  }

  ngOnInit() {
    this.authData = this.commonService.getAuthData();
    this.setDefaultFilter();
    this.getPendingCS();
    
  }
  setDefaultFilter() {
    this.customFilter = {
      dateRangeSelected: this.commonService.getDefaultDateRange(),
      prNo: '',
      department: '',
      isPrFieldVisible: true,
      isDepartmentVisible: true,
      ppoNumber: '',
      isSearchByPPONumber: false,
      isSearchItemNumber: false,
      ItemNumber: '',
      site: '',
      isSiteVisible: false,
    };
  }
  actionOptions(item:any) {
    if(item.eventType==3){
      this.dropdownListdata = [
        'Buyer Remarks',
        'Review',
        'Export CS Sheet',
        'Export RA Report'
      ];
      return this.dropdownListdata;
    }
    else{
      this.dropdownListdata = [
        'Buyer Remarks',
        'Review',
        'Export CS Sheet',
      ];
      return this.dropdownListdata;
    }
  }
  onModelClicked(value: string, item: any) {
    switch (value) {
      case 'Buyer Remarks':
        this.ShowBuyerRemark(item);
        break;
       case 'Export CS Sheet':
       this.DownloadapproverCSsheet(item);
       break;
       case 'Export RA Report':
       this.saveReverseAuctionReport(item);
       break;
      case 'Approve':
        this.showRemarkModel(item, true);
        break;
      case 'Reject':
        this.showRemarkModel(item, false);
        break;
      case 'View CS':
        console.log('hey');

        // this.showRemarkModel(item, false);
        break;
      case 'Review':
        this.showReviewModel(item)
        break;
      default:
        break;
    }
  }
  ShowBuyerRemark(item: any) {
    let modelRef = this.addVendorModel.open(RemarkSubmitPopupComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });
    modelRef.componentInstance.buyerRemark = item.buyer_Remarks
    modelRef.componentInstance.ReasonRemark = item.vendorReason
  }
  closeFilter() {
    if (this.customFilter.dateRangeSelected?.isDefault) {
      //show alert here
    } else {
      this.setDefaultFilter();
      this.getPendingCS();
    }
  }
  showReviewModel(item: IPendingResponseListDto) {
    let modelRef = this.addVendorModel.open(ReviewPendingCsPopupComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    modelRef.componentInstance.awardId = item.awardId
  }

  // Aproove(item: any) {
  //   this.commonService
  //     .showAlertForWarning('Are you Sure', 'pending cs approval')
  //     .then((res: any) => {
  //       if (res) {
  //         console.log('approved');
  //       } else {
  //         console.log('failed');
  //       }
  //     });
  // }
  // Reject(item: any) {
  //   this.commonService
  //     .showAlertForWarning('Are you Sure', 'pending cs rejection')
  //     .then((res: any) => {
  //       if (res) {
  //         console.log('rejected');
  //       } else {
  //         console.log('failed');
  //       }
  //     });
  // }


  viewCsButtonHandle(item: IPendingResponseListDto) {
    this.getRfqDetailById(item.eventID, item);
  }

  DownloadapproverCSsheet(item:IPendingResponseListDto){
    let payload={
      eventCode: item.eventCode.toString(),
      csNo: item.awardId,
  eventId: item.eventID,
  priceBidDetailNo: 2,
  techParaDetailNo: 3,
  tcDetailNo: 4
    }
  this.approveService.DownloadApproverCsSheet(payload).subscribe({
    next: (result: any) => {
      const urlBlob = window.URL.createObjectURL(result);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `CS_Sheet_${item.awardId}.xlsx`
      link.click();
      window.URL.revokeObjectURL(urlBlob);
     this.commonService.showToaster("Approver CS Sheet Downloaded",true)
    },
    error: (err) => {
      this.commonService.showToaster(err,false)
      this.loading = false;
      this.cdr.detectChanges();
    },
  });
    }

  getPendingCS() {
    let payload={
      userId: this.authData.userId,  
      pageIndex: 0,  
      pageSize: 0, 
       startDate: "",  
       endDate:"" ,  
    getAll: false
  }


  if (this.customFilter.dateRangeSelected?.days != 0) {
    payload.startDate = this.commonService
      .getLastDateFromRange(this.customFilter.dateRangeSelected?.days)
      .toISOString()
      .slice(0, 10);
    payload.endDate = new Date().toISOString().slice(0, 10);
  } else {
    payload.startDate = this.customFilter.dateRangeSelected?.startDate
      .toISOString()
      .slice(0, 10);
    payload.endDate = this.customFilter.dateRangeSelected?.endDate.toISOString().slice(0, 10);
  }
    this.loading = true;
    this.approveService.getPendingCS(payload).subscribe({
      next: (result: IDefaultResponseDto<IPendingResponseListDto[]>) => {
        if (result.success ) {

          let data = result.data.sort(
            (a: any, b: any) => b.awardId - a.awardId
          );
          for(let i=0;i<data.length;i++){
            data[i].grandTotal=this.commonService.getFixedDecimalValue(data[i].grandTotal);
          }
          this.refreshComponentFunction();
          
          this.loadData(data);
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  refreshComponentFunction() {
    this.refreshComponent = false;
    setTimeout(() => {
      this.refreshComponent = true;
      this.cdr.detectChanges();
    }, 1);
  }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.pendingCsList = data;
    this.loading = false;
    if (this.serachText != '') {
      this.onFilterAllField(null);
    } else {
      this.gridView = process(filterData, this.state);
    }
    this.cdr.detectChanges();
  }

  showRemarkModel(item: IPendingResponseListDto, isApprove: boolean) {
    if (!this.approveRejectLoader) {
      const modelRef = this.activeModel.open(SingleInputModalComponent, {
        centered: true,
        fullscreen: false,
        scrollable: true,
        keyboard: false
      });

      modelRef.componentInstance.title = `${isApprove ? 'Approve' : 'Reject'
        } Remarks`;
      modelRef.componentInstance.placeholderName = 'Remark';
      modelRef.result.then(
        (result) => { },
        (result) => {
          if (result) {
            if (isApprove) {
              this.approveApi(item, result);
            } else {
              this.rejectCsApi(item, result);
            }
          }
        }
      );
    }
  }

  approveApi(item: IPendingResponseListDto, remark: string) {
    this.commonService.setGlobalLoaderStatus(true);
    this.approveRejectLoader = true;
    this.approveService.approveCsApi(item.awardId, remark,item.level).subscribe({
      next: (result: IDefaultResponseDto<boolean>) => {
        if (result.success) {
          this.commonService.setGlobalLoaderStatus(false);
          this.commonService.showToaster('Approved successfully', true);
          this.getPendingCS();
          this.cdr.detectChanges();

        } else {
          this.commonService.setGlobalLoaderStatus(false);
          this.commonService.showToaster(result.errorDetail, false);
        }
        this.commonService.setGlobalLoaderStatus(false);
        this.approveRejectLoader = false;
      },
      error: (err) => {
        this.approveRejectLoader = false;
        this.commonService.setGlobalLoaderStatus(false);
      },
    });
  }

  rejectCsApi(item: IPendingResponseListDto, remark: string) {
    this.approveRejectLoader = true;
    this.commonService.setGlobalLoaderStatus(true);
    this.approveService.rejectCsApi(item.awardId, remark,item.level).subscribe({
      next: (result: IDefaultResponseDto<boolean>) => {
        if (result.success) {
          this.loading = true
          this.commonService.setGlobalLoaderStatus(false);
          this.commonService.showToaster('Rejected successfully', true);
          this.getPendingCS();
          this.cdr.detectChanges();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
          this.commonService.setGlobalLoaderStatus(false);
        }
        this.approveRejectLoader = false;
        this.commonService.setGlobalLoaderStatus(false);
      },
      error: (err) => {
        this.approveRejectLoader = false;
        this.commonService.setGlobalLoaderStatus(false);
      },
    });
  }

  getRfqDetailById(eventId: number, item: IPendingResponseListDto) {
    this.rfqDetailLoader = true
    this.eventService.getRFQDetailsById(eventId).subscribe({
      next: (result: IRfqDataDtoById) => {
        this.csId = item.awardId
        this.rfqDetail = result.data;
        this.isViewCsOpen = true
        this.isRfqDetailAvailable = true;
        this.rfqDetailLoader = false
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.rfqDetailLoader = false
      },
    });
  }

  onCsClick(item: any) {

    const modelRef = this.popupCtrl.open(CsItemListPopupComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    // modelRef.componentInstance.eventId = item.eventId;
    modelRef.componentInstance.awardId = item.awardId;
    // modelRef.componentInstance.vendorId = item.vendorId;
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
  backbuttonclicked() {
    this.isViewCsOpen = false;
    this.isRfqDetailAvailable = false;
  }


  onFilterAllField(event: any) {
    //console.log("Value : ", event.target.value);

    let inputValue;
    if (event) {
      this.state.skip = 0
      inputValue = event.target.value;
      this.serachText = inputValue;
    } else {
      inputValue = this.serachText;
    }

    let filterData = this.getFilteredData(inputValue);
    this.gridView = process(filterData, this.state);
  }


  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.pendingCsList, {
        filters: [
          {
            filters: [
              {
                field: 'awardNo',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'eventCode',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'buyer',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'cS_CreationDate',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'vendor',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'grandTotal',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'pR_NUM',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'site',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'department',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'assignBuyer',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'prppoAmount',
                operator: 'contains',
                value: inputValue,
              }
            ],
            logic: 'or',
          },
        ],
        logic: 'or',
      });
    } else {
      return filterBy(this.pendingCsList, this.filter);
    }
  }
  downloadAttachment(url: string) {
    this.commonService.downloadFile(url);
  }


  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.pendingCsList);
    }
  }

  saveReverseAuctionReport(item:any){
    let payload:any={
    "eventId":item.eventID
   }
     this.eventService.DownloadReverseAuctionReport(payload).subscribe({
       next: (result: any) => {
         console.log("this is result",result)
         const urlBlob = window.URL.createObjectURL(result);
         const link = document.createElement('a');
         link.href = urlBlob;
         link.download = `Reverse_Auction_Report${item.eventID}.xlsx`
         link.click();
         window.URL.revokeObjectURL(urlBlob);
        this.commonService.showToaster("Reverse Auction Report Downloaded",true)
       },
       error: (err) => {
         console.log(err);
         this.commonService.showToaster(err.title, false);
         this.cdr.detectChanges();
       },
     });
   
 }
  openFilterDrawer() {
    this.commonService.clearToaster();
    const modalRef = this.offcanvasService.open(FilterComponent, {
      position: 'end',
      ariaLabelledBy: 'offcanvas-basic-title',
    });
    modalRef.componentInstance.customFilter = JSON.stringify(this.customFilter);
    modalRef.result.then(
      (response) => {
      },
      (data) => {
        if (data) {
          this.customFilter = data;
          this.getPendingCS();
          this.cdr.detectChanges();
        }
      }
    );
  }
  getCsDocumentUrl(item:any) {
    this.loading = true;
    this.eventService.getCSDocumentURL(item.awardNo,item.docFileName,item.docPath).subscribe({
      next: (result: IDefaultResponseDto<any>) => {
        if (result.success) {
          this.loading = false;
          let url=result.data;
          this.commonService.downloadFile(url);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
}
