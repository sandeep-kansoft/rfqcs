import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FilterDescriptor, SortDescriptor, State, filterBy, orderBy,process } from '@progress/kendo-data-query';
import { EventService } from '../../../event.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { IReverseAuctionSubItemList } from '../../../event.interface';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-revere-auction-settings-popup',
  templateUrl: './revere-auction-settings-popup.component.html',
  styleUrls: ['./revere-auction-settings-popup.component.scss']
})
export class RevereAuctionSettingsPopupComponent {
  @Input() bidConfiguration: string;
  @Input() eventTranId: number;
  bidconfig:string;
  savingloader:boolean=false
  bidDecrementPreviousPercent:number;
  isLoading: boolean = false;
  vendorList: any = []
  loading:boolean=false;
  bidDecrementValue:number;
  CeilingValue:number;
  bidDecrementPercentage:number;
  itemLevel:boolean=false;
  public gridView: GridDataResult;
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  reverseAuctionSubItemData:IReverseAuctionSubItemList;
  noDataFound: boolean = false

  constructor(private activeModel: NgbActiveModal, private cdr: ChangeDetectorRef,
    private eventService: EventService,private commonService: CommonService,) {

  }
  public ngOnInit() {
    // this.saveEventVendors();
    // this.getAllEventVendor();
    this.BidConfigurationChangeHanler();
    this.getReverseAuctionSettingsSubItemList();
    console.log("this is level",this.bidConfiguration);
  }
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  public onStateChange(state: any) {
    if (!this.isLoading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.vendorList);
    }
  }


  
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.vendorList = data;
    this.gridView = process(filterData, this.state);

    this.cdr.detectChanges()
  }


  closeModel() {
    this.activeModel.dismiss()
  }



  BidConfigurationChangeHanler(){
    if(this.bidConfiguration=='IL'){
  this.itemLevel=true;
  this.bidconfig="Item Level"
    }
    else{
      this.itemLevel=false;
      this.bidconfig="Lot Level"
    }
  }
  getReverseAuctionSettingsSubItemList() {
    this.loading = true;
    this.eventService.getReverseAuctionSettingssubItemList(this.eventTranId,this.bidconfig).subscribe({
      next: (result: any) => {
        this.reverseAuctionSubItemData = result;
        this.loadGlobalData()
        this.loadData(this.reverseAuctionSubItemData.lines);
        
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  loadGlobalData() {
    this.CeilingValue=this.reverseAuctionSubItemData.ceilingValue
    this.bidDecrementValue = this.reverseAuctionSubItemData.bidDecrement;
    this.bidDecrementPercentage = this.reverseAuctionSubItemData.bidDecrementPercent;
   
  }
  BidDecrementChangehandler(event:any,index: any) {
    console.log("value",this.reverseAuctionSubItemData?.lines[index]?.bidDecrementPercent)
    debugger;
    console.log("this is value", this.reverseAuctionSubItemData.lines[index].bidDecrementPercent)
    console.log("this is event", event)
    if (this.reverseAuctionSubItemData.lines[index].bidDecrementPercent > 100) {
      this.commonService.showToaster('Percentage Can not be larger than 100', false);
      
      event.target.value=this.reverseAuctionSubItemData.lines[index].bidDecrementPreviousPercent
    }
    else {
      this.reverseAuctionSubItemData.lines[index].bidDecrementPreviousPercent=this.reverseAuctionSubItemData.lines[index].bidDecrementPercent
      this.reverseAuctionSubItemData.lines[index].bidDecrement = (this.reverseAuctionSubItemData.lines[index].ceilingValue * this.reverseAuctionSubItemData.lines[index].bidDecrementPercent) / 100;
    }
  }

  BidDecrementValueChangehandler(event:any,index: any){
    if (this.reverseAuctionSubItemData.lines[index].bidDecrement > this.reverseAuctionSubItemData.lines[index].ceilingValue) {
      event.target.value = this.reverseAuctionSubItemData.lines[index].bidDecrementpreviousValue;
      this.reverseAuctionSubItemData.lines[index].bidDecrement=this.reverseAuctionSubItemData.lines[index].bidDecrementpreviousValue
      this.commonService.showToaster("Bid Decrement Value can not be greater than Ceiling Value", false)
    }
    else {
      this.reverseAuctionSubItemData.lines[index].bidDecrementpreviousValue = this.reverseAuctionSubItemData.lines[index].bidDecrement
      this.reverseAuctionSubItemData.lines[index].bidDecrementPercent = (this.reverseAuctionSubItemData.lines[index].bidDecrement * 100) / this.reverseAuctionSubItemData.lines[index].ceilingValue
    }
  }

  onBiddecrementPercentageglobalChangeHandler(event:any) {
    if (this.bidDecrementPercentage > 100) {
      this.commonService.showToaster('Percentage Can not be larger than 100', false);
      event.target.value=this.bidDecrementPreviousPercent
    }
    else {
      this.bidDecrementPreviousPercent=this.bidDecrementPercentage
      this.bidDecrementValue = (this.CeilingValue * this.bidDecrementPercentage) / 100
    }
    
  }

  saveReverseAuctionSubItemPopUp(){
    this.savingloader=true;
    let payload={}
    if(this.bidConfiguration=='IL'){
       payload = {
          "eventTranId": this.reverseAuctionSubItemData.eventTranId,
          "ceilingValue": 0,
          "bidDecrement": 0,
          "bidDecrementPercent": 0,
          "bidConfig": "Item Level",
          "lines": this.reverseAuctionSubItemData.lines.map(val => {
            return {
              "eventTranId": val.eventTranId,
              "subId": val.subId,
              "itemCode": val.itemCode,
              "itemName": val.itemName,
              "quantity": val.quantity,
              "uom": val.uom,
              "ceilingValue": val.ceilingValue,
              "bidDecrement": val.bidDecrement,
              "bidDecrementPercent": val.bidDecrementPercent
            }
          })
        
      }
    }
    else{
      payload = {
        "eventTranId": this.reverseAuctionSubItemData.eventTranId,
        "ceilingValue": this.CeilingValue,
        "bidDecrement": this.bidDecrementValue,
        "bidDecrementPercent": this.bidDecrementPercentage,
        "bidConfig": "Lot Level",
        "lines": this.reverseAuctionSubItemData.lines.map(val => {
          return {
            "eventTranId": val.eventTranId,
            "subId": val.subId,
            "itemCode": val.itemCode,
            "itemName": val.itemName,
            "quantity": val.quantity,
            "uom": val.uom,
            "ceilingValue": 0,
            "bidDecrement": 0,
            "bidDecrementPercent": 0
          }
        })
      
    }
    }
    this.eventService.SavereverseAuctionSettingssubItemsApi(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonService.showToaster('Reverse Auction Settings saved Succesfully', true);
          this.closeModel();
         this.savingloader=false;
         this.cdr.detectChanges();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
          this.savingloader=false;
        }
      },
      error: () => {
        this.savingloader=false;
      },
    });
  }
  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }
}
