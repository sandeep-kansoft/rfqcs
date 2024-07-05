import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { PrGridData } from 'src/app/modules/purchase-requisition/pr-all-view/data';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  IRfqDetailDataDto,
  IPriceBidTemplatesListDataDto,
  IPriceBidLinesListDataDto,
  IPriceBidChargesListDataDto,
  IPriceOtherChargesListDataDto,
  IPriceBidResultDataDto,
  IPriceBidColumnDataDto,
  IIncoTermsDataDto,
  IPaymentTermDataDto,
  IChargeNRemarkDataDto,
  EventDashboardEnums,
  PublishChecklistResponseDto,
} from '../../event.interface';
import { EventService } from '../../event.service';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SingleInputModalComponent } from '../single-input-modal/single-input-modal.component';
import { PriceBidPopUpComponent } from './price-bid-pop-up/price-bid-pop-up.component';
import { OtherChargesPopUpComponent } from './other-charges-pop-up/other-charges-pop-up.component';
import {
  ICommmonDataDto,
  ICurrencyDataDto,
} from 'src/app/shared/services/common.interface';
import { catchError, forkJoin, map, of } from 'rxjs';
import { AddManPowerItemComponent } from './add-man-power-item/add-man-power-item.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AddSubItemsComponent } from './add-sub-items/add-sub-items.component';
import { ScrollTopComponent } from 'src/app/_metronic/kt/components';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { CopyeventModalComponent } from '../../event-dashboard/copyevent-modal/copyevent-modal.component';
import { InfoPopupComponent } from './info-popup/info-popup.component';
import { PriceBidPoHistoryComponent } from './price-bid-po-history/price-bid-po-history.component';
import { ShortCloseModelComponent } from './short-close-model/short-close-model.component';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';
// import { PriceBidPoHistoryComponent } from './price-bid-po-history/price-bid-po-history.component';
@Component({
  selector: 'app-price-bid',
  templateUrl: './price-bid.component.html',
  styleUrls: ['./price-bid.component.scss'],
})
export class PriceBidComponent {
  typeAccess: any = {
    SELECT_PRICE_BID_TEMPLATE: 'Select Price Bid Template',
    CURRENCY: 'Currency',
    SHOW_EVENT_CURRENCY: 'Show Event currency',
    SELECT_PRICE_BID_CHARGES: 'Select Price Bid Charges',
    ADD_PRICE_BID_CHARGES: 'Add Price Bid Charges',
    CHARGES_REMARKS_COLOUMNS: 'Charges Remarks Coloumns',
    OTHER_REMARKS: 'Other Remarks',
    ADD_ITEMS: 'Add Items',
    ADD_MAN_POWER_ITEM: 'Add man power item',
    ADD_LINE_ITEM_REMARK: 'Add Line Item Remark',
    LINE_ITEMS_QTY: 'Line Items Qty',
    ADD_SUB_ITEM: 'Add Sub Item',
    OTHER_HEADER_LEVEL_CHARGES: 'Other Header Level Charges',
    OTHER_HEADER_LEVEL_CHARGES_DOCUMENTS:
      'Other Header Level Charges Documents',
    NON_PRICING_TITLES: 'Non Pricing Titles',

  };

  @Input() rfqDetail: IRfqDetailDataDto;
  // @Output() setTabCompletedStatus$ = new EventEmitter<{
  //   type: string;
  //   status: boolean;
  // }>();
  loading: boolean = false;
  authData: AuthModel | null | undefined;

  priceBidColumnList: Array<any> = [];
  priceBidParameterList: Array<any> = [];
  otherChargesParameterList: Array<any> = [];
  custompaymentcheckbox: boolean = false;
  selectedTemplateName: string = '';
  bidTemplatesList: IPriceBidTemplatesListDataDto[] = [];
  priceBidLinesList: IPriceBidLinesListDataDto[] = [];
  priceBidChargesList: IPriceBidChargesListDataDto[] = [];
  priceBidChargesDropDown: any[] = [];
  incoTermsChargeList: IIncoTermsDataDto[];
  incotermsdropdown: any[]
  paymentTermsChargeList: IPaymentTermDataDto[];
  paymentTermsChargeDropdown: any[] = [];
  otherChargesList: IPriceOtherChargesListDataDto[];
  currenciesList: ICurrencyDataDto[] = [];

  otherChargeCardList: any = [];
  nonPricingCardList: any = [];
  incoTermsCardList: any = [];
  payemntTermsCardList: any = [];

  chargeCardList: IChargeNRemarkDataDto[] = [];
  pricingCardList: IChargeNRemarkDataDto[] = [];

  chargeNRemarkList: IChargeNRemarkDataDto[] = [];
  savePriceBidRemarksLoader: boolean = false;
  public priceBidLinesGridView: GridDataResult;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  @Output() updateCheckList$ = new EventEmitter();
  @Output() syncRfqDetail = new EventEmitter();
  @Input() publishCheckList: PublishChecklistResponseDto
  message: string = ''
  isShowMessage: boolean = false


  currencyItem: any;
  currencyId: number | undefined;

  templateId: number | undefined;
  oldTemplateId: number | undefined;

  public state: State = {};
  pageSize: number = 1;
  columnWidth = 150;
  headerStyle = 'fw-bold';
  longColumnWidth = 200;
  extraSmallColumnWidth = 50;
  smallColumnWidth = 100;
  mediumColumnWidth = 120;
  largeColumnWidth = 170;
  xtraLargeColumnWidth = 190;
  xtraXtraLargeColumnWidth = 280;
  selectDescription: string = '-----Select-----'

  changeTempCurr: boolean = false;

  userType: string | undefined;

  constructor(
    private commonService: CommonService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private infoHandler: NgbModal,
    private poHistoryData: NgbModal
  ) { }

  public ngOnInit() {
    this.initLoad()
  }


  initLoad() {
    this.authData = this.commonService.getAuthData();
    this.userType = this.authData?.userRole;
if(this.userType=="Vendor"){
  this.GetVendorEventCurrency();
}

    if (this.userType == 'Buyer') this.getPriceBidTemplatesServiceCall();
    this.getPriceBidLinesServiceCall();
    this.getPriceBidColumnsServiceCall();
    this.getCurrenciesServiceCall();
    this.getChargesNRemarksServiceCall();
    this.getPriceBidChargesServiceCall();
    this.getIncoTermsServiceCall();
    this.getPaymentTermsServiceCall();
    this.updateCheckList();
    this.checkpaymentandincotermscondition();
    console.log("rfqDetail",this.rfqDetail,this.authData)
  }
  checkVendorCondition(){
  if(this.userType=="Vendor"){
    return true
  }
  else{
    return false;
  }
  }
  //Price Bid Charges
  getPriceBidChargesServiceCall() {
    this.loading = true;
    this.eventService.getPriceBidCharges().subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.priceBidChargesList = []

        let obj: IPriceBidChargesListDataDto = {
          charges_ID: 0,
          markupCode: this.selectDescription,
          transTxt: '',
        }
        this.priceBidChargesList = result.data;
        this.priceBidChargesList.unshift(obj)
        this.priceBidChargesDropDown = this.priceBidChargesList.map(val => {
          return { value: val.markupCode, label: val.markupCode }
        })
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Inco terms
  getIncoTermsServiceCall() {
    this.loading = true;
    this.eventService.getIncoTerms().subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        let obj: IIncoTermsDataDto = { deliveryterM_ID: 0, description: this.selectDescription }
        this.incoTermsChargeList = result.data;
        this.incoTermsChargeList.unshift(obj)
        this.incotermsdropdown = this.incoTermsChargeList.map(val => {
          return { value: val.description, label: val.description }
        })
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  checkboxcustomChangeHandler(item: any) {

    if (item.iscustomEnabled) {
      console.log('',)
      this.selectDescription = '';

      this.cdr.detectChanges();
    }
    else {
      this.selectDescription = '-----Select-----';
    }

    this.cdr.detectChanges();
  }
  //payment terms
  getPaymentTermsServiceCall() {
    this.loading = true;
    this.eventService.getAllPaymentTerms().subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.paymentTermsChargeList = []
        let obj: IPaymentTermDataDto = { description: this.selectDescription, paymentterM_ID: 0 }
        this.paymentTermsChargeList = result.data;
        this.paymentTermsChargeList.unshift(obj)
        this.paymentTermsChargeDropdown = this.paymentTermsChargeList.map(val => {
          return { value: val.description, label: val.description }
        })
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Price bid templates
  getPriceBidTemplatesServiceCall() {
    this.loading = true;
    this.eventService.getPriceBidTemplates().subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.bidTemplatesList = result.data.map((val: any) => {
          val.oldTemplateName = val.templateName;
          return val;
        });
        this.selectedTemplateName = this.bidTemplatesList[0].templateName;
        this.templateId = this.rfqDetail.templateId
          ? this.rfqDetail.templateId
          : this.bidTemplatesList[0].templateId;
        this.oldTemplateId = this.rfqDetail.templateId
          ? this.rfqDetail.templateId
          : this.bidTemplatesList[0].templateId;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Common service for currencies
  getCurrenciesServiceCall() {
    this.loading = true;
    this.commonService.getCurrenciesList().subscribe({
      next: (result: ICommmonDataDto) => {
        if (result.success) {
          this.loading = false;
          if(this.userType == 'Buyer'){
          this.currencyId = this.rfqDetail.currencyId
            ? this.rfqDetail.currencyId
            : 1; //default 1 for 'INR'
          }
          this.currenciesList = result.data;         
          if (this.rfqDetail.currencyId == null && this.userType == 'Vendor') {
            this.saveTemplateAndCurrency(2);
          }

          //this.checkTempAndCurr()
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }


  GetVendorEventCurrency() { 
    this.eventService.GetVendorEventCurrency(this.rfqDetail.eventid,this.authData?.userId).subscribe({
      next: (result: any) => {
      this.currencyId=result.data;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  

  //Price bid lines
  getPriceBidLinesServiceCall() {
    this.loading = true;
    this.eventService.getPriceBidLines(this.rfqDetail.eventid).subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.priceBidLinesList = result.data.map((o: any) => {
          o.isEditedMode = false;
          o.old_remarks = o.remarks ? o.remarks : '';
          o.isEditedModeQty = false;
          o.old_qty = o.quantity ? o.quantity : '';
          return o;
        });

        this.priceBidLinesLoadData(this.priceBidLinesList);
        this.updateCheckList();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Price Bid Columns
  getPriceBidColumnsServiceCall() {
    this.loading = true;
    this.eventService.getPriceBidColumns(this.rfqDetail.eventid).subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.priceBidColumnList = result.data;
        this.priceBidParameterList = result.data
          .filter((val: any) => val.headerType == 'PriceBid')
          .map((element: any) => {
            return {
              ...element,
              isEdit: false,
              isDeleted: false,
              isError: false,
            };
          });

        this.otherChargesParameterList = result.data
          .filter((val: any) => val.headerType == 'Other')
          .map((element: any) => {
            return {
              ...element,
              isEdit: false,
              isDeleted: false,
              isError: false,
            };
          });

        //this.checkTempAndCurr()
        this.updateCheckList();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Price other Charges
  getPriceOtherChargesServiceCall() {
    this.loading = true;
    this.eventService.getOtherCharges().subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.otherChargesList = result.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Price Bid Columns
  getChargesNRemarksServiceCall(flag?: number) {
    this.loading = true;
    this.eventService
      .getAssignedPBBidChargesNRemarks(this.rfqDetail.eventid, null)
      .subscribe({
        next: (result: IPriceBidResultDataDto) => {
          this.loading = false;
          this.chargeNRemarkList = result.data;
          this.checkconditionforpaymentandincoterms();
          this.chargeCardList =
            flag == undefined || flag == 1
              ? result.data
                .filter((val: any) => val.cR_Type == 'OtherCharges')
                .map((element: any) => {
                  return {
                    ...element,
                    isEdit: false,
                    isDeleted: false,
                    isError: false,
                    valueType: 1,
                    amount: 0,
                    totalAmount: 0,
                  };
                })
              : this.chargeCardList;

          this.pricingCardList =
            flag == undefined || flag == 2
              ? result.data
                .filter(
                  (val: any) =>
                    val.cR_Type == 'NonPricingTitle' ||
                    val.cR_Type == 'PaymentTerms' ||
                    val.cR_Type == 'IncoTerms'
                )
                .map((element: any) => {
                  return {
                    ...element,
                    isEdit: false,
                    isDeleted: false,
                    isError: false,
                  };
                })
              : this.pricingCardList;

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }
  checkconditionforpaymentandincoterms() {
    for (let i = 0; i < this.chargeNRemarkList.length; i++) {
      if (this.chargeNRemarkList[i].cR_Type == 'PaymentTerms') {
        this.paymenttermscount = false;
      }
      else if (this.chargeNRemarkList[i].cR_Type == 'IncoTerms') {
        this.infotermscount = false;
      }
      else {
        this.paymenttermscount = true;
        this.infotermscount = true;
      }
    }
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

  //single input modal code start from here
  openSingleInputModal() {
    this.commonService.clearToaster();
    const modal: NgbModalRef = this.modalService.open(
      SingleInputModalComponent,
      { centered: true }
    );
    modal.componentInstance.title = 'Price Bid Charges';
    modal.componentInstance.placeholderName = 'Enter Price Bid Charges';
    modal.componentInstance.value = '';
    return modal.result.then(
      (result) => { },
      (reason) => {
        if (reason) {
        }
      }
    );
  }

  openPriceBidPopUp() {
    const modelRef = this.modalService.open(PriceBidPopUpComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });

    modelRef.componentInstance.priceBidParameterList = JSON.stringify(
      this.priceBidParameterList
    );
    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.componentInstance.rfqDetail = this.rfqDetail;
    modelRef.result.then(
      (err) => {
      },
      (data) => {
        if (data) {
          this.getPriceBidColumnsServiceCall();
          this.cdr.detectChanges();
        }
      }
    );
  }

  openOtherChargesPopUp() {
    debugger;
    const modelRef = this.modalService.open(OtherChargesPopUpComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });

    modelRef.componentInstance.otherChargesParameterList = JSON.stringify(
      this.otherChargesParameterList
    );
    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.componentInstance.rfqDetail = this.rfqDetail;

    modelRef.result.then(
      (err) => {
      },
      (data) => {
        if (data) {
          this.getPriceBidColumnsServiceCall();
          this.cdr.detectChanges();
        }
      }
    );
  }

  openManPowerModal() {
    if (this.changeTempCurr) {
      this.alertForSaveCurrAndTemp();
      return;
    }

    const modelRef = this.modalService.open(AddManPowerItemComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });

    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.componentInstance.priceBidLinesList = this.priceBidLinesList;
    modelRef.result.then(
      (err) => {
      },
      (data) => {
        if (data) {
          this.getPriceBidLinesServiceCall();
          this.cdr.detectChanges();
        }
      }
    );
  }

  openSubItemModal(item: IPriceBidLinesListDataDto) {
    if (this.changeTempCurr) {
      this.alertForSaveCurrAndTemp();
      return;
    }
    const modelRef = this.modalService.open(AddSubItemsComponent, {
      centered: true,
      fullscreen: true,
      scrollable:true,
    });

    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.componentInstance.eventTranId = item.eventTranId;
    modelRef.componentInstance.rfqDetail = this.rfqDetail;
    modelRef.result.then(
      (err) => {
      },
      (data) => {
        if (data) {
          this.updateCheckList();
          this.cdr.detectChanges();
        }
      }
    );
  }

  //other pricing card list
  addPricing(type: string) {

    this.cdr.detectChanges();
    let item = {
      pbcR_Id: 0,
      eventId: this.rfqDetail.eventid,
      cR_Name:
        type == 'PaymentTerms'
          ? this.paymentTermsChargeList[0].description
          : type == 'IncoTerms'
            ? this.incoTermsChargeList[0].description
            : '',
      cR_Type: type,
      isEdit: true,
      isNew: true,
      isDeleted: false,
      isError: false,
    };
    this.pricingCardList.push(item);
    this.checkpaymentandincotermscondition();
  }

  getNonDeletedPricing() {
    return this.pricingCardList.filter((val: any) => !val.isDeleted);
  }

  //other charges card list
  addCharge(type: string) {
    let item = {
      pbcR_Id: 0,
      eventId: this.rfqDetail.eventid,
      cR_Name:
        type == 'OtherCharges'
          ? this.priceBidChargesList[0].markupCode
          : this.incoTermsChargeList[0].description,
      cR_Type: type,
      isEdit: true,
      isNew: true,
      isDeleted: false,
      isError: false,
    };
    this.chargeCardList.push(item);
  }

  getNonDeletedCharges() {
    return this.chargeCardList.filter((val: any) => !val.isDeleted);
  }

  saveButtonClicked(flag: number) {
    if (this.changeTempCurr) {
      this.alertForSaveCurrAndTemp();
      return;
    }

    let dismiss = true;

    let chargeNRemarkListHere: IChargeNRemarkDataDto[] = [];

    // validation for other charges

    if (flag == 1) {
      let itrateList: any[] = []
      this.getNonDeletedCharges().forEach((element: any) => {
        if (element.cR_Name === '' || element.cR_Name == this.selectDescription) {
          element.isError = true;
          dismiss = false;
        }
        // logic to check duplicate
        if (itrateList.includes(element.cR_Name)) {
          element.isError = true;
          dismiss = false
        } else {
          itrateList.push(element.cR_Name)
        }

      });
      chargeNRemarkListHere = this.chargeCardList;
    } else {
      let itrateList: any[] = []
      this.getNonDeletedPricing().forEach((element: any) => {
        if (element.cR_Name === '' || element.cR_Name == this.selectDescription) {
          element.isError = true;
          dismiss = false;
        }
        // logic to check duplicate
        debugger;
        if ((element.cR_Type == 'PaymentTerms' || element.cR_Type == 'IncoTerms' || element.cR_Type=='NonPricingTitle') && itrateList.includes(element.cR_Name)) {
          element.isError = true;
          dismiss = false;
          this.commonService.showToaster("Title already exist.",false)
        } else {
          itrateList.push(element.cR_Name)
        }

      });

      chargeNRemarkListHere = this.pricingCardList;


    }

    if (dismiss) this.callFunctionForSaveChanges(chargeNRemarkListHere, flag);
  }

  alertForSaveCurrAndTemp() {
    this.commonService.showToaster(
      'Please save currency and template first.',
      false
    );
    ScrollTopComponent.goTop();
  }

  callFunctionForSaveChanges(
    chargeNRemarkList: IChargeNRemarkDataDto[],
    flag: number
  ) {
    let newItems = chargeNRemarkList.filter(
      (val) => val.pbcR_Id == 0 && !val.isDeleted
    );
    let editItems = chargeNRemarkList.filter(
      (val) => val.pbcR_Id != 0 && val.isEdit && !val.isDeleted
    );
    let deletedItems = chargeNRemarkList.filter(
      (val) => val.pbcR_Id != 0 && val.isDeleted
    );

    let newColumns = newItems.map((val: IChargeNRemarkDataDto) => {
      return {
        crName: val.cR_Name,
        crType: val.cR_Type,
      };
    });

    let editColumns = editItems.map((val: IChargeNRemarkDataDto) => {
      return {
        pbcR_Id: val.pbcR_Id,
        crName: val.cR_Name,
        crType: val.cR_Type,
      };
    });

    let deletedColumns = deletedItems.map((val: IChargeNRemarkDataDto) => {
      return val.pbcR_Id;
    });

    this.callApisForColumns(newColumns, editColumns, deletedColumns, flag);
  }

  callApisForColumns(
    newColumns: any,
    editColumns?: any,
    deletedColumns?: any,
    flag?: number
  ) {
    let newColumnsPayload = {
      eventId: this.rfqDetail.eventid,
      pbColoumnDetails: newColumns,
    };

    let editColumnsPayload = {
      eventId: this.rfqDetail.eventid,
      pbColoumnDetails: editColumns,
    };

    let source = [];
    if (newColumns && newColumns.length != 0) {
      source.push(
        this.eventService.addPriceBidChargeNRemark(newColumnsPayload).pipe(
          map((res) => res),
          catchError((e) => of(e))
        )
      );
    }
    if (editColumns && editColumns.length != 0) {
      source.push(
        this.eventService.updatePriceBidChargeNRemark(editColumnsPayload).pipe(
          map((res) => res),
          catchError((e) => of(e))
        )
      );
    }

    if (deletedColumns && deletedColumns.length != 0) {
      source.push(
        this.eventService.deletePriceBidChargeNRemark(deletedColumns).pipe(
          map((res) => res),
          catchError((e) => of(e))
        )
      );
    }

    if (source.length != 0) {
      const data = document.getElementById('sumbitbtn' + flag);
      data?.setAttribute('data-kt-indicator', 'on');

      forkJoin(source).subscribe({
        next: (response: any) => {
          if (response[0].success) {
            // this.setTabCompleteStatus(true);
            this.updateCheckList()
            this.commonService.showToaster('Save changes successfully.', true);
            data?.removeAttribute('data-kt-indicator');
            this.getChargesNRemarksServiceCall(flag);
          }
        },
        error: (error: any) => {
          data?.removeAttribute('data-kt-indicator');
          this.commonService.showToaster(error?.error, false);
        },
      });
    }
  }

  //other charges card list
  addOtherCharge() {
    let item = {
      otherCharge: this.priceBidChargesList[0].markupCode,
      amount: '',
      isEdit: true,
      isNew: true,
      isDeleted: false,
    };
    this.otherChargeCardList.push(item);
  }

  getNonDeletedOtherCharges() {
    return this.otherChargeCardList.filter((val: any) => !val.isDeleted);
  }

  //non pricing card list
  addNonPricing() {
    let item = {
      title: '',
      remarks: '',
      isEdit: true,
      isNew: true,
      isDeleted: false,
    };
    this.nonPricingCardList.push(item);
  }

  getNonDeletedNonPricing() {
    return this.nonPricingCardList.filter((val: any) => !val.isDeleted);
  }

  //inco terms card list
  addIncoterms() {
    let item = {
      incoterm: '',
      amount: '',
      isEdit: true,
      isNew: true,
      isDeleted: false,
    };
    this.incoTermsCardList.push(item);
  }

  getNonDeletedIncoterms() {
    return this.incoTermsCardList.filter((val: any) => !val.isDeleted);
  }

  //payment terms card list
  addPaymentTerms() {
    let item = {
      title: '',
      remakrs: '',
      isEdit: true,
      isNew: true,
      isDeleted: false,
    };
    this.payemntTermsCardList.push(item);
  }

  getNonDeletedPaymentterms() {
    return this.payemntTermsCardList.filter((val: any) => !val.isDeleted);
  }

  checkValidationForButton(flag: number) {
    //for other charge and inco terms
    let chargeNRemarkList: IChargeNRemarkDataDto[] = [];
    if (flag == 1) {
      chargeNRemarkList = this.chargeCardList;
    } else {
      chargeNRemarkList = this.pricingCardList;
    }

    let newItems = chargeNRemarkList.filter(
      (val) => val.pbcR_Id == 0 && !val.isDeleted
    );
    let editItems = chargeNRemarkList.filter(
      (val) => val.pbcR_Id != 0 && val.isEdit && !val.isDeleted
    );
    let deletedItems = chargeNRemarkList.filter(
      (val) => val.pbcR_Id != 0 && val.isDeleted
    );

    return (
      newItems.length != 0 || editItems.length != 0 || deletedItems.length != 0
    );
  }

  parameterCancelButton(index: number, type: string) {
    debugger;
    switch (type) {
      case 'Edit':
        this.priceBidLinesList[index].isEditedMode = true;
        this.priceBidLinesLoadData(this.priceBidLinesList);
        break;
      case 'Save':
        if (this.changeTempCurr) {
          this.alertForSaveCurrAndTemp();
        } else {


          this.priceBidLinesList[index].isEditedMode = false;
          this.priceBidLinesLoadData(this.priceBidLinesList);
          if (
            this.priceBidLinesList[index].old_remarks !=
            this.priceBidLinesList[index].remarks
          ) {
            this.savePriceBidRemarksApi(2, index);
          }
        }
        break;
      case 'Cancel':
        this.priceBidLinesList[index].isEditedMode = false;
        this.priceBidLinesList[index].remarks =
          this.priceBidLinesList[index]?.old_remarks;
        this.priceBidLinesLoadData(this.priceBidLinesList);
        break;

      default:
        break;
    }
  }

  qtyCancelButton(index: number, type: string) {
    debugger;
    switch (type) {
      case 'Edit':
        this.priceBidLinesList[index].isEditedModeQty = true;
        this.priceBidLinesLoadData(this.priceBidLinesList);
        break;
      case 'Save':
        if (this.changeTempCurr) {
          this.alertForSaveCurrAndTemp();
        } else {

          // qty validation
          if (this.priceBidLinesList[index].quantity <= 0) {
            this.commonService.showToaster('Please enter a valid', false)
            return
          }
          if (!this.commonService.threeDecimalRegex.test(this.priceBidLinesList[index].quantity.toString())) {
            this.commonService.showToaster('Qrder qty cannot exceed more than three decimal places.', false)
            return
          }
          this.priceBidLinesList[index].isEditedModeQty = false;
          this.priceBidLinesLoadData(this.priceBidLinesList);
          if (
            this.priceBidLinesList[index].old_qty !=
            this.priceBidLinesList[index].quantity
          ) {
            this.savePriceBidRemarksApi(1, index);
          }
        }
        break;
      case 'Cancel':
        this.priceBidLinesList[index].isEditedModeQty = false;
        this.priceBidLinesList[index].quantity =
          this.priceBidLinesList[index].old_qty;
        this.priceBidLinesLoadData(this.priceBidLinesList);
        break;

      default:
        break;
    }
  }

  //type 2 for remark and 1 for qty
  savePriceBidRemarksApi(
    type: number,
    index: number
  ) {
    let priceBidItem: IPriceBidLinesListDataDto = this.priceBidLinesList[index]
    if (!this.savePriceBidRemarksLoader) {
      this.savePriceBidRemarksLoader = true;
      let payload = {
        pbRemarks: [
          {
            eventTranId: priceBidItem?.eventTranId,
            remarks:
              type == 2 ? priceBidItem.remarks : priceBidItem.old_remarks,
            quantity: type == 1 ? priceBidItem.quantity : priceBidItem.old_qty,
          },
        ],
      };

      this.eventService.updatePriceBidRemarks(payload).subscribe({
        next: (result: any) => {
          this.savePriceBidRemarksLoader = false;
          if (result.success) {
            (priceBidItem.old_remarks =
              type == 2 ? priceBidItem.remarks : priceBidItem.old_remarks),
              (priceBidItem.old_qty =
                type == 1 ? priceBidItem.quantity : priceBidItem.old_qty),
              this.commonService.showToaster('Data updated successfully', true);

            this.updateCheckList();
            // this.setTabCompleteStatus(true);
          } else {
            // by pankaj kumar for refreshing old reamark and qty if error occured
            this.qtyCancelButton(index, 'Cancel')
            this.commonService.showToaster(result.errorDetail, false)
          }
        },
        error: (err) => {
          this.savePriceBidRemarksLoader = false;
          // this.downloadAllAttachmentloading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  priceBidLinesLoadData(data: any) {
    this.priceBidLinesList = data;
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.priceBidLinesGridView = process(filterData, this.state);
    this.cdr.detectChanges();
  }

  checkTempAndCurr(flag?: number, event?: any) {
    debugger;

    let id;
    if (event) id = event?.target?.value;

    if (flag == 1) {
      this.templateId = id;
    } else if (flag == 2) {
      this.currencyId = id;
    }

    if (this.userType == 'Buyer') {
      if (flag == 1 && this.oldTemplateId == 3 && this.checkManPowerItems()) {
        this.switchTemplateModalConfirmation();
        this.cdr.detectChanges();
        return;
      }

      this.oldTemplateId = this.templateId;

      // if (this.rfqDetail.currencyId == 0 || this.rfqDetail.templateId == 0) {
      //   this.changeTempCurr = true;
      //   this.cdr.detectChanges();
      //   return;
      // }
      // if (this.currencyId != this.rfqDetail.currencyId || this.templateId != this.rfqDetail.templateId) {
      //   this.changeTempCurr = true;
      // }
      // else {
      //   this.changeTempCurr = false;
      // }

      this.saveTemplateAndCurrency(flag);
    } else if (this.userType == 'Vendor' && flag == 2) {
      this.saveTemplateAndCurrency(flag);
    }
    this.cdr.detectChanges();
  }

  saveTemplateAndCurrency(flag: number | undefined) {
    debugger;
    this.currencyItem = this.currenciesList.filter(
      (val: any) => this.currencyId == val.currencymastid
    )[0];
    let payload = {
      eventId: this.rfqDetail.eventid,
      currencyId: this.currencyId,
      currencyCode: this.currencyItem.currencY_CODE,
      templateId: this.templateId,
    };

    this.eventService.saveCurrencyAndTemplate(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          let msg =
            flag == 1
              ? 'Template saved successfully.'
              : 'Currency saved successfully.';
          this.commonService.showToaster(msg, true);
          this.rfqDetail.currencyId = this.currencyId;
          this.changeTempCurr = false;

          // this.initLoad()
          this.getPriceBidLinesServiceCall()
          this.reloadRfqDetail();
          this.cdr.detectChanges();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
        }
      },
      error: (err) => {
        console.log('error is', err);
        // this.downloadAllAttachmentloading = false;
        this.cdr.detectChanges();
      },
    });
  }

  deleteModalConfirmation(item: IPriceBidLinesListDataDto, index: number) {


    this.commonService
      .showAlertForWarning(
        'Delete',
        'Are you sure, you want to delete this price bid line?'
      )
      .then((result) => {
        if (result) {
          this.deleteRfqItems(item, index);
        }
      });
  }

  deleteRfqItems(
    item?: IPriceBidLinesListDataDto,
    index?: number,
    deleteIds?: any
  ) {
    debugger;
    let payload: any = [];
    if (item) {
      payload.push(item.eventTranId);
    } else {
      payload = deleteIds;
    }

    this.eventService.deleteRFQItems(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonService.showToaster(
            'Price bid line(s) deleted successfully.',
            true
          );

          if (index || index == 0) {
            this.priceBidLinesList.splice(index, 1);
          } else {
            deleteIds.forEach((id: number) => {
              let i = this.priceBidLinesList.findIndex(
                (element: IPriceBidLinesListDataDto) => {
                  element.eventTranId == id;
                }
              );

              if (i != -1) {
                this.priceBidLinesList.splice(i, 1);
              }
            });
          }
          this.priceBidLinesLoadData(this.priceBidLinesList);
        } else {
          this.commonService.showToaster(result.errorDetail, false);
        }
        this.cdr.detectChanges();
      },
      error: (err) => { },
    });
  }

  switchTemplateModalConfirmation() {
    this.commonService
      .showAlertForWarning(
        'Template Switch',
        'You need to delete all man power items before switching to other template.\n Do you want delete all man power items?'
      )
      .then((result) => {
        if (result) {
          this.oldTemplateId = this.templateId;
          let deleteIdsList = this.priceBidLinesList.filter(
            (val: IPriceBidLinesListDataDto) => val.isManpower
          );
          let deleteIds = deleteIdsList.map(
            (val: IPriceBidLinesListDataDto) => {
              return val.eventTranId;
            }
          );
          this.deleteRfqItems(undefined, undefined, deleteIds);
          this.saveTemplateAndCurrency(1);
        } else {
          this.templateId = this.oldTemplateId;
        }
        this.cdr.detectChanges();
      });
  }

  updateRfqManually() {
    let data: any = {
      EventId: this.rfqDetail.eventid,
      PriceBidLinesList: this.priceBidLinesList,
      PageType: 'PRICE_BID',
    };

    this.router.navigate(['/Event/CreateRfqAuction'], {
      state: { data: JSON.stringify(data) },
    });
  }

  checkManPowerItems() {
    return this.priceBidLinesList.filter(
      (val: IPriceBidLinesListDataDto) => val.isManpower
    ).length == 0
      ? false
      : true;
  }

  checkConditionForAccess(type: string): boolean {
    let eventStatus = this.rfqDetail.eventStatus;

    switch (this.userType) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          switch (type) {
            case this.typeAccess.SELECT_PRICE_BID_TEMPLATE:
              return false;
            case this.typeAccess.CURRENCY:
              return false;
            case this.typeAccess.ADD_ITEMS:
              return false;
            case this.typeAccess.ADD_MAN_POWER_ITEM:
              return false;
            case this.typeAccess.ADD_LINE_ITEM_REMARK:
              return false;
            case this.typeAccess.LINE_ITEMS_QTY:
              return false;
            case this.typeAccess.OTHER_HEADER_LEVEL_CHARGES:
              return false;
            case this.typeAccess.NON_PRICING_TITLES:
              return false;
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return false;
            case this.typeAccess.CHARGES_REMARKS_COLOUMNS:
              return false;
          }
        } else if (eventStatus == 'Unpublished') {
          switch (type) {
            case this.typeAccess.SELECT_PRICE_BID_TEMPLATE:
              return this.rfqDetail.eventRound == '1' ? true : false;
            case this.typeAccess.CURRENCY:
              return this.rfqDetail.eventRound == '1' ? true : false;
            case this.typeAccess.ADD_ITEMS:
              return true;
            case this.typeAccess.ADD_MAN_POWER_ITEM:
              return true;
            case this.typeAccess.ADD_LINE_ITEM_REMARK:
              return true;
            case this.typeAccess.LINE_ITEMS_QTY:
              return this.rfqDetail.eventRound == '1' ? true : false;;
            case this.typeAccess.OTHER_HEADER_LEVEL_CHARGES:
              return true;
            case this.typeAccess.NON_PRICING_TITLES:
              return true;
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return true;
            case this.typeAccess.CHARGES_REMARKS_COLOUMNS:
              return true;
          }
        }

        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          switch (type) {
            case this.typeAccess.SELECT_PRICE_BID_TEMPLATE:
              return false;
            case this.typeAccess.CURRENCY:
              return true;
            case this.typeAccess.ADD_ITEMS:
              return false;
            case this.typeAccess.ADD_MAN_POWER_ITEM:
              return false;
            case this.typeAccess.ADD_LINE_ITEM_REMARK:
              return false;
            case this.typeAccess.LINE_ITEMS_QTY:
              return false;
            case this.typeAccess.OTHER_HEADER_LEVEL_CHARGES:
              return false;
            case this.typeAccess.NON_PRICING_TITLES:
              return false;
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return false;
            case this.typeAccess.CHARGES_REMARKS_COLOUMNS:
              return false;
          }
        } else if (eventStatus == 'Unpublished') {
          switch (type) {
            case this.typeAccess.SELECT_PRICE_BID_TEMPLATE:
              return false;
            case this.typeAccess.CURRENCY:
              return false;
            case this.typeAccess.ADD_ITEMS:
              return false;
            case this.typeAccess.ADD_MAN_POWER_ITEM:
              return false;
            case this.typeAccess.ADD_LINE_ITEM_REMARK:
              return false;
            case this.typeAccess.LINE_ITEMS_QTY:
              return false;
            case this.typeAccess.OTHER_HEADER_LEVEL_CHARGES:
              return false;
            case this.typeAccess.NON_PRICING_TITLES:
              return false;
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return false;
            case this.typeAccess.CHARGES_REMARKS_COLOUMNS:
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

  // setTabCompleteStatus(status: boolean) {
  //   this.setTabCompletedStatus$.emit({
  //     type: EventDashboardEnums.PRICE_BID,
  //     status: status,
  //   });
  // }


  addItemCondition() {
    let eventStatus = this.rfqDetail.eventStatus;

    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Unpublished') {
          return this.rfqDetail.eventRound == '1' ? true : false
        }
        else if (eventStatus == 'Published') {
          return false;
        }
        else if (eventStatus == 'Deleted') {
          return false
        }
        else if (eventStatus == 'Closed') {
          return false
        }

        else if (eventStatus == 'Terminated') {
          return false
        }


        break;
      case 'Vendor':
        return false
        break;
      case 'Requester/Technical':

        return false;
        break;

      default:
        return false;
        break;
    }
  }

  showslicedString(str: string, length: number) {
    return str ? str.slice(0, length) : ""
  }

  infoButtonHandler(item: any) {
    const modelRef = this.infoHandler.open(InfoPopupComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });
    modelRef.componentInstance.rfqDetail = this.rfqDetail;
    modelRef.componentInstance.eventTransId = item.eventTranId;
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

  onItemValueChange(item: any) {
    // let chargeNRemarkListHere: IChargeNRemarkDataDto[] = [];

  }

  updateCheckList() {
    this.updateCheckList$.emit();
  }


  openPoHistoryModel(item: IPriceBidLinesListDataDto) {
    const modelRef = this.poHistoryData.open(PriceBidPoHistoryComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });

    modelRef.componentInstance.itemCode = item.itemCode
  }

  shortClosecondition(item: IPriceBidLinesListDataDto) {
    if (this.rfqDetail.eventStatus == "Closed") {
      if (item.shortCloseQty >= 1) {
        return true;
      }
      else {
        return false;
      }
    }

    return false;


  }

  reloadRfqDetail() {
    this.syncRfqDetail.emit();
  }
  openShortcloseModel(item: IPriceBidLinesListDataDto) {
    const modelRef = this.poHistoryData.open(ShortCloseModelComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });

    modelRef.componentInstance.itemCode = item.itemCode
    modelRef.componentInstance.shortcloseqty = item.shortCloseQty
    modelRef.componentInstance.eventTranId = item.eventTranId
    modelRef.result
      .then(
        (result) => {
          // this.loadData(result);
          if (result) {
            this.shortcloselineitem(result.eventTranId, result.reason)
          }

          // this.gridView = result;
        },
        () => {

        }
      )
      .catch((e) => {
        console.log('Error occured', e);
      });
  }


  shortcloselineitem(eventTranId: number, reason: any) {
    this.eventService.shortclose(eventTranId, reason).subscribe({
      next: (
        result: any
      ) => {
        this.commonService.showToaster("Event Short Closed Successfully", true);
        this.getPriceBidLinesServiceCall();
        this.cdr.detectChanges();
        // this.loading = false;

      },
      error: (err) => {
        console.log(err);
        this.commonService.showToaster(err.ErrorDetail, false);
      },
    });
  }

  // //Price bid lines
  // getChargeDescription() {
  //   this.loading = true;
  //   this.eventService.getPriceBidLines(this.rfqDetail.eventid).subscribe({
  //     next: (result: IPriceBidResultDataDto) => {
  //       this.loading = false;
  //       this.priceBidLinesList = result.data.map((o: any) => {
  //         o.isEditedMode = false;
  //         o.old_remarks = o.remarks ? o.remarks : '';
  //         o.isEditedModeQty = false;
  //         o.old_qty = o.quantity ? o.quantity : '';
  //         return o;
  //       });

  //       this.priceBidLinesLoadData(this.priceBidLinesList);
  //       console.log('Price bid lines : ', this.priceBidLinesList);
  //       this.updateCheckList();
  //       this.cdr.detectChanges();
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.loading = false;
  //     },
  //   });
  // }
  paymenttermscount: boolean = true;;
  infotermscount: boolean = true;
  checkpaymentandincotermscondition() {
    for (let i = 0; i < this.pricingCardList.length; i++) {
      if (this.pricingCardList[i].cR_Type == 'PaymentTerms') {
        this.paymenttermscount = false;
      }
      else if (this.pricingCardList[i].cR_Type == 'IncoTerms') {
        this.infotermscount = false;
      }
      else {
        this.paymenttermscount = true;
        this.infotermscount = true;
      }
    }


  }

  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }
}
