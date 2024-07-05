import { ChangeDetectorRef, Component } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ICsStatusListDto, IDefaultResponseDto, IMyAwardCs } from '../../event/event.interface';
import { FilterDescriptor, SortDescriptor, State, filterBy, orderBy, process } from '@progress/kendo-data-query';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from '../../event/event.service';
import { RemarkSubmitPopupComponent } from '../../approver/components/remark-submit-popup/remark-submit-popup.component';
import { PreviewDocumentPopupComponent } from '../../event/components/preview-document-popup/preview-document-popup.component';
import { ReviewPendingCsPopupComponent } from '../../approver/components/review-pending-cs-popup/review-pending-cs-popup.component';
import { CsItemListPopupComponent } from '../../event/components/cs-item-list-popup/cs-item-list-popup.component';
import { CsLinesComponent } from '../../event/my-award-cs/cs-lines/cs-lines.component';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';

@Component({
  selector: 'app-admin-all-cs',
  templateUrl: './admin-all-cs.component.html',
  styleUrls: ['./admin-all-cs.component.scss']
})
export class AdminAllCsComponent {
  columnWidth = 150;
  public gridView: GridDataResult;
  isLoading: boolean;
  myAwardCsList: IMyAwardCs[];
  headerStyle = 'fw-bold';
  smallColumnWidth = 120;
  longColumnWidth = 200;
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  middleColumnWidth = 100;
  MediumColumnWidth = 130;
  LargeColumnWidth = 170;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  createPoLoader: boolean = false;

  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  authData: any;

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;

  dropdownListdata = ['Buyer Remarks', 'Approve', 'Reject', 'Export', 'Review'];
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
  userData: any
  isReadOnlyRfqcs: boolean = false

  constructor(
    private popupModel: NgbModal,
    private commonService: CommonService,
    private offcanvasService: NgbOffcanvas,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private addVendorModel: NgbModal,
    private popupCtrl: NgbModal,
    private modalctrl: NgbModal
  ) {
    this.commonService.userDataObserve$.subscribe({
      next: (result) => {
        this.userData = result
        // if (isContentVisible)
        this.isReadOnlyRfqcs = this.userData.allow_AllRFQCSView
      }, error: (err) => {
      }
    })
  }

  showBadgeStatusColorClass(type: string): string {
    let color: string = '';
    switch (type) {
      case 'Approved':
        color = 'badge-light-success';
        break;
      case 'In Process':
        color = 'badge-light-warning';
        break;
      case 'Pending':
        color = 'badge-light-danger';
        break;
      case 'Rejected':
        color = 'badge-light-danger';
        break;
      case 'InReview':
        color = 'badge-light-warning';
        break;
      case 'Closed':
        color = 'badge-light-success';
        break;

      default:
        break;
    }
    return color;
  }

  actionOptions() {
    return this.dropdownListdata;
  }

  ngOnInit() {
    this.commonService.setAdminViewFlag(true);
    this.authData = this.commonService.getAuthData();
    this.setDefaultFilter()
    this.getMyAwardCs();
  }

  onModelClicked(item: any, value: string) {

    switch (value) {
      case 'Buyer Remarks':
        this.popupModel.open(RemarkSubmitPopupComponent, {
          centered: true,
          size: 'lg',
          scrollable: true,
        });
        break;
      case 'PreviewDocument':
        this.popupModel.open(PreviewDocumentPopupComponent, {
          centered: true,
          size: 'lg',
          scrollable: true,
        });
        break;
      case 'Review':
        this.popupModel.open(ReviewPendingCsPopupComponent, {
          centered: true,
          size: 'xl',
          scrollable: true,
        });
        break;
      // case "Approve":
      //     this.Aproove(item);
      //     break;
      // case "Reject":
      //     this.Reject(item);
      // break;
      // case "Review" :
      //     this.addVendorModel.open(ReviewPendingCsPopupComponent,{
      //       centered: true,
      //     size: 'lg',
      //     scrollable: true
      //     })
      // break;
      // default:
      //   break;
    }
  }
  getMyAwardCs() {
    let payload={
      userId: this.authData.userId,  
      pageIndex: 0,  
      pageSize: 0, 
       startDate: "",  
       endDate:"" ,  
    getAll: true
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
    this.isLoading = true;
    this.eventService.getMyAwardCs(payload).subscribe({
      next: (result: IDefaultResponseDto<IMyAwardCs[]>) => {
        if (result.success) {
          this.isLoading = false;
          let data = result.data.sort(
            (a: any, b: any) => b.cS_No - a.cS_No
          );
          this.myAwardCsList = data.map(val => ({ ...val, totalValue: val.totalValue?  val.totalValue.toFixed(2) : "" })) as any;
          this.refreshComponentFunction();
          this.loadData(this.myAwardCsList);
          
          // this.gridView = process(this.myAwardCsList, this.state);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
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
  showReviewModel(item: ICsStatusListDto) {
    let modelRef = this.addVendorModel.open(ReviewPendingCsPopupComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    modelRef.componentInstance.awardId = item.cS_No;
  }

  createpoconfirmationmodal(cS_No: number) {
    this.confirmationModal(cS_No);
  }

  confirmationModal(cS_No: number) {

    this.commonService
      .showAlertForWarning(`Do you want To Create PO for CS No ${cS_No} ?`, ``)
      .then((result) => {
        if (result) {
          this.CreatePO(cS_No);
        } else {

          this.cdr.detectChanges();
        }
      });
  }

  CreatePO(csNum: number) {
    if (!this.createPoLoader) {
      this.isLoading = true;
      this.createPoLoader = true;
      this.eventService.createPo(csNum).subscribe({
        next: (result: any) => {
          if (result.success) {
            this.isLoading = false;
            this.commonService.showToaster('PO Created Successfully', true);

            this.getMyAwardCs();

            this.createPoLoader = false;
            this.cdr.detectChanges();
          } else {
            this.commonService.showToaster(result.errorDetail, false);
            this.createPoLoader = false;
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.createPoLoader = false;
          console.log(err);
          this.isLoading = false;
          this.commonService.showToaster(err.title, false);
          this.cdr.detectChanges();


        },
      });
    }
  }

  onModelClick(item: any, type: string) {
    const modelRef = this.popupCtrl.open(CsItemListPopupComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    // modelRef.componentInstance.eventId = item.eventId;
    modelRef.componentInstance.awardId = item.cS_No;
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

  csLineClick(item: any) {
    const modelRef = this.modalctrl.open(CsLinesComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    // modelRef.componentInstance.eventId = item.eventId;
    modelRef.componentInstance.awardId = item.cS_No;
    // modelRef.componentInstance.vendorId = item.vendorId;
    modelRef.result.then(
      (result) => { },
      (result) => {
        if (result) {
          this.getMyAwardCs();
        }
      }
    );
  }


  downloadAttachment(url: string) {
    this.commonService.downloadFile(url);
  }
  closeFilter() {
    if (this.customFilter.dateRangeSelected?.isDefault) {
      //show alert here
    } else {
      this.setDefaultFilter();
      this.getMyAwardCs();
    }
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
      return filterBy(this.myAwardCsList, {
        filters: [
          {
            filters: [
              {
                field: 'cS_No',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'awardNo',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'eventNo',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'eventName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'csStatus',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'vendorcode',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'vendorname',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'pR_NUM',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'totalValue',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'prppoAmount',
                operator: 'contains',
                value: inputValue,
              },
              // {
              //   field: 'department',
              //   operator: 'contains',
              //   value: inputValue,
              // },
              // {
              //   field: 'assignBuyer',
              //   operator: 'contains',
              //   value: inputValue,
              // },
            ],
            logic: 'or',
          },
        ],
        logic: 'or',
      });
    } else {
      return filterBy(this.myAwardCsList, this.filter);
    }
  }
  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.myAwardCsList);
    }
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.myAwardCsList = data;
    // this.loading = false;
    if (this.serachText != '') {
      this.onFilterAllField(null);
    } else {
      this.gridView = process(filterData, this.state);
    }
    // this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
  }
  getCsDocumentUrl(item:IMyAwardCs) {
    this.isLoading = true;
    this.eventService.getCSDocumentURL(item.awardNo,item.docFileName,item.docPath).subscribe({
      next: (result: IDefaultResponseDto<any>) => {
        if (result.success) {
          this.isLoading = false;
          let url=result.data;
          this.commonService.downloadFile(url);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
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
          this.getMyAwardCs();
          this.cdr.detectChanges();
        }
      }
    );
  }
}
