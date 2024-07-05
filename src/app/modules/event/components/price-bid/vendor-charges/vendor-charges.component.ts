import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IChargeNRemarkDataDto,
  IGrossAmountInfo,
  IItemAmountInfo,
  IOtherChargeNRemarkVendorDataDto,
  IPriceBidLinesListDataDto,
  IPriceBidResultDataDto,
  IPriceBidVendorDetailDataDto,
  IRfqDetailDataDto,
  PublishChecklistResponseDto,
} from '../../../event.interface';
import {
  FilterDescriptor,
  SortDescriptor,
  State,
  filterBy,
  orderBy,
  process,
} from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VendorChargesEditComponent } from './vendor-charges-edit/vendor-charges-edit.component';
import { SubmitBidPopUpComponent } from './submit-bid-pop-up/submit-bid-pop-up.component';
import { EventService } from '../../../event.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { AddSubItemsComponent } from '../add-sub-items/add-sub-items.component';
import { VendorAddSubItemsComponent } from './vendor-add-sub-items/vendor-add-sub-items.component';
import { InfoPopupComponent } from '../info-popup/info-popup.component';

@Component({
  selector: 'app-vendor-charges',
  templateUrl: './vendor-charges.component.html',
  styleUrls: ['./vendor-charges.component.scss'],
})
export class VendorChargesComponent {
  chargeNRemarkData: IPriceBidVendorDetailDataDto;
  @Input() priceBidLinesList: IPriceBidLinesListDataDto[] = [];
  @Input() priceBidColumnList: any = [];
  @Input() eventId: number;
  @Input() rfqDetail: IRfqDetailDataDto;
  @Input() templateId: number | undefined;
  @Input() publishCheckList: PublishChecklistResponseDto;
  @Output() updateCheckList$ = new EventEmitter();


  activeTab: string = 'ITEM_CHARGES';
  userType: string | undefined;

  typeAccess: any = {
    SELECT_PRICE_BID_TEMPLATE: 'Select Price Bid Template',
    CURRENCY: 'Currency',
    SHOW_EVENT_CURRENCY: 'Show Event currency',
    SELECT_PRICE_BID_CHARGES: 'Select Price Bid Charges',
    ADD_PRICE_BID_CHARGES: 'Add Price Bid Charges',
    CHARGES_REMARKS_COLOUMNS: 'Charges Remarks Coloumns',
    ADD_LINE_ITEM_REMARK: 'Add Line Item Remark',
    LINE_ITEMS_QTY: 'Line Items Qty',
    ADD_SUB_ITEM: 'Add Sub Item',
    OTHER_HEADER_LEVEL_CHARGES: 'Other Header Level Charges',
    OTHER_HEADER_LEVEL_CHARGES_DOCUMENTS:
      'Other Header Level Charges Documents',
    NON_PRICING_TITLES: 'Non Pricing Titles',
  };

  headerStyle = 'fw-bold';
  public state: State = {};
  pageSize: number = 1;
  loading: boolean = false;

  public priceBidLinesGridView: GridDataResult;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private commonService: CommonService,
    private infoHandler: NgbModal,
  ) { }

  public ngOnInit() {
    let authData = this.commonService.getAuthData();
    this.userType = authData?.userRole;

    this.priceBidLinesLoadData(this.priceBidLinesList);
    this.getChargesNRemarksServiceCall();
    this.cdr.detectChanges();
  }

  //Price Bid Columns
  getChargesNRemarksServiceCall(flag?: number) {
    this.loading = true;
    this.eventService.getVendorChargesNCRemarks(this.eventId).subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.chargeNRemarkData = result.data;
        this.chargeNRemarkData.pBLines.map(
          (val: IOtherChargeNRemarkVendorDataDto) => {
            val.valueType = val.valueType ? val.valueType : 1;
            val.cR_Value = val.cR_Value ? val.cR_Value : '';
            val.totalAmount = val.totalAmount ? val.totalAmount : '';
            val.amount = val.amount ? val.amount : '';
          }
        );
        this.calculateTotalGrossAmount();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  priceBidLinesLoadData(data: any) {
    this.priceBidLinesList = data;
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.priceBidLinesGridView = process(filterData, this.state);
  }

  public onStateChange(state: any) {
    if (!this.loading) {
      // this.sort = state.sort;
      // this.filter = state.filter;
      // this.state = state;
      // let pageSize = state.skip / state.take + 1;
      // if (pageSize != this.pageNumber) {
      //   this.pageNumber = pageSize;
      //   this.getMyPrList();
      // } else {
      //   this.loadData(this.myPrData);
      // }
    }
  }

  openVendorEditCharges(item: IPriceBidLinesListDataDto, index: number) {
    const modelRef = this.modalService.open(VendorChargesEditComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
      keyboard: false
    });

    modelRef.componentInstance.rfqDetail = this.rfqDetail;
    modelRef.componentInstance.eventTranId = item.eventTranId;
    modelRef.componentInstance.publishCheckList = this.publishCheckList;
    modelRef.componentInstance.priceBidColumnList = this.priceBidColumnList;
    modelRef.componentInstance.eventId = this.eventId;
    modelRef.componentInstance.templateId = this.templateId;
    modelRef.componentInstance.itemLineInfo = item;
    modelRef.componentInstance.previousCurrentBid = item.netAmount
    modelRef.result.then(
      (err) => {
      },
      (data) => {
        if (data) {
          let itemAmountInfo: IItemAmountInfo = JSON.parse(data);
          this.priceBidLinesList[index].discountPer =
            itemAmountInfo.discountPer;
          this.priceBidLinesList[index].totalDiscount =
            itemAmountInfo.totalDiscount;
          this.priceBidLinesList[index].unitPrice = itemAmountInfo.unitPrice;
          this.priceBidLinesList[index].netAmount = itemAmountInfo.netAmount;
          this.priceBidLinesList[index].bidStatus = itemAmountInfo.bidStatus;
          this.priceBidLinesList[index].totalDiscount = itemAmountInfo.totalDiscount;
          this.priceBidLinesList[index].totalTax = itemAmountInfo.totalTax;

          this.priceBidLinesLoadData(this.priceBidLinesList);
          this.calculateTotalGrossAmount();
          this.updateCheckList()

          this.cdr.detectChanges();
        }
      }
    );
  }

  calculateTotalGrossAmount() {
    this.chargeNRemarkData.otherCharges = 0;
    this.chargeNRemarkData.netAmount = 0;
    this.chargeNRemarkData.totalTaxAmount = 0;
    this.chargeNRemarkData.totalAmount = 0;

    this.priceBidLinesList.forEach((element: IPriceBidLinesListDataDto) => {
      if (element.netAmount) {
        this.chargeNRemarkData.netAmount = this.commonService.getFixedDecimalValue(this.chargeNRemarkData.netAmount + element.netAmount);
      }
      if (element.taxAmount) {
        this.chargeNRemarkData.totalTaxAmount = this.commonService.getFixedDecimalValue(this.chargeNRemarkData.totalTaxAmount + element.taxAmount);
      }
    });

    this.chargeNRemarkData.pBLines.forEach(
      (element: IOtherChargeNRemarkVendorDataDto) => {
        if (!element.isEdit) {
          if (element.valueType == 2) {
            let perV = element.amount;
            if (perV)
              element.totalAmount = this.commonService.getFixedDecimalValue((this.chargeNRemarkData.netAmount * (perV / 100)));
            else element.totalAmount = 0;

            this.cdr.detectChanges();
          }
          this.chargeNRemarkData.otherCharges =
            element.cR_Type == 'OtherCharges' && element.totalAmount
              ? this.commonService.getFixedDecimalValue((this.chargeNRemarkData.otherCharges + element.totalAmount))
              : this.chargeNRemarkData.otherCharges;
          // this.totalGrossAmount.incoTerm = element.cR_Type == 'IncoTerms' && element.chargeValue ? (this.totalGrossAmount.incoTerm + element.chargeValue) : this.totalGrossAmount.incoTerm;
        }
      }
    );

    this.chargeNRemarkData.totalAmount = this.commonService.getFixedDecimalValue((this.chargeNRemarkData.netAmount + this.chargeNRemarkData.otherCharges));
    this.cdr.detectChanges();
  }

  getPricing(type: string) {
    return this.chargeNRemarkData.pBLines.filter(
      (val: any) => val.cR_Type == type
    );
  }

  getCharges(type: string) {
    return this.chargeNRemarkData.pBLines.filter(
      (val: any) => val.cR_Type == type
    );
  }

  openSubmitBidPop() {
    // valdations
    let errorMessage: string = this.validateChargeNRemarkData()
    if (errorMessage) {
      this.commonService.showToaster(errorMessage, false)
      return
    }


    const modelRef = this.modalService.open(SubmitBidPopUpComponent, {
      centered: true,
      fullscreen: false,
      scrollable: true,
    });

    modelRef.componentInstance.eventId = this.eventId;
    modelRef.result.then(
      (result) => {
        //if(result)
        //this.submitBidServiceCall();
      },
      (err) => { }
    );
  }

  validateChargeNRemarkData(): string {
    if (this.chargeNRemarkData?.pBLines?.length != 0) {
      /*checking if all mandatory fields in the "PaymentTerms & IncoTerms" section are filled out correctly. */
      let isChargesValid = this.chargeNRemarkData?.pBLines.filter(val => val.cR_Type == 'OtherCharges').every(val => {
        // console.log("validate", (val.totalAmount !== ''))
        // console.log("QTY", (val.totalAmount))
        return val.valueType == 1 ? (val.totalAmount !== '' && val.totalAmount >= 0 && !val.isEdit ) : (val.amount !== '' && val.amount >= 0 && !val.isEdit )
      })
      if (!isChargesValid) {
        return 'Please fill out all mendatory filed in Pricing (Other charges).'
      }

      /*checking if all mandatory fields in OtherCharges section is filled out correctly. */
      let isAllRemarksAvailable = this.chargeNRemarkData?.pBLines.filter(val => val.cR_Type != 'OtherCharges').every(val => {
        return val.cR_Value != '' && val.cR_Value != undefined && val.cR_Value != null && !val.isEdit
      })
      if (!isAllRemarksAvailable) {
        return 'Please fill out all mendatory filed in Pricing Remark.'
      }
    }
    return ''
  }


 async chargeCancelButton(index: number, type: string) {
    debugger;
    switch (type) {
      case 'Edit':
        this.chargeNRemarkData.pBLines[index].isEdit = true;
        break;
      case 'Save':
        // if (!this.commonService.twoDecimalRegex.test(this.chargeNRemarkData.pBLines[index].amount.toString())) {
        //   this.commonService.showToaster('The value cannot exceed more than two decimal points.', false)
        //   return
        // }
        let isValid =await this.commonService.eventPublishedChecker(this.eventId) 
        if(isValid){
          if (!this.commonService.twoDecimalRegex.test(this.chargeNRemarkData.pBLines[index].valueType == 1 ? this.chargeNRemarkData.pBLines[index].totalAmount.toString() : this.chargeNRemarkData.pBLines[index].amount.toString())) {
            this.commonService.showToaster('The value cannot exceed more than two decimal points.', false)
            return
          }
  
          this.chargeNRemarkData.pBLines[index].isEdit = false;
          this.setOtherChargesAmountCal(index);
        }
        else{
          this.commonService.showToaster('Event Already Closed',false);
        }


      
        break;
      case 'Cancel':
        this.chargeNRemarkData.pBLines[index].isEdit = false;
        //this.chargeCardList[index].remark = this.priceBidLinesList[index]?.old_remarks;
        //this.priceBidLinesLoadData(this.priceBidLinesList);
        break;
      default:
        break;
    }

    this.cdr.detectChanges();
  }

 async nonPricingCancelButton(index: number, type: string) {
    debugger;
    switch (type) {
      case 'Edit':
        this.chargeNRemarkData.pBLines[index].isEdit = true;
        break;
      case 'Save':
        let isValid =await this.commonService.eventPublishedChecker(this.eventId) 
     if(isValid){
      this.chargeNRemarkData.pBLines[index].isEdit = false;
     this.saveDataServiceCall(this.chargeNRemarkData.pBLines[index]);
      }
        else{
          this.commonService.showToaster('Event Already Closed',false);
          }
        
        break;
      case 'Cancel':
        this.chargeNRemarkData.pBLines[index].isEdit = false;
        //this.chargeNRemarkData.pBLines[index].cR_Value = this.priceBidLinesList[index]?.old_remarks;
        break;

      default:
        break;
    }

    this.cdr.detectChanges();
  }

  setOtherChargesAmountCal(index: number) {
    debugger;
    if (this.chargeNRemarkData.pBLines[index].valueType == 2) {
      let perV = this.chargeNRemarkData.pBLines[index].amount;
      if (perV)
        this.chargeNRemarkData.pBLines[index].totalAmount = this.commonService.getFixedDecimalValue((this.chargeNRemarkData.netAmount * (perV / 100)));
      else this.chargeNRemarkData.pBLines[index].totalAmount = 0;

      this.cdr.detectChanges();
    }

    this.calculateTotalGrossAmount();

    setTimeout(() => {
      this.saveDataServiceCall(this.chargeNRemarkData.pBLines[index]);
    }, 10);
    this.cdr.detectChanges();
  }

  setValueTypeCal(index: number) {
    this.chargeNRemarkData.pBLines[index].amount = 0;
    this.chargeNRemarkData.pBLines[index].totalAmount = 0;
    this.chargeNRemarkData.pBLines[index].isEdit = false;
    this.cdr.detectChanges();
  }

  saveDataServiceCall(item: IOtherChargeNRemarkVendorDataDto) {
    // loader on
    let pb: IOtherChargeNRemarkVendorDataDto[] = [];
    pb.push(item);

    let payload = {
      eventId: this.eventId,
      netAmount: this.chargeNRemarkData.netAmount,
      otherCharges: this.chargeNRemarkData.otherCharges,
      totalAmount: this.chargeNRemarkData.totalAmount,
      pBLines: pb.map(val => {
        val.amount = val.amount ? val.amount : 0
        val.totalAmount = val.totalAmount ? val.totalAmount : 0
        return val
      }),
    };

    this.eventService.saveChargesNRemarksByVendor(payload).subscribe({
      next: (result: IPriceBidResultDataDto) => {
        // loader off
        if (result.success) {
          this.commonService.showToaster('Saved successfully', true);
        } else {
          this.commonService.showToaster(result.errorDetail, false);
        }
      },
      error: (err) => { },
    });
  }

  checkConditionForAccess(type: string): boolean {
    let eventStatus = this.rfqDetail.eventStatus;

    switch (this.userType) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          switch (type) {
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return false;
          }
        } else if (eventStatus == 'Unpublished') {
          switch (type) {
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return true;
          }
        }

        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          switch (type) {
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return false;
          }
        } else if (eventStatus == 'Unpublished') {
          switch (type) {
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return false;
          }
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

    return false;
  }

  openSubItemVendorModal(item: IPriceBidLinesListDataDto, index: number) {
    const modelRef = this.modalService.open(VendorAddSubItemsComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });



    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.componentInstance.eventTranId = item.eventTranId;
    modelRef.componentInstance.rfqDetail = this.rfqDetail;
    modelRef.result.then(
      (err) => {
        console.log('Detail', err);
        this.openVendorEditCharges(item, index);
      },
      (data) => {
        if (data) {
          this.priceBidLinesList[index].unitPrice = data;
          this.openVendorEditCharges(item, index);
          this.cdr.detectChanges();
        }
      }
    );
  }

  submitBidCondition() {
    let eventStatus = this.rfqDetail.eventStatus;

    if (
      eventStatus == 'Published' &&
      this.rfqDetail.vendorStatus == 'Participated' && this.publishCheckList.vendorTechnical == 'Yes' && this.publishCheckList.vendorTNC == 'Yes'
    ) {
      return true;
    } else {
      return false;
    }
  }
  submitBidConditionForLine(){
    if(this.rfqDetail.eventType=="3"){
      let eventStatus = this.rfqDetail.eventStatus;

      if (
        eventStatus == 'Published' &&
        this.rfqDetail.vendorStatus == 'Participated' && this.publishCheckList.vendorTechnical == 'Yes' && this.publishCheckList.vendorTNC == 'Yes'
      ) {
        return true;
      } else {
        return false;
      }
    }
    else{
      return false;
    }
  }
  lineInformationEditHandler() {
    let eventStatus = this.rfqDetail.eventStatus;

    if (
      eventStatus == 'Published' &&
      this.rfqDetail.vendorStatus == 'Participated' && this.publishCheckList.vendorTechnical == 'Yes' && this.publishCheckList.vendorTNC == 'Yes'
    ) {
      return true;
    } else {
      return false;
    }
  }

  getTotalTaxAmount(): string {
    let amount = this.priceBidLinesList.reduce((prev: number, curr) => {
      prev += curr.totalTax ? curr.totalTax : 0
      return prev
    }, 0)
    return amount.toFixed(2)
  }


  otherChargeTypeCondtion() {

    if (
      this.rfqDetail.eventStatus == 'Published' &&
      this.rfqDetail.vendorStatus == 'Participated' && this.publishCheckList.vendorTechnical == 'Yes' && this.publishCheckList.vendorTNC == 'Yes') {
      return false
    } else {
      return true
    }
  }


  updateCheckList() {
    this.updateCheckList$.emit();
  }
  infoButtonHandler(item: any) {
    const modelRef = this.infoHandler.open(InfoPopupComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    modelRef.componentInstance.rfqDetail = this.rfqDetail;
    modelRef.componentInstance.eventTransId = item.eventTranId;
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

  // editDisableButtonCondition() {

  //   return this.rfqDetail.eventStatus == 'Published' &&
  //     this.rfqDetail.vendorStatus == 'Participated' &&
  //     this.publishCheckList.vendorTechnical == 'Yes' && this.publishCheckList.vendorTNC == 'Yes' ? false : true


  // }

  checkValidationCondition(){
    if(this.rfqDetail.eventType=='3'){
return true
    }
    else{
      return false
    }
  }


}
