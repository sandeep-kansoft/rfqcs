import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { IReverseAuctionList, IRfqDetailDataDto, ITimeZoneList } from '../../event.interface';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RevereAuctionSettingsPopupComponent } from './revere-auction-settings-popup/revere-auction-settings-popup.component';
import { EventService } from '../../event.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';
@Component({
  selector: 'app-reverse-auction-settings',
  templateUrl: './reverse-auction-settings.component.html',
  styleUrls: ['./reverse-auction-settings.component.scss']
})
export class ReverseAuctionSettingsComponent {
  public gridView: GridDataResult;
  savingloader: boolean = false;
  timeZoneloading = true;
  timezoneList:any=[]
  timezoneselected:any
  templateId: number = 0
  isDiscountInCeilingPrice: boolean;
  isTaxInCeilingPrice: boolean;
  isAutoExtended: boolean;
  isTieBreaker: boolean;
  bidDecrementValue: number;
  DurationOfAuction: number;
  previousdurationofauction: number = 0;
  autoextensionDuration: number;
  autoextensionBuffer: number;
  autoextensionLimit: number;
  convertedTime:any
  bidDecrementPercentage: number
  IsCeilingPriceError: boolean = false;
  defaultDateFormat: string = "YYYY-MM-DD HH:mm:ss"
  ToFormat :string = "dd-MMM-yyyy hh:mm a"
  @Input() rfqDetail: IRfqDetailDataDto;
  @Output() updateCheckList$ = new EventEmitter();
  columnWidth = 150;
  headerStyle = 'fw-bold';
  AuctionDate: Date | null = null;
  bidconfig: string
  SelectBidConfiguration: any = 'IL'
  pageSize = 10;
  BidDecrementCondition: boolean = true;
  AuctionStartDate: Date | null ;
  bidDecrementLotlevel: number;
  pageNumber = 1;
  loading: boolean = false;
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  rfqPrData: any;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  vendorList: any = [];
  IndiantimeZone:string="Asia/Kolkata"
  reverseAuctionSettingList: IReverseAuctionList
  currdate: Date = new Date();
  date: any = this.currdate.setDate(this.currdate.getDate() - 1);
  public sort: SortDescriptor[] = [];
  public disabledDates = (date: Date): boolean => {
    if (date < this.date) {
      return true;
    }
    return false;
  };
  public filter: FilterDescriptor;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private eventService: EventService,
    private commonService: CommonService,) {

  }

  public ngOnInit() {
    this.getReverseAuctionSettingsList();
    // this.getTimeZone();
    this.updateCheckList();
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
    this.loadData(this.vendorList);

  }

  BidConfigurationChangeHanler() {
    if (this.SelectBidConfiguration == 'IL') {
      this.BidDecrementCondition = true;
      this.bidconfig = "Item Level";
    }
    else {
      this.BidDecrementCondition = false;
      this.bidconfig = "Lot Level";
    }
  }

  openReverseAuctionPopup(item: any) {
    const modelRef = this.modalService.open(RevereAuctionSettingsPopupComponent, {
      centered: true,
      fullscreen: true,
      scrollable:true,
    });
    modelRef.componentInstance.bidConfiguration = this.SelectBidConfiguration;
    modelRef.componentInstance.eventTranId = item.eventTranId;

  }


 async getReverseAuctionSettingsList() {
    this.loading = true;
    this.eventService.getReverseAuctionSettingsList(this.rfqDetail.eventid).subscribe({
      next: (result: any) => {
        this.reverseAuctionSettingList = result;
        this.getTimeZone()
        this.loadGlobalData();
        this.loadData(this.reverseAuctionSettingList.lines);

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
  getTimeZone() {
    this.loading = true;
    this.timeZoneloading=true;
    this.eventService.getTimeZoneList().subscribe({
      next: (result: ITimeZoneList) => {
        this.timezoneList = result.data;
        
        const selectedTimeZone = this.timezoneList.find((tz:any) => tz.timeZoneId === this.reverseAuctionSettingList.timeZone);
        // this.timezoneList.map((timezone:any)=>{
        //   if(timezone.timeZoneId===this.reverseAuctionSettingList.timeZone){
        //     this.timezoneselected=timezone;
        //     this.convertedTime=this.commonService.convertTimeZone(this.reverseAuctionSettingList.auctionDate,"default",this.timezoneselected.timeZoneShortName,this.defaultDateFormat);
        //     this.AuctionStartDate = this.convertedTime ? this.setSecondsToZero(this.convertedTime):new Date();
        //     console.log("converted Time",this.convertedTime,this.AuctionStartDate);
        //     this.cdr.detectChanges();
        //   }
        // });
        if (selectedTimeZone) {
          this.timezoneselected = selectedTimeZone;
          this.convertedTime = this.reverseAuctionSettingList.auctionDate ? this.commonService.convertTimeZone(this.reverseAuctionSettingList.auctionDate, "default", this.timezoneselected.timeZoneShortName, this.defaultDateFormat) : new Date();
          this.AuctionStartDate = this.convertedTime ? this.setSecondsToZero(this.convertedTime) : new Date();
          console.log("converted Time", this.convertedTime, this.AuctionStartDate);
          this.timeZoneloading=false
          this.cdr.detectChanges();
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.timeZoneloading=false
      },
    });
  }
  loadGlobalData() {
    this.templateId = this.reverseAuctionSettingList.templateId
    this.bidDecrementValue = this.reverseAuctionSettingList.bidDecrement;
    this.bidDecrementPercentage = this.reverseAuctionSettingList.bidDecrementPercent;
    this.isDiscountInCeilingPrice = this.reverseAuctionSettingList.isDiscountCP;
    this.isTaxInCeilingPrice = this.reverseAuctionSettingList.isTaxCP;
    this.isAutoExtended = this.reverseAuctionSettingList.isAutoExtended;
    this.isTieBreaker = this.reverseAuctionSettingList.isTieBreaker;
    this.DurationOfAuction = this.reverseAuctionSettingList.auctionDuration;
    this.autoextensionDuration = this.reverseAuctionSettingList.extensionDuration;
    this.autoextensionBuffer = this.reverseAuctionSettingList.extensionBuffer;
    this.autoextensionLimit = this.reverseAuctionSettingList.extensionLimit;
    console.log("this is auction Start date",this.AuctionStartDate);
    if(this.reverseAuctionSettingList.bidConfig=="Item Level"){
      this.SelectBidConfiguration = "IL";
      this.BidConfigurationChangeHanler()
    }
    else if(this.reverseAuctionSettingList.bidConfig=="Lot Level"){
      this.SelectBidConfiguration = "LL"
      this.BidConfigurationChangeHanler()
    }
  }

  setSecondsToZero(date: Date | string): Date | null {
    return date ? new Date(new Date(new Date(date).setSeconds(0)).setMilliseconds(0)) : null;
  }
  // inputChangeHandler(event: any, type: string) {

  //   if (event?.target?.value) {
  //     this.onDateChange(this.setSecondsToZero(event?.target?.value), type)

  //   }
  // }

  BidDecrementChangehandler(event: any, index: any) {

    console.log("this is value", this.reverseAuctionSettingList.lines[index].bidDecrementPercent)
    console.log("this is event", event)
    if (this.reverseAuctionSettingList.lines[index].bidDecrementPercent > 100) {
      console.log("previous percent", this.reverseAuctionSettingList.lines[index].bidDecrementpreviousPercent)
      event.target.value = this.reverseAuctionSettingList.lines[index].bidDecrementpreviousPercent
      this.commonService.showToaster('Percentage Can not be larger than 100', false);

      return;
    }
    else {
      this.reverseAuctionSettingList.lines[index].bidDecrementpreviousPercent = this.reverseAuctionSettingList.lines[index].bidDecrementPercent
      this.reverseAuctionSettingList.lines[index].bidDecrement = (this.reverseAuctionSettingList.lines[index].ceilingValue * this.reverseAuctionSettingList.lines[index].bidDecrementPercent) / 100;
    }
  }

  BidDecrementvalueChangehandler(event: any, index: any) {
    if (this.reverseAuctionSettingList.lines[index].bidDecrement > this.reverseAuctionSettingList.lines[index].ceilingValue) {
      event.target.value = this.reverseAuctionSettingList.lines[index].bidDecrementpreviousValue;
      this.reverseAuctionSettingList.lines[index].bidDecrement=this.reverseAuctionSettingList.lines[index].bidDecrementpreviousValue
      this.commonService.showToaster("Bid Decrement Value can not be greater than Ceiling Value", false)
    }
    else {
      this.reverseAuctionSettingList.lines[index].bidDecrementpreviousValue = this.reverseAuctionSettingList.lines[index].bidDecrement
      this.reverseAuctionSettingList.lines[index].bidDecrementPercent = (this.reverseAuctionSettingList.lines[index].bidDecrement * 100) / this.reverseAuctionSettingList.lines[index].ceilingValue
    }
  }

  ceilingValueChangehandler(index: any) {
if(this.SelectBidConfiguration == 'IL'){
    if (this.reverseAuctionSettingList.lines[index].bidDecrementPercent) {
      this.reverseAuctionSettingList.lines[index].bidDecrement = (this.reverseAuctionSettingList.lines[index].ceilingValue * this.reverseAuctionSettingList.lines[index].bidDecrementPercent) / 100;
    }
    if (this.reverseAuctionSettingList.lines[index].bidDecrement) {
      this.reverseAuctionSettingList.lines[index].bidDecrementPercent = (this.reverseAuctionSettingList.lines[index].bidDecrement * 100) / this.reverseAuctionSettingList.lines[index].ceilingValue
    }
}

else if(this.SelectBidConfiguration == 'LL'){
  let totalceilingpriceforglobal = 0;
  for (let i = 0; i < this.reverseAuctionSettingList.lines.length; i++) {
    totalceilingpriceforglobal += this.reverseAuctionSettingList.lines[i].ceilingValue
  }
if(!totalceilingpriceforglobal){
this.bidDecrementPercentage=0;
this.bidDecrementValue=0
}

if(this.bidDecrementPercentage){
this.bidDecrementValue = (this.bidDecrementPercentage * totalceilingpriceforglobal)/100
}
if(this.bidDecrementValue){
  this.bidDecrementPercentage = (this.bidDecrementValue * 100) / totalceilingpriceforglobal;
}
}
  }
  // numberOnly(event:any,index:any){
  // console.log("this is event",event)
  // if(this.reverseAuctionSettingList.lines[index].bidDecrementPercent>100){
  //   event.preventDefault();
  // }
  // }

  savereverseAuctionSetting() {
    this.IsCeilingPriceError = true;
    let formatTimeZOne=this.commonService.getDateFormatString(this.AuctionStartDate, this.defaultDateFormat)
let AuctionDate = this.commonService.convertTimeZone(formatTimeZOne,this.timezoneselected.timeZoneShortName,this.IndiantimeZone,this.defaultDateFormat)
console.log("auction Date",AuctionDate,this.AuctionStartDate)
    this.savingloader = true;
    let payload = {}
    if (this.SelectBidConfiguration == "IL") {
      payload = {
        "eventId": this.reverseAuctionSettingList.eventId,
        "isTieBreaker": this.isTieBreaker,
        "isDiscountCP": this.isDiscountInCeilingPrice,
        "isTaxCP": this.isTaxInCeilingPrice,
        "isAutoExtended": this.isAutoExtended,
        "extensionDuration": this.autoextensionDuration,
        "extensionBuffer": this.autoextensionBuffer,
        "extensionLimit": this.autoextensionLimit,
        "bidConfig": "Item Level",
        "auctionDuration": this.DurationOfAuction,
        "timeZone": this.timezoneselected.timeZoneId,
        "bidDecrement": 0,
        "bidDecrementPercent": 0,
        "auctionDate":  AuctionDate,
        "lines": this.reverseAuctionSettingList.lines.map(val => {
          return {
            "eventId": val.eventId,
            "eventTranId": val.eventTranId,
            "itemCode": val.itemCode,
            "itemDesc": val.itemDesc,
            "uom": val.uom,
            "ceilingValue": val.ceilingValue,
            "bidDecrement": val.bidDecrement,
            "thresholdBid": val.thresholdBid,
            "bidDecrementPercent": val.bidDecrementPercent,
          }
        })
      }
    }
    else if (this.SelectBidConfiguration == "LL") {
      payload = {
        "eventId": this.reverseAuctionSettingList.eventId,
        "isTieBreaker": this.isTieBreaker,
        "isDiscountCP": this.isDiscountInCeilingPrice,
        "isTaxCP": this.isTaxInCeilingPrice,
        "isAutoExtended": this.isAutoExtended,
        "extensionDuration": this.autoextensionDuration,
        "extensionBuffer": this.autoextensionBuffer,
        "extensionLimit": this.autoextensionLimit,
        "bidConfig": "Lot Level",
        "auctionDuration": this.DurationOfAuction,
        "timeZone": this.timezoneselected.timeZoneId,
        "bidDecrement": this.bidDecrementValue,
        "bidDecrementPercent": this.bidDecrementPercentage,
        "auctionDate": AuctionDate,
        "lines": this.reverseAuctionSettingList.lines.map(val => {
          return {
            "eventId": val.eventId,
            "eventTranId": val.eventTranId,
            "itemCode": val.itemCode,
            "itemDesc": val.itemDesc,
            "uom": val.uom,
            "ceilingValue": val.ceilingValue,
            "bidDecrement": 0,
            "thresholdBid": val.thresholdBid,
            "bidDecrementPercent": 0,
          }
        })
      }
    }
    else {
      payload = {
        "eventId": this.reverseAuctionSettingList.eventId,
        "isTieBreaker": this.isTieBreaker,
        "isDiscountCP": this.isDiscountInCeilingPrice,
        "isTaxCP": this.isTaxInCeilingPrice,
        "isAutoExtended": this.isAutoExtended,
        "extensionDuration": this.autoextensionDuration,
        "extensionBuffer": this.autoextensionBuffer,
        "extensionLimit": this.autoextensionLimit,
        "bidConfig": "Item Level",
        "auctionDuration": this.DurationOfAuction,
        "timeZone": this.timezoneselected.timeZoneId,
        "bidDecrement": 0,
        "bidDecrementPercent": 0,
        "auctionDate": AuctionDate,
        "lines": this.reverseAuctionSettingList.lines.map(val => {
          return {
            "eventId": val.eventId,
            "eventTranId": val.eventTranId,
            "itemCode": val.itemCode,
            "itemDesc": val.itemDesc,
            "uom": val.uom,
            "ceilingValue": val.ceilingValue,
            "bidDecrement": val.bidDecrement,
            "thresholdBid": val.thresholdBid,
            "bidDecrementPercent": val.bidDecrementPercent,
          }
        })
      }
    }
    this.eventService.SavereverseAuctionSettingsApi(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonService.showToaster('Reverse Auction Settings saved Succesfully', true);
          this.savingloader = false;
          this.updateCheckList();
          this.cdr.detectChanges();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
          this.commonService.showToaster(result.data,false)
          this.savingloader = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.savingloader = false;
      },
    });
  }

  onBiddecrementPercentageglobalChangeHandler() {
    let totalceilingpriceforglobal = 0;
    for (let i = 0; i < this.reverseAuctionSettingList.lines.length; i++) {
      totalceilingpriceforglobal += this.reverseAuctionSettingList.lines[i].ceilingValue
    }
    console.log("this is value", totalceilingpriceforglobal);
    this.bidDecrementValue = (totalceilingpriceforglobal * this.bidDecrementPercentage) / 100
  }

  onBiddecrementvalueglobalChangeHandler(event: any) {
    let totalceilingpriceforglobal = 0;
    for (let i = 0; i < this.reverseAuctionSettingList.lines.length; i++) {
      totalceilingpriceforglobal += this.reverseAuctionSettingList.lines[i].ceilingValue
    }

    if(this.bidDecrementValue > totalceilingpriceforglobal){
event.target.value=this.reverseAuctionSettingList.bidDecrementPreviousValueGlobal;
this.bidDecrementValue=this.reverseAuctionSettingList.bidDecrementPreviousValueGlobal;
      this.commonService.showToaster("Bid Decrement Value can not be greater than total Ceiling Value", false)
    }
    else{
      this.reverseAuctionSettingList.bidDecrementPreviousValueGlobal = this.bidDecrementValue;
    this.bidDecrementPercentage = (this.bidDecrementValue * 100) / totalceilingpriceforglobal;
  }
  }
  DurationOfAuctionChangeHandler(event: any) {
    console.log("this is event", event)
    if (event.data == '.') {
      this.commonService.showToaster("Decimal Not Allowed", false);
      event.target.value = this.previousdurationofauction;
    }
    else {
      this.previousdurationofauction = this.DurationOfAuction
    }
  }

  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }
  timezoneChangeHandler(event:any){
    console.log("time zone event handler",event)
    console.log("this is change handler",this.timezoneselected);
  }
  updateCheckList() {
    this.updateCheckList$.emit();
  }
  thresholdBidValueChangehandler(event: any,index:number){
if(this.reverseAuctionSettingList.lines[index].thresholdBid > this.reverseAuctionSettingList.lines[index].ceilingValue){
event.target.value=this.reverseAuctionSettingList.lines[index].thresholdBidPreviousValue;
this.reverseAuctionSettingList.lines[index].thresholdBid=this.reverseAuctionSettingList.lines[index].thresholdBidPreviousValue
  this.commonService.showToaster("Threshold Bid Value Can not be greater than ceiling value",false)
}
else{
  this.reverseAuctionSettingList.lines[index].thresholdBidPreviousValue=this.reverseAuctionSettingList.lines[index].thresholdBid
}
  }

  RoundWisePermission(){
    console.log("rfq detail",this.rfqDetail)
    if(this.rfqDetail.eventRound !="1" && this.reverseAuctionSettingList.isParentRFQ == 'No'){
      return true;
    }
    else{
    return false;
    }
  }
}
