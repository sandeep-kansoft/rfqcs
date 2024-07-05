import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import { ICustomFilterDataDto, IUserDataDto } from 'src/app/shared/services/common.interface';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CsItemListPopupComponent } from '../cs-item-list-popup/cs-item-list-popup.component';
import {
  ICsStatusList,
  ICsStatusListDto,
  IDefaultResponseDto,
  IRfqDetailDataDto,
  IVendorDetail,
  IVendorList,
  LineDetail,
} from '../../event.interface';
import { EventService } from '../../event.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { SingleInputModalComponent } from '../single-input-modal/single-input-modal.component';
import { IPendingResponseListDto } from 'src/app/modules/approver/approver-interface';
import { ReviewPendingCsPopupComponent } from 'src/app/modules/approver/components/review-pending-cs-popup/review-pending-cs-popup.component';
import { CsApprovalUploadDocumentComponent } from './cs-approval-upload-document/cs-approval-upload-document.component';
import { CsAppovalSubmitPopupComponent } from './cs-appoval-submit-popup/cs-appoval-submit-popup.component';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-cs-approval',
  templateUrl: './cs-approval.component.html',
  styleUrls: ['./cs-approval.component.scss'],
})
export class CsApprovalComponent {
  isSelectAllChecked: boolean;
  public gridView: GridDataResult;
  awardId: number;
  selectedItemVendorrank: string;
  public gridView1: GridDataResult;
  reasonValidation: boolean;
  public csApprovalLineItemGrid: GridDataResult;
  public gridView3: GridDataResult;
  public csStatusDetailGrid: GridDataResult;
  file: any;
  filePath: string;
  documentname: string;
  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  apivalidate: boolean = true;
  isLoading = false;
  subtotalchargesforgrid2: number;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;

  csStatusListLoading: boolean = false;

  SmallColumnWidth = 80;
  finalSubTotalForgrid2: any;
  refreshComponent: boolean = true;
  MediumColumnWidth = 120;
  customFilter: ICustomFilterDataDto = {
    dateRangeSelected: null,
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
  inValidate: boolean = false;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  serachText: string = '';
  longColumnWidth = 200;
  eventId: number = 143;
  @Input() rfqDetail: IRfqDetailDataDto;
  newColumns: any = [];
  IsDetailPage: boolean = false;
  finalTotalCharges: number;
  csStatusDetailPage: boolean = false;

  vendorList: IVendorList[];
  csStatusList: ICsStatusListDto[];
  SelectedVendor: IVendorList;
  vendorDetail: IVendorDetail;
  TotalAmount: number;
  SubTotalCharges: number;
  TotalCharges: number;
  csApprovalLineList: Array<LineDetail> = []
  public csApprovalLineState: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  public csApprovalLineSort: SortDescriptor[] = [];
  public csApprovalLinefilter: FilterDescriptor;
  authData: AuthModel | null | undefined;
  public userData: IUserDataDto;


  constructor(
    private popupCtrl: NgbModal,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private commonServices: CommonService,
    private modalService: NgbModal,
    private addVendorModel: NgbModal,
    private uploadDocumentModal: NgbModal
  ) {
    this.isSelectAllChecked = false;
  }
  ngOnInit() {
    this.commonServices.userDataObserve$.subscribe({
      next: (userInfo) => {
        this.userData = userInfo as IUserDataDto
      }
    })
    this.authData = this.commonServices.getAuthData();
    this.getVendorsForCsApprovalApi();
    this.GetCSStatusList();
    this.getAllEventVendor();


  }
  public csApprovalStateChange(state: any) {

    this.csApprovalLineSort = state.sort;
    this.csApprovalLinefilter = state.filter;
    this.csApprovalLineState = state;
    this.loadCsApprovalLineItemData(this.vendorDetail.lineDetails)
    // this.technicalParameterLoadData(this.technicalParameterLineList);

  }

  ngAfterViewInit() {
    // //  checking condition for viewRfqcsCondition and based on that showing the tabs
    // let status = this.userData.allow_AllRFQCSView ? (this.commonServices.getAdminViewFlag() ? false : this.csApprovalCondition()) : this.csApprovalCondition();
    // if (status) {
    //   document.getElementById('cs_approvalTab1')?.classList.add('active')
    // } else {
    //   document.getElementById('cs_approvalTab2')?.classList.add('active')
    // }

  }

  loadVendorCsApprovalData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.vendorList = data;
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
  }

  getVendorsForCsApprovalApi() {
    this.eventId = this.rfqDetail.eventid;
    this.isLoading = true;
    this.eventService.getVendorsForCsApproval(this.eventId).subscribe({
      next: (result: IDefaultResponseDto<IVendorList[]>) => {
        if (result.success) {
          this.isLoading = false;
          this.vendorList = result.data;
          this.loadVendorCsApprovalData(this.vendorList);
        } else {
          this.commonServices.showToaster(result.errorDetail, false);
        }
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  CheckForVendorList(VendorLists: IVendorList[]) {
    if (VendorLists.length > 2) {
      this.reasonValidation = true;
    } else {
      this.reasonValidation = false;
    }
  }

  GetCSStatusList() {
    // console.log(this.rfqDetail);
    this.eventId = this.rfqDetail.eventid;
    this.csStatusListLoading = true;
    this.eventService.GetCSStatusList(this.eventId).subscribe({
      next: (result: IDefaultResponseDto<ICsStatusListDto[]>) => {
        if (result.success) {
          this.csStatusList = result.data.sort((a, b) => b.cS_No - a.cS_No);
          this.gridView1 = process(this.csStatusList, this.state);
          this.cdr.detectChanges();
          this.csStatusListLoading = false;

          this.cdr.detectChanges();
        } else {
          this.commonServices.showToaster(result.errorDetail, false);
        }
      },
      error: (err: any) => {
        console.log(err);
        this.csStatusListLoading = false;
        this.cdr.detectChanges();
      },
    });
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

  async onModelClickApproval(item: IVendorList, type: string) {
    switch (type) {
      case 'Suggested':
        await this.callVendorDetail(item);
        this.selectedItemVendorrank = item.vendorRank
        this.IsDetailPage = true;
        break;
    }
  }
  inputChangeHandler(index: number) {

    let enteredQty = this.csApprovalLineList[index]?.enterdQty || ''
    if (enteredQty && !this.commonServices.threeDecimalRegex.test(enteredQty.toString())) {
      return
    }

    if (index != undefined && index != null) {

      this.csApprovalLineList[index] = this.calulateNetAmountOfLineItem(this.csApprovalLineList[index])
      this.calculatesubTotal()
      this.loadCsApprovalLineItemData(this.csApprovalLineList);
      (this.csApprovalLineList[index].basePrice as any) = this.commonServices.getFixedDecimalValue(this.calculateBasePrice(this.csApprovalLineList[index] )as any);


    }
  }
  calulateNetAmountOfLineItem(item: LineDetail): LineDetail {

    if (item.isEnabled) {
      let _otherCharges: any = this.calculateOtherCharges(item)
      item.otherCharges = _otherCharges && !isNaN(_otherCharges) ? this.commonServices.getFixedDecimalValue(_otherCharges) : _otherCharges;
      item.enterdNetAmount = this.commonServices.getFixedDecimalValue(this.calculateNetAmount(item));
      
    } else {
      item.enterdQty = '';
      item.enterdNetAmount = '';
    }
    return item
  }
  
  basepriceforothercharges:any=0
  calculateOtherCharges(csApprovalItem:LineDetail){
    let otherchargesCalculation=0
    if (csApprovalItem.totalDiscount == 100) {
      this.basepriceforothercharges= 0
    }

    let discountPrice =this.commonServices.getFixedDecimalValue( csApprovalItem.unitPrice * ((csApprovalItem.totalDiscount || 0) / 100));
    this.basepriceforothercharges= this.commonServices.getFixedDecimalValue(((csApprovalItem.unitPrice - discountPrice) * (csApprovalItem.enterdQty as any))) || '';

    let qty = csApprovalItem.enterdQty ? csApprovalItem.enterdQty : 0;

console.log("this is base price",this.basepriceforothercharges);
for(let i=0;i<csApprovalItem.lineCharges.length;i++){
  if(csApprovalItem.lineCharges[i].valueType == 1){
    otherchargesCalculation=otherchargesCalculation+csApprovalItem.lineCharges[i].amount
    }
    else if(csApprovalItem.lineCharges[i].valueType == 2){
      otherchargesCalculation = otherchargesCalculation + this.commonServices.getFixedDecimalValue(this.commonServices.getFixedDecimalValue((this.commonServices.getFixedDecimalValue((this.basepriceforothercharges * (csApprovalItem.lineCharges[i].amount / 100))))))
    }
}
// csApprovalItem.lineCharges.map((val)=>{
      
//       }
//       )
    console.log("this is other calculation",otherchargesCalculation);
    return otherchargesCalculation
  }

  calculateNetAmount(item: LineDetail) {
    let qty = item.enterdQty ? item.enterdQty : 0;
    let tax = item.totalTax ? item.totalTax : 0;
    let discount = item.totalDiscount ? item.totalDiscount : 0;
    let itemPrice = this.commonServices.getFixedDecimalValue((item.unitPrice * qty));
    let discountAmt = this.commonServices.getFixedDecimalValue((this.commonServices.getFixedDecimalValue(item.unitPrice * (((item.totalDiscount || 0) / 100))))*qty);
    // let itemTotal = itemPrice - discountAmt;
    let itemTotal = this.commonServices.getFixedDecimalValue((
      item.unitPrice - 
      this.commonServices.getFixedDecimalValue(item.unitPrice * (((item.totalDiscount || 0) / 100)))
      )
      *qty);

// item.lineCharges.map((val)=>{
// if(val.valueType==1){
// this.otherchargesCalculation=this.otherchargesCalculation+val.amount
// }
// if(val.valueType==2){
// this.otherchargesCalculation=this.otherchargesCalculation +  this.commonServices.getFixedDecimalValue(this.commonServices.getFixedDecimalValue((this.commonServices.getFixedDecimalValue((itemTotal*(val.amount/100)))/item.event_Qty))*qty)
// }
// }
// )

    let grossAmount = itemTotal + item.otherCharges;
    let taxAmount = this.commonServices.getFixedDecimalValue(grossAmount * ((item.totalTax || 0) / 100))
    let netAmount = grossAmount + taxAmount

    return netAmount
  }

  calculatesubTotal() {
    let subTotalAmounts = 0;
    this.csApprovalLineList.filter((val) => val.isEnabled).forEach((item) => {
      if (item.enterdNetAmount)
       subTotalAmounts = this.commonServices.getFixedDecimalValue(subTotalAmounts + this.commonServices.getFixedDecimalValue(item.enterdNetAmount));
    });
    this.finalSubTotalForgrid2 = this.commonServices.getFixedDecimalValue(subTotalAmounts);
    this.finalTotalCharges = this.commonServices.getFixedDecimalValue(this.SubTotalCharges + this.finalSubTotalForgrid2);
  }

  calculateBasePrice(csApprovalItem: any) {

    if (csApprovalItem.totalDiscount == 100) {
      return 0
    }

    let discountPrice =this.commonServices.getFixedDecimalValue( csApprovalItem.unitPrice * ((csApprovalItem.totalDiscount || 0) / 100));
    return this.commonServices.getFixedDecimalValue(((csApprovalItem.unitPrice - discountPrice) * (csApprovalItem.enterdQty as any))) || '';

  }

  checkBoxSelectedHandler(item: LineDetail, rowindex: number) { }
  submithandler() {
    let vailid: boolean = true;
    if (!this.createApproveLoder) {
      let list = this.vendorDetail.lineDetails.filter((val) => val.isEnabled);

      if (list.length == 0) {
        this.commonServices.showToaster('Please select', false);
        vailid = false;
      }
      if (list.length != 0) {

        list.forEach(val => {
          if (!val.enterdQty) {
            this.commonServices.showToaster('CS Qty cannot be empty', false);
            vailid = false;
          } else if (val.enterdQty < 0) {
            this.commonServices.showToaster('CS Qty cannot be ', false);
            vailid = false;
          } else if (val.enterdQty && (val.enterdQty > val.remQty)) {
            this.commonServices.showToaster('CS Qty cannot be greater than Rem Qty', false);
            vailid = false;
          }
        })

        // for (let i = 0; i < list.length; i++) {



        //   if (!list[i].enterdQty && (list[i].enterdQty > list[i].remQty)) {

        //     return;
        //   }
        //   if (list[i].enterdQty < 0) {

        //     vailid = false;
        //     return;
        //   }
        // }
      }
      if (vailid) {
        this.openCsApprovalSubmitModel();
        this.commonServices.clearToaster();
      }
    }
  }

  openCsApprovalSubmitModel() {
    this.commonServices.clearToaster();
    const modal: NgbModalRef = this.modalService.open(
      CsAppovalSubmitPopupComponent,
      { centered: true }
    );
    modal.componentInstance.title = 'Buyer Remark';
    modal.componentInstance.placeholderName = 'Enter Remark';
    modal.componentInstance.RemarksCondition = this.reasonValidation;
    modal.componentInstance.vendorRankCondition = this.selectedItemVendorrank;
    // modal.componentInstance.value = item ? item.terms : '';
    return modal.result.then(
      (result: string) => { },
      (reason) => {
        if (reason) {
          let list = this.vendorDetail.lineDetails.filter(
            (val: LineDetail) => val.isEnabled
          );
          let qtyDtoPayload = list.map((val: LineDetail) => {
            return {
              eventTranId: val.eventTranId,
              quantity: val.enterdQty,
            };
          });
          let data = {
            eventId: list[0].eventId,
            vendorId: list[0].vendorId,
            remarks: reason.Remarks,
            vendorReason: reason.vendorReason,
            qtyDto: qtyDtoPayload,
            vendorReasonId: reason.VendorReasonId,
          };
          this.createCsApproval(data);
        }
      }
    );
  }

  openRemarkModel() {
    this.commonServices.clearToaster();
    const modal: NgbModalRef = this.modalService.open(
      SingleInputModalComponent,
      { centered: true }
    );
    modal.componentInstance.title = 'Buyer Remark';
    modal.componentInstance.placeholderName = 'Enter Remark';
    modal.componentInstance.RemarksCondition = this.reasonValidation;
    // modal.componentInstance.value = item ? item.terms : '';
    return modal.result.then(
      (result: string) => { },
      (reason) => {
        if (reason) {
          let list = this.csApprovalLineItemGrid.data.filter(
            (val: LineDetail) => val.isEnabled
          );
          let qtyDtoPayload = list.map((val: LineDetail) => {
            return {
              eventTranId: val.eventTranId,
              quantity: val.qty,
            };
          });
          let data = {
            eventId: list[0].eventId,
            vendorId: list[0].vendorId,
            remarks: reason,

            qtyDto: qtyDtoPayload,
          };
          this.createCsApproval(data);
        }
      }
    );
  }

  createApproveLoder: boolean = false;

  createCsApproval(payload: any) {
    if (!this.filePath) {
      // this.commonServices.setGlobalLoaderStatus(true);
    }
    this.createApproveLoder = true;
    this.eventService.createCSApproval(payload).subscribe({
      next: (result: IDefaultResponseDto<any>) => {
        if (result.success) {
          this.createApproveLoder = false;
          // this.commonServices.setGlobalLoaderStatus(false);
          this.awardId = parseInt(result.data);
          if (this.filePath) {
            this.uploadCsApprovalDocument(this.awardId);
          }



          this.backButton('csApproval');
          this.getVendorsForCsApprovalApi();
          this.GetCSStatusList();
          this.commonServices.showToaster('CS Submitted Successfully', true);


          this.cdr.detectChanges();
          // this.commonServices.setGlobalLoaderStatus(false);
        } else {
          this.createApproveLoder = false;
          // this.commonServices.setGlobalLoaderStatus(false);
          this.commonServices.showToaster(result.errorDetail, false);
        }
      },
      error: (err: any) => {
        console.log(err);
        this.createApproveLoder = false;
        this.commonServices.showToaster(err.ErrorDetail, false);
        this.cdr.detectChanges();
        // this.commonServices.setGlobalLoaderStatus(false);
      },
    });
  }

  callVendorDetail(item: IVendorList) {
    this.SelectedVendor = item;
    this.eventService
      .getVendorDetailForCsApproval(item.eventId, item.vendorId)
      .subscribe({
        next: (result: IDefaultResponseDto<IVendorDetail>) => {
          if (result.success) {
            this.isLoading = false;
            this.vendorDetail = result.data;
            this.SubTotalCharges = 0;
            this.TotalAmount = 0;
            this.TotalCharges = 0;


            for (let i = 0; i < this.vendorDetail.lineDetails.length; i++) {
              this.TotalAmount =
                this.TotalAmount + this.vendorDetail.lineDetails[i].totalPrice;
              this.vendorDetail.lineDetails[i].unittaxupdated = this.commonServices.getFixedDecimalValue(this.vendorDetail.lineDetails[i].totalTax);
            }
            for (
              let i = 0;
              i < this.vendorDetail.otheChargesDetails.length;
              i++
            ) {
              this.SubTotalCharges = this.commonServices.getFixedDecimalValue(
                this.SubTotalCharges +
                this.vendorDetail.otheChargesDetails[i].amount
              );
            }
            this.TotalCharges = this.SubTotalCharges + this.TotalAmount;
            // this.csApprovalLineList =
            this.loadCsApprovalLineItemData(this.vendorDetail.lineDetails)
            // this.csApprovalLineItemGrid = process(this.vendorDetail.lineDetails, this.state);
            this.gridView3 = process(
              this.vendorDetail.otheChargesDetails,
              this.state
            );
            // let list = Object.keys(this.publishEventData);
            // this.tabList = list
            //   .filter((val) => val != 'eventId')
            //   .map((val: string) => {
            //     let obj: any = {};
            //     obj.tabName = val;
            //     obj.value = result.data[val];
            //     return obj;
            //   });
            this.cdr.detectChanges();
          } else {
            this.commonServices.showToaster(result.errorDetail, false);
            this.isLoading = false;
          }
        },
        error: (err: any) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }
  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      let pageSize = state.skip / state.take + 1;
      // if (pageSize != this.pageNumber) {
      //   this.pageNumber = pageSize;
      //   this.getMyPrList();
      // } else {
      // }
      this.loadData(this.vendorList);
    }
  }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    // this.vedordashboarddata = data;
    // this.gridView = {
    //   data: filterData,
    //   total: data.length,
    // };
    this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
  }
  showBadgeStatusColorClass(type: string): string {
    let color: string = '';
    switch (type) {
      case 'InReview':
        color = 'badge-light-warning';
        break;
      case 'Approved':
        color = 'badge badge-light-success';
        break;
      case 'Rejected':
        color = 'badge-light-danger';
        break;
      case 'Pending':
        color = 'badge-light-info';
        break;
      case 'Closed':
        color = 'badge-light-danger';
        break;

      default:
        break;
    }
    return color;
  }
  onFilterAllField(event: any) {
    //console.log("Value : ", event.target.value);

    let inputValue;
    if (event) {
      inputValue = event.target.value;
      this.serachText = inputValue;
    } else {
      inputValue = this.serachText;
    }
    let filterData = this.getFilteredData(inputValue);
    // let filterData = this.getFilteredData(inputValue);
    this.gridView = process(this.vendorList, this.state);
  }
  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.vendorList, {
        filters: [
          {
            filters: [
              {
                field: 'eventId',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'vendorId',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'vendorCode',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'vendorName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'grossAmount',
                operator: 'contains',
                value: inputValue,
              },
            ],
            logic: 'or',
          },
        ],
        logic: 'or',
      });
    } else {
      return filterBy(this.vendorList, this.filter);
    }
  }
  closeFilter(type: any) {
    debugger;

  }
  confirmationModalForRfqCreate(item: any) {
    let prid: number = item.prid;
    let pR_NUM: string = item.pR_NUM;
  }
  openAuctionDrawer(item: any) {
  }

  showCsStatusColorClass(type: string): string {
    let color: string = '';
    switch (type) {
      case 'InReview':
        color = 'badge badge-light-warning';
        break;
      case 'Approved':
        color = 'badge badge-light-success';
        break;

      case 'Rejected':
        color = 'badge badge-light-danger';
        break;
      case 'Pending':
        color = 'badge-light-info';
        break;
      case 'Closed':
        color = 'badge-light-danger';
        break;

      default:
        break;
    }
    return color;
  }

  actionOptionsForPrLines(item: any) {
    // return item.isEventCreation
    //   ? this.dropdownListdata
    //   : this.dropdownListWithoutrfq;
    return item.list;
  }
  backButton(type: string) {
    switch (type) {
      case 'csApproval':
        this.IsDetailPage = false;
        this.finalSubTotalForgrid2 = 0;
        this.finalTotalCharges = this.SubTotalCharges;
        this.isSelectAllChecked = false;
        this.getVendorsForCsApprovalApi();
        this.GetCSStatusList();
        this.cdr.detectChanges();
        break;

      case 'csStatus':
        this.csStatusDetailPage = false;
        break;

      default:
        break;
    }
  }
  changeInQuantity(amount: any, type: string) {
    this.TotalAmount = 0;
    for (let i = 0; i < this.vendorDetail.lineDetails.length; i++) {
      this.vendorDetail.lineDetails[i].totalPrice =
        this.vendorDetail.lineDetails[i].unitPrice *
        this.vendorDetail.lineDetails[i].qty;
      this.TotalAmount =
        this.TotalAmount +
        this.vendorDetail.lineDetails[i].totalPrice +
        this.vendorDetail.lineDetails[i].otherCharges;
      this.TotalCharges = this.SubTotalCharges + this.TotalAmount;
    }
    // console.log("item",event);
  }

  getValidation(item: LineDetail) {
    return this.inValidate && (item.qty == 0 || item.remainingQty < item.qty);
  }

  // GetCSDetails

  showcsDetail() { }

  showReviewModel(item: ICsStatusListDto) {
    let modelRef = this.addVendorModel.open(ReviewPendingCsPopupComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    modelRef.componentInstance.awardId = item.cS_No;
  }

  selectAllChangeHandler() {
    this.csApprovalLineList = this.csApprovalLineList.map(val => {
      val.enterdQty = this.isSelectAllChecked ? val.remQty : ''
      val.isEnabled = this.isSelectAllChecked;
      (val.basePrice as any) = this.calculateBasePrice(val) ;
      val.enterdNetAmount = this.isSelectAllChecked ? this.commonServices.getFixedDecimalValue( this.calulateNetAmountOfLineItem(val).enterdNetAmount as any) : ''
      return val
    })
    this.calculatesubTotal();
    this.loadCsApprovalLineItemData(this.csApprovalLineList)
    this.cdr.detectChanges();
  }

  onSelected(event: any) {
    this.file = event.target.files[0];
    this.filePath = event.target.value;
  }


  openCsApprovalUploadModal() {
    const modelRef = this.uploadDocumentModal.open(
      CsApprovalUploadDocumentComponent,
      {
        centered: true,
        fullscreen: false,
        scrollable: true,
      }
    );

    // modelRef.componentInstance.type = type;

    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.result
      .then(
        (result) => {
          if (result) {
            (this.file = result.file),
              (this.filePath = result.filePath),
              (this.documentname = result.description);
            console.log(this.file);
            this.commonServices.showToaster('File Added Successfully', true);
          }

          // this.loadData(result);

          this.cdr.detectChanges();
          // this.gridView = result;
        },
        () => { }
      )
      .catch((e) => {
        console.log('Error occured', e);
      });
  }
  getAllEventVendor() {
    // this.loading = true;
    this.eventService.GetAllEventVendor(this.rfqDetail.eventid).subscribe({
      next: (result: any) => {
        let vendorData = result.data;
        this.CheckForVendorList(vendorData);
      },
      error: (err) => { },
    });
  }

  uploadCsApprovalDocument(AwardId: number) {
    // this.commonServices.setGlobalLoaderStatus(true);
    this.eventService
      .uploadCsApprovalDocument(
        AwardId,
        this.documentname,
        this.file,
        this.filePath
      )
      .subscribe({
        next: (result: any) => {
          if (result.success) {
            this.commonServices.showToaster('file uploaded Successfully', true);
            // this.commonServices.setGlobalLoaderStatus(false);
          } else {
            this.commonServices.showToaster('file not uploaded', false);
            // this.commonServices.setGlobalLoaderStatus(false);
          }
        },
        error: (err: any) => {
          console.log(err);
          this.commonServices.showToaster(err, false);
          // this.commonServices.setGlobalLoaderStatus(false);
        },
      });
  }

  singleCheckBoxChangeHandler(index: number) {
    if (index !== undefined && index !== null) {

      if (this.csApprovalLineList[index].isEnabled) {
        this.csApprovalLineList[index].enterdQty = this.csApprovalLineList[index].remQty
      }


      // if all the are checked then select all will be selected
      this.isSelectAllChecked = this.csApprovalLineList.every(val => val.isEnabled)
      this.csApprovalLineList[index] = this.calulateNetAmountOfLineItem(this.csApprovalLineList[index])
      this.calculatesubTotal();
      this.loadCsApprovalLineItemData(this.csApprovalLineList);
      (this.csApprovalLineList[index].basePrice as any) = this.csApprovalLineList[index].isEnabled ? this.commonServices.getFixedDecimalValue(this.calculateBasePrice(this.csApprovalLineList[index])as any) : '';


    }
  }


  loadCsApprovalLineItemData(lineDetailList: Array<LineDetail>) {
    let sortedData = orderBy(lineDetailList, this.csApprovalLineSort);
    let filterData = filterBy(sortedData, this.csApprovalLinefilter);
    this.csApprovalLineList = lineDetailList;
    this.csApprovalLineItemGrid = process(filterData, this.csApprovalLineState);
    this.cdr.detectChanges()
  }

  csApprovalActionButtonCondition() {

    if (this.commonServices.getAdminViewFlag()) {
      return false
    } else {
      let eventStatus = this.rfqDetail.eventStatus;
      switch (this.authData?.userRole) {
        case 'Buyer':
          if (eventStatus == 'Closed') {
            return true;
          }
          else if (eventStatus == 'Terminated') {
            return false;
          }
          break;
        default:
          return false
      }
    }

  }

  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonServices.checkPermission(key)
  }

}
