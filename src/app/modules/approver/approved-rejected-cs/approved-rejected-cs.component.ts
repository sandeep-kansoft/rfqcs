import { Component, ChangeDetectorRef } from '@angular/core';
import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import {
  ExcelExportData,
} from '@progress/kendo-angular-excel-export';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { RemarkSubmitPopupComponent } from '../components/remark-submit-popup/remark-submit-popup.component';
import { ReviewPendingCsPopupComponent } from '../components/review-pending-cs-popup/review-pending-cs-popup.component';
import { ApproverService } from '../approver.service';
import { ICsStatusListDto, IDefaultResponseDto } from '../../event/event.interface';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';
import { IPendingResponseListDto } from '../approver-interface';
import { CsItemListPopupComponent } from '../../event/components/cs-item-list-popup/cs-item-list-popup.component';
import { EventService } from '../../event/event.service';
@Component({
  selector: 'app-approved-rejected-cs',
  templateUrl: './approved-rejected-cs.component.html',
  styleUrls: ['./approved-rejected-cs.component.scss'],
})
export class ApprovedRejectedCsComponent {
  columnWidth = 150;
  public gridView: GridDataResult;
  headerStyle = 'fw-bold';
  approvedRejectedCsList: any
  smallColumnWidth = 120;
  longColumnWidth = 200;
  dropdownListdata:any[] = [];
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  middleColumnWidth = 100;
  MediumColumnWidth = 130;
  LargeColumnWidth = 170;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;

  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  authData: any;

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  rfqPrData: any;
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

  approvedRejectedList: IPendingResponseListDto[] = [];
  serachText: string = '';
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  constructor(
    private addVendorModel: NgbModal,
    private commonService: CommonService,
    private approveService: ApproverService,
    private offcanvasService: NgbOffcanvas,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private popupCtrl: NgbModal
  ) {
    // this.gridView = process(this.tempdata, this.state);
    this.allData = this.allData.bind(this);
  }
  public allData(): ExcelExportData {
    let stateData = this.state;
    // stateData.take = this.approvedRejectedCsList.length;



    const result: ExcelExportData = {
      data: this.approvedRejectedCsList,
    };

    return result;
  }

  showReviewModel(item: any) {
    let modelRef = this.addVendorModel.open(ReviewPendingCsPopupComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    modelRef.componentInstance.awardId = item.awardId;
  }

  ngOnInit() {
    this.authData = this.commonService.getAuthData();
    this.setDefaultFilter();
    this.getApprovedRejectedCS();
  }

  getApprovedRejectedCS() {
    try {
      if (!this.loading) {
        this.loading = true;
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

        this.getApprovedRejectedListApi(payload);
      }
    } catch (error) {
      this.loading = false;
      console.log('error is'), error;
    }
  }
  public onStateChanges(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.approvedRejectedCsList);
    }
  }
  getApprovedRejectedListApi(payload: any) {
    this.approveService.getApprovedRejectedCS(payload).subscribe({
      next: (result: IDefaultResponseDto<any[]>) => {
        if (result.success && result.data.length != 0) {
          this.loading = false;
          this.approvedRejectedCsList = result.data;
          this.refreshComponentFunction();
          this.loadData(this.approvedRejectedCsList);
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log('error occurred', err);
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
  downloadAttachment(url: string) {
    this.commonService.downloadFile(url);
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.approvedRejectedList = data;

    if (this.serachText != '') {
      this.onFilterAllField(null);
    } else {
      this.gridView = process(filterData, this.state);
    }
    this.cdr.detectChanges();
  }

  actionOptions(item:any) {
    if(item.eventType==3){
      this.dropdownListdata = [
        'Buyer Remarks',
        //commented out by aashutosh because it is not presented on main as of ticket #INC-173430
        // 'Review',
        'Export CS Sheet',
        'Export RA Report'
      ];
      return this.dropdownListdata;
    }
    else{
      this.dropdownListdata = [
        'Buyer Remarks',
        // 'Review',
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

      case 'Review':
        this.addVendorModel.open(ReviewPendingCsPopupComponent, {
          centered: true,
          size: 'xl',
          scrollable: true,
        });
        break;
        case 'Export CS Sheet':

        this.DownloadapproverCSsheet(item)
        break;
        case 'Export RA Report':

        this.saveReverseAuctionReport(item)
        break;
      default:
        break;
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

  Aproove(item: any) {
    this.commonService
      .showAlertForWarning('Are you Sure', 'pending cs approval')
      .then((res: any) => {
        if (res) {
        } else {
        }
      });
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

  ShowBuyerRemark(item: any) {
    let modelRef = this.addVendorModel.open(RemarkSubmitPopupComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });
    modelRef.componentInstance.buyerRemark = item.buyer_Remarks
    modelRef.componentInstance.ReasonRemark = item.vendorReason
  }

  Reject(item: any) {
    this.commonService
      .showAlertForWarning('Are you Sure', 'pending cs rejection')
      .then((res: any) => {
        if (res) {
        } else {
        }
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
          this.cdr.detectChanges();
          this.getApprovedRejectedCS();
        }
      }
    );
  }

  onFilterAllField(event: any) {
    debugger;

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
      return filterBy(this.approvedRejectedList, {
        filters: [
          {
            filters: [
              {
                field: 'awardNo',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'responseStatus',
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
              // {
              //   field: 'grandTotal',
              //   operator: 'contains',
              //   value: inputValue,
              // },
              {
                field: 'pR_NUM',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'projectName',
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
      return filterBy(this.approvedRejectedList, this.filter);
    }
  }

  // closeFilter(type: any) {
  //   debugger;
  //   switch (type) {
  //     case 'LAST_30_Days':
  //       break;
  //   }

  //   // if (this.customFilter.rangeType == 'LAST_30_Days') {
  //   //   //show alert here
  //   // } else {
  //   //   this.setDefaultFilter();
  //   //   this.getMyPrList();
  //   // }
  // }
  closeFilter() {
    if (this.customFilter.dateRangeSelected?.isDefault) {
      //show alert here
    } else {
      this.setDefaultFilter();
      this.getApprovedRejectedCS();
    }
  }
  showBadgeStatusColorClass(type: string): string {
    let color: string = '';
    switch (type) {
      case 'Approved':
        color = 'badge-light-success';
        break;
      case 'Rejected':
        color = 'badge-light-danger';
        break;
      case 'Pending':
        color = 'badge-light-danger';
        break;
      case 'Closed':
        color = 'badge-light-success';
        break;

      default:
        break;
    }
    return color;
  }

  setDefaultFilter() {
    this.customFilter = {
      dateRangeSelected: this.commonService.getDefaultDateRange(),
      prNo: '',
      department: '',
      isPrFieldVisible: false,
      isDepartmentVisible: true,
      ppoNumber: '',
      isSearchByPPONumber: false,
      isSearchItemNumber: false,
      ItemNumber: '',
      site: '',
      isSiteVisible: true,
    };
    this.cdr.detectChanges();
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
