import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, forkJoin, map, of } from 'rxjs';
import { IGetRATranAuctionSettings, IGrossAmountInfo, IItemAmountInfo, IPriceBidChargesListDataDto, IPriceBidColumnDataDto, IPriceBidColumnVendorDataDto, IPriceBidLinesListDataDto, IPriceBidResultDataDto, IRfqDetailDataDto, ISubItemsForVendorsDataDto, ITaxesDataDto, PublishChecklistResponseDto } from 'src/app/modules/event/event.interface';
import { EventService } from 'src/app/modules/event/event.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { TaxPopUpComponent } from '../tax-pop-up/tax-pop-up.component';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';

@Component({
  selector: 'app-vendor-charges-edit',
  templateUrl: './vendor-charges-edit.component.html',
  styleUrls: ['./vendor-charges-edit.component.scss']
})

export class VendorChargesEditComponent {

  loading: boolean = false;
  RAdiscountIncluded:string;
  RATaxIncluded:string;
  @Input() priceBidColumnList: IPriceBidColumnVendorDataDto[] = []
  @Input() eventId: number;
  @Input() itemLineInfo: any;
  @Input() templateId: number;
  @Input() rfqDetail: IRfqDetailDataDto;
  @Input() eventTranId: number;
  @Input() publishCheckList: PublishChecklistResponseDto

  @Input() previousCurrentBid: number;
  subItemForVendorLoading: boolean = false
  authData: AuthModel | null | undefined;
  oldComapreValue:number;
  newCompareValue:number
  AuctionInformation:IGetRATranAuctionSettings;

  isInvalidate: boolean = false;
  olditemAmountInfo:IItemAmountInfo= {
    vTranID: 0,
    eventId: 0,
    eventTranId: 0,
    bidStatus: 0,
    quantity: 0,
    unitPrice: 0,
    discountPer: 0,
    discount: 0,
    gsT_VAT: 0,
    taxCode: '',
    taxType: '',
    amount: 0,
    totalAmount: 0,
    totalDiscount: 0,
    assessibleAmount: 0,
    totalTax: 0,
    netAmount: 0,
    grossAmount: 0
  }

  itemAmountInfo: IItemAmountInfo = {
    vTranID: 0,
    eventId: 0,
    eventTranId: 0,
    bidStatus: 0,
    quantity: 0,
    unitPrice: 0,
    discountPer: 0,
    discount: 0,
    gsT_VAT: 0,
    taxCode: '',
    taxType: '',
    amount: 0,
    totalAmount: 0,
    totalDiscount: 0,
    assessibleAmount: 0,
    totalTax: 0,
    netAmount: 0,
    grossAmount: 0
  }

  taxList: any = [{
    taxName: 'GST',
  },
  {
    taxName: 'CST',
  },
  {
    taxName: 'VAT',
  },
  ]

  taxChargesList: ITaxesDataDto[] = []

  taxChargeValue: number | string = 5;

  constructor(
    private commonService: CommonService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public modal: NgbActiveModal,
    public modalService: NgbModal
  ) {
    this.authData = this.commonService.getAuthData();
  }

  public ngOnInit() {
    console.log("vendor charges edit component data", this.rfqDetail)
    this.getVendorPriceBidOnLineServiceCall();
    this.GetRATranAuctionSettings();
    this.cdr.detectChanges();
    console.log("this is rfq detail",this.rfqDetail);
  }



  //Price Bid Columns
  getTaxesServiceCall(taxType: string) {
    this.loading = true;
    this.eventService.getTaxes(taxType).subscribe({
      next: (result: IPriceBidResultDataDto) => {
        debugger;
        this.loading = false;
        this.taxChargesList = [];
        this.taxChargesList = result.data;

        if (this.itemAmountInfo.taxCode == undefined || this.itemAmountInfo.taxCode == '')
          this.setTaxData();

        // let otherItem: ITaxesDataDto = {
        //   code: 'Other',
        //   tax: 0,
        //   cgst: 0,
        //   sgst: 0,
        //   igst: 0
        // }

        // this.taxChargesList.push(otherItem);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  setTaxData(item?: ITaxesDataDto) {
    if (item) {
      if (this.itemAmountInfo.taxType == 'GST')
        this.itemAmountInfo.gsT_VAT = item.igst;
      else
        this.itemAmountInfo.gsT_VAT = item.tax;

      this.itemAmountInfo.taxCode = item.code;
    }
    else {
      // if (this.itemAmountInfo.taxType == 'GST')
      //   this.itemAmountInfo.gsT_VAT = this.taxChargesList[0].igst;
      // else
      //   this.itemAmountInfo.gsT_VAT = this.taxChargesList[0].tax;

      // this.itemAmountInfo.taxCode = this.taxChargesList[0].code;
    }

    this.calculateItemAmountInfo();
    this.cdr.detectChanges();
  }

  //Price bid templates
  getVendorPriceBidOnLineServiceCall() {
    this.loading = true;
    this.eventService.getVendorPriceBidOnLine(this.itemLineInfo.eventTranId).subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.itemAmountInfo = result.data;
        this.olditemAmountInfo=result.data;
        console.log("this is old comapare value",this.olditemAmountInfo)

        this.itemAmountInfo.pBLines?.map((val: IPriceBidColumnVendorDataDto, index: number) => {
          let item = this.priceBidColumnList.filter((element: IPriceBidColumnVendorDataDto) => element.pB_HeaderID == val.pB_HeaderId)[0];
          if (item) {
            val.valueType = val.valueType ? val.valueType : 1;
            val.headerName = item.headerName;
            val.valuebyVendor = val.valuebyVendor ? val.valuebyVendor : '';
            val.amount = val.amount ? val.amount : ''
            val.totalAmount = val.totalAmount ? val.totalAmount : '';
            val.isError = false
          }
        })
        this.itemAmountInfo.quantity = this.itemLineInfo.quantity;
        this.itemAmountInfo.taxType = this.itemAmountInfo.taxType ? this.itemAmountInfo.taxType : 'GST'
        this.getTaxesServiceCall(this.itemAmountInfo.taxType);
        this.calculateItemAmountInfo();

        if (this.templateId == 2) {
          this.getAllSubItemsForVendorsServiceCall(this.eventTranId)
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }


  close() {
    this.modal.dismiss();
  }


  resetItemAmountInfo() {
    this.itemAmountInfo = {
      vTranID: 0,
      eventId: 0,
      eventTranId: 0,
      bidStatus: 0,
      quantity: 0,
      unitPrice: 0,
      discountPer: 0,
      discount: 0,
      gsT_VAT: 0,
      taxCode: '',
      taxType: '',
      amount: 0,
      totalAmount: 0,
      totalDiscount: 0,
      assessibleAmount: 0,
      totalTax: 0,
      netAmount: 0,
      grossAmount: 0
    }
  }

 async saveButtonConditionCheck(flag: number){
    
// if(this.rfqDetail.eventType=='3' && this.AuctionInformation.bidConfig=="Item Level"){
// let isValid=false;
//   if(this.RAdiscountIncluded=="Yes" && this.RATaxIncluded=="Yes"){
// this.oldComapreValue=this.olditemAmountInfo.netAmount;
// this.newCompareValue=this.itemAmountInfo.netAmount;
// isValid=true;
//   }
//   else if(this.RAdiscountIncluded=="Yes" && this.RATaxIncluded=="No"){
// this.oldComapreValue=this.olditemAmountInfo.grossAmount;
// this.newCompareValue=this.itemAmountInfo.grossAmount;
// isValid=true;
//   }
//   else if(this.RAdiscountIncluded=="No" && this.RATaxIncluded=="Yes"){
// this.oldComapreValue=this.olditemAmountInfo.netAmount-this.olditemAmountInfo.totalDiscount;
// this.newCompareValue=this.itemAmountInfo.netAmount-this.itemAmountInfo.totalDiscount;
// isValid=true;
//   }
//   else if (this.RAdiscountIncluded=="No" && this.RATaxIncluded=="No"){
// this.oldComapreValue=(this.olditemAmountInfo.quantity * this.olditemAmountInfo.unitPrice);
// this.newCompareValue=(this.itemAmountInfo.quantity * this.itemAmountInfo.unitPrice);
// isValid=true;
//   }

//   if(isValid){
// if(this.oldComapreValue==0 && this.rfqDetail.eventRound=='1'){
//   if(this.newCompareValue>=this.AuctionInformation.thresholdBid && this.AuctionInformation.ceilingValue>=this.newCompareValue){

//   }
//   else{

//   }
 
// }
// else if(this.oldComapreValue>0 && this.rfqDetail.eventRound=='1'){
//     if(this.newCompareValue>=this.AuctionInformation.thresholdBid && (this.oldComapreValue-this.AuctionInformation.bidDecrement)>=this.newCompareValue ){

//     }
//     else{

//     }
// }
// else if(this.oldComapreValue==0 && this.rfqDetail.eventRound>'1'){
// if(this.newCompareValue>=this.AuctionInformation.thresholdBid && (this.AuctionInformation.ceilingValue-this.AuctionInformation.bidDecrement)>=this.newCompareValue ){

// }
// else{

// }
// }
// else if(this.oldComapreValue>0 && this.rfqDetail.eventRound>'1'){
// if(this.newCompareValue>=this.AuctionInformation.thresholdBid && (this.oldComapreValue-this.AuctionInformation.bidDecrement)>=this.newCompareValue){

// }
// else{

// }
// }
//   }
//   else{
//     return
//   }
  
// }
// else if(this.rfqDetail.eventType=='3' && this.AuctionInformation.bidConfig=="Lot Level"){

// }
// else if(this.rfqDetail.eventType!='3'){
//   this.saveButtonClicked(flag);
// }
let isValid =await this.commonService.eventPublishedChecker(this.eventId) 
if(isValid){
  this.saveButtonClicked(flag);
}
else{
  this.commonService.showToaster('Event Already Closed',false);
  this.modal.dismiss();
}

  }

  saveButtonClicked(flag: number) {
    if (flag == 1) {
      this.isInvalidate = true;
      let errorMessage: string = this.validateAmountInfo();
      if (errorMessage) {
        this.commonService.showToaster(errorMessage, false)
        return
      }

    } else {
      let eventId = this.itemAmountInfo.eventId
      let eventTranId = this.itemAmountInfo.eventTranId
      this.resetItemAmountInfo()
      this.itemAmountInfo.eventId = eventId
      this.itemAmountInfo.eventTranId = eventTranId

    }
    this.itemAmountInfo.bidStatus = flag;
    if (!this.itemAmountInfo.totalTax) {
      this.itemAmountInfo.totalTax = 0
    }
    /* this code sets the `amount` and `totalAmount` field to 0 if they are undefined, null or empty string before sending to api as payload */
    this.itemAmountInfo.pBLines?.map(val => {
      val.amount = val.amount ? val.amount : 0;
      val.totalAmount = val.totalAmount ? val.totalAmount : 0
      return val
    })
    this.saveDataServiceCall(this.itemAmountInfo, flag);
  }


  validateAmountInfo(): string {
    /* validating unit price is less than or equal to zero.*/
    if (this.itemAmountInfo.unitPrice <= 0) {
      return "Please enter valid unit price.";
    }
    /*  validate unit price of an item has more than two decimal places*/
    if (!this.commonService.twoDecimalRegex.test(this.itemAmountInfo.unitPrice.toString())) {
      return 'Unit price cannot exceed more than two decimal values.';
    }

    /* if the discount percentage entered is between 0 and 100. */
    if ((this.itemAmountInfo.discountPer < 0 || this.itemAmountInfo.discountPer > 100)) {
      return 'Please enter discount between 0-100';
    }
    /* if the discount percentage entered is between 0 and 100. */
    if ((this.itemAmountInfo.discountPer && !this.commonService.twoDecimalRegex.test(this.itemAmountInfo.discountPer.toString()))) {
      return 'Discount percentage cannot exceed more than two decimal places';
    }

    /*if the event type is Forward Auction.then it checks net amount of the current bid should be less than the previous current bid.*/
    // if (this.previousCurrentBid != 0 && this.rfqDetail.eventType == '2' && this.itemAmountInfo.netAmount < this.previousCurrentBid) {
    //   return 'Current Bid amount can not be less than previous Bid amount.';
    // }
    // /*if the event type is Reverse Auction.then it checks net amount of the current bid should be greater than the previous current bid.*/
    // if (this.previousCurrentBid != 0 && this.rfqDetail.eventType == '3' && this.itemAmountInfo.netAmount > this.previousCurrentBid) {
    //   return 'Current Bid amount can not be greater than previous Bid amount.';
    // }
    if (this.itemAmountInfo?.pBLines?.length != 0) {
      let isPriceValid: boolean = true
      let isOtherChargesValid: boolean = true
      // loop through pBLines, looking for PriceBid headerType items
      this.itemAmountInfo?.pBLines?.filter(val => val.headerType == 'PriceBid').forEach(val => {
        // check for invalid totalAmount values
        if (val.totalAmount != '' && val.totalAmount <= 0) {
          isPriceValid = false
          val.isError = true
        } else {
          //  if values are valid then checking for two decimal values based on valuetype
          //  value type 1 = Fix
          //  value type 2 = Percent
          if (!this.commonService.twoDecimalRegex.test(val.valueType == 1 ? val.totalAmount.toString() : val.amount.toString())) {
            isOtherChargesValid = false;
            val.isError = true
          }
        }
      })

      if (!isPriceValid) {
        return 'The charges value cannot be empty'
      }

      if (!isOtherChargesValid) {
        // return 'Other Changes cannot be empty'
        return 'Other changes cannot be empty and does not exceed more than two decimal places.'
      }


      let otherChargesRemark: boolean = true;
      // loop through pBLines, looking for Other headerType items
      this.itemAmountInfo?.pBLines?.filter(val => val.headerType == 'Other').forEach(val => {
        // check for empty remarks
        if (val.valuebyVendor == '') {
          otherChargesRemark = false
          val.isError = true
        }
      })
      if (!otherChargesRemark) {
        return 'Remarks cannot be empty'
      }
    }
    return ''
  }

  saveDataServiceCall(payload: any, flag: number) {
    let node = document.getElementById('submitbtn' + flag);
    // loader on
    node?.setAttribute('data-kt-indicator', 'on');
    this.eventService.updateVendorPriceBidOnLine(payload).subscribe({
      next: (result: any) => {
        // loader off
        console.log("this is result for save price bid",result);
        node?.removeAttribute('data-kt-indicator');
        // console.log('create frq by ppo result', result);
        if (result.success) {
          this.commonService.showToaster('Saved successfully', true);
          this.modal.dismiss(JSON.stringify(this.itemAmountInfo));
        } else {
          this.commonService.showToaster(result.ErrorDetail, false);
        }
      },
      error: (err) => {
        node?.removeAttribute('data-kt-indicator');
        this.commonService.showToaster(err.ErrorDetail, false);

      },
    });
  }

  setOtherChargesAmountCal(index: number, event: any) {
    debugger;
    if (this.itemAmountInfo.pBLines) {
      if (event) {
        let chargeV: number | '' = event.target.value ? parseFloat(event.target.value) : '';
        if (this.itemAmountInfo.pBLines[index].valueType == 2) {
          this.itemAmountInfo.pBLines[index].amount = chargeV;
          let perV = this.itemAmountInfo.pBLines[index].amount;
          if (perV) {
            this.itemAmountInfo.pBLines[index].totalAmount = (this.itemAmountInfo.totalAmount * (perV / 100))
            this.itemAmountInfo.pBLines[index].totalAmount = parseFloat(Number(this.itemAmountInfo.pBLines[index].totalAmount).toFixed(2))
          }
          else {
            this.itemAmountInfo.pBLines[index].totalAmount = '';
          }
        }
        else {
          this.itemAmountInfo.pBLines[index].amount = chargeV;
          this.itemAmountInfo.pBLines[index].totalAmount = chargeV;
        }
      }
      else {
        this.itemAmountInfo.pBLines[index].amount = '';
        this.itemAmountInfo.pBLines[index].totalAmount = '';
      }


      this.calculateItemAmountInfo();
      this.cdr.detectChanges();
    }
  }


  calculateItemAmountInfo() {
    debugger;
    //item amount info calculation
    this.itemAmountInfo.amount = this.commonService.getFixedDecimalValue(this.itemAmountInfo.unitPrice * this.itemAmountInfo.quantity);
    if (this.itemAmountInfo.discountPer > 0) {
      this.itemAmountInfo.totalDiscount = this.commonService.getFixedDecimalValue((this.commonService.getFixedDecimalValue(this.itemAmountInfo.unitPrice * (this.itemAmountInfo.discountPer / 100)))*this.itemAmountInfo.quantity)
    }
    else {
      this.itemAmountInfo.totalDiscount = 0;
    }

    this.itemAmountInfo.totalAmount = this.commonService.getFixedDecimalValue(this.itemAmountInfo.amount - this.itemAmountInfo.totalDiscount);

    //other charges amount calculation
    let totalChargeValueTax = 0;
    let totalChargeValue = 0
    if (this.itemAmountInfo?.pBLines) {
      for (let charge of this.itemAmountInfo?.pBLines) {
        if (charge.totalAmount)
          totalChargeValueTax = this.commonService.getFixedDecimalValue(totalChargeValueTax + charge.totalAmount);
        else if (charge.totalAmount && !charge.isIncluded)
          totalChargeValue = this.commonService.getFixedDecimalValue(totalChargeValue + charge.totalAmount);
      }
    }


    //gross amount calculation
    if (totalChargeValueTax >= 0 || totalChargeValue >= 0) {
      this.itemAmountInfo.grossAmount = this.commonService.getFixedDecimalValue(this.itemAmountInfo.totalAmount + totalChargeValueTax + totalChargeValue);
      this.itemAmountInfo.assessibleAmount = this.commonService.getFixedDecimalValue(this.itemAmountInfo.totalAmount + totalChargeValueTax + totalChargeValue);
      this.itemAmountInfo.totalTax = this.commonService.getFixedDecimalValue(((this.itemAmountInfo.totalAmount + totalChargeValueTax) * (this.itemAmountInfo.gsT_VAT / 100)));
      //this.itemAmountInfo.totalTax = 0;
      if (!this.itemAmountInfo.totalTax) {
        this.itemAmountInfo.totalTax = 0
      }
      this.itemAmountInfo.netAmount = this.commonService.getFixedDecimalValue((this.itemAmountInfo.grossAmount + this.itemAmountInfo.totalTax));
    }

    this.cdr.detectChanges();
  }

  changeTypeFunc(event: any) {
    if (event.target.value) {
      this.itemAmountInfo.taxType = event.target.value;
      if (this.itemAmountInfo.taxType)
        this.getTaxesServiceCall(this.itemAmountInfo.taxType);
    }
  }

  changeTax(event: any,) {
    let code = event.target.value
    let taxTypeItem = this.taxChargesList.filter((val: any) => val.code == code)[0];
    this.itemAmountInfo.taxCode = code
    let tax = event.target.value;
    if (taxTypeItem.code != 'Other') {
      if (this.itemAmountInfo.taxType == 'GST')
        this.itemAmountInfo.gsT_VAT = taxTypeItem.igst;
      else
        this.itemAmountInfo.gsT_VAT = taxTypeItem.tax;
      this.calculateItemAmountInfo();
    }
    else {
      this.itemAmountInfo.gsT_VAT = 0;
    }

  }


  changeIncludedValueItem() {
    this.calculateItemAmountInfo();
  }




  // openEditTaxPopUp() {
  //   debugger;
  //   const modelRef = this.modalService.open(TaxPopUpComponent, {
  //     centered: true,
  //     size: 'lg',
  //     scrollable: true,
  //   });

  //   modelRef.componentInstance.taxChargesList = this.taxChargesList;
  //   modelRef.componentInstance.itemAmountInfo = this.itemAmountInfo;
  //   modelRef.result.then(
  //     (err) => {
  //     },
  //     (data) => {
  //       if (data) {
  //         this.setTaxData(data);
  //       }
  //     }
  //   );
  // }

  submitdisableCondition(type: string = '') {

    if (type == 'INCLUDED' && this.rfqDetail.templateId == 2) {
      return true
    }

    if (this.loading) {
      return true
    }
    if (this.rfqDetail.eventStatus == 'Published' &&
      this.rfqDetail.vendorStatus == 'Participated' && this.publishCheckList.vendorTechnical == 'Yes' && this.publishCheckList.vendorTNC == 'Yes') {
      return false
    }
    return true

  }



  getAllSubItemsForVendorsServiceCall(eventTransId: number) {
    if (!this.subItemForVendorLoading) {
      this.subItemForVendorLoading = true;
      this.eventService.getAllSubItemsForVendor(eventTransId, this.authData?.userId as number).subscribe({
        next: (result: any) => {
          if (result.success) {
            let amount = 0
            result.data.forEach((element: ISubItemsForVendorsDataDto) => {
              amount = amount + this.commonService.getFixedDecimalValue((element.rate * element.quantity))
            });
            this.itemAmountInfo.unitPrice = amount.toFixed(2) as any;
            this.calculateItemAmountInfo()
            this.cdr.detectChanges();
          } else {
            this.commonService.showToaster(result.ErrorDetail, false);
          }
        },
        error: (err) => {
          console.log('error is', err);
          // this.downloadAllAttachmentloading = false;
          this.subItemForVendorLoading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  GetRATranAuctionSettings() {
      this.eventService.GetRATranAuctionSettings(this.eventId,this.eventTranId).subscribe({
          next: (result: any) => {
          this.AuctionInformation=result;
          this.RATaxIncluded=this.AuctionInformation.isTaxCP;
          this.RAdiscountIncluded=this.AuctionInformation.isDiscountCP;
          console.log("this is auction information",this.AuctionInformation);
          },
          error: (err) => {
            console.log('error is', err);
            this.cdr.detectChanges();
          },
        });
    
  }

}


