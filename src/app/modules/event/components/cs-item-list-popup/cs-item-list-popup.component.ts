import { Component, Input } from '@angular/core';
import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import { EventService } from '../../event.service';
import { ICsDetailDto, ICsStatusListDto, IDefaultResponseDto, IotherChargesForCSLinesDto, LineILineDetailResponseDto } from '../../event.interface';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
  selector: 'app-cs-item-list-popup',
  templateUrl: './cs-item-list-popup.component.html',
  styleUrls: ['./cs-item-list-popup.component.scss']
})
export class CsItemListPopupComponent {
  // @Input() eventId: number;
  // @Input() vendorId: number;
  @Input() awardId: number;
  columnWidth = 150;
  headerStyle = 'fw-bold';
  public gridView: GridDataResult;
  public gridView1: GridDataResult;
  smallColumnWidth = 120;
  longColumnWidth = 200;
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  middleColumnWidth = 100;
  MediumColumnWidth = 130;
  LargeColumnWidth = 170;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  Linedetails: any;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  pageSize = 10;
  csitemlistdetails:any
  pageNumber = 1;
  loading: boolean = false;
  authData: any;

  //   tempdata1= [
  //     {
  //     "SrNo":"1",
  //     "OtherCharges":"P&F",
  //     "Percentage":"0.00",
  //     "Amount":"4354.00"
  //   },
  //     {
  //     "SrNo":"2",
  //     "OtherCharges":"P&F",
  //     "Percentage":"0.00",
  //     "Amount":"34545.00"
  //   }
  // ]
  serachText: string = '';
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  ngOnInit() {
    // this.getCSLineDetailsOfCSApprovalServiceCall()
    this.getCSDetails(this.awardId);
  }



  constructor(
    private popupModel: NgbModal,
    private eventService: EventService,
    private commonService: CommonService,

  ) {

    // this.gridView1 = process(this.tempdata1,this.state);
  }

  CloseModel() {
    // alert("test");
    this.popupModel.dismissAll();
  }



  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loaddata(this.csitemlistdetails)
      // this.technicalParameterLoadData(this.technicalParameterLineList);
    }
  }

  // getCSLineDetailsOfCSApprovalServiceCall() {
  //   this.loading = true;
  //   this.eventService.getCSLineDetailsOfCSApproval(this.eventId, this.vendorId).subscribe({
  //     next: (result: any) => {
  //       this.loading = false;
  //       this.Linedetails = result.data;
  //       console.log('these are line items', this.Linedetails.lineDetails);
  //       this.gridView = process(this.Linedetails.lineDetails, this.state);
  //       // this.prmodallist = result.data.filter((val: any) => !val.isManpower);
  //       // console.log('Price bid lines : ', this.prmodallist);
  //       // this.loadData(this.prmodallist);
  //       // this.cdr.detectChanges();
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.loading = false;
  //     },
  //   });
  // }
  csStatusDetailPage: boolean = false

  csDetailLoading: boolean = false
  lineDetailsData: LineILineDetailResponseDto[] = []
  otherChargesForCSLinesData: IotherChargesForCSLinesDto[] = []
  itemSubTotal: number = 0
  otherChargesSubTotal: number = 0
  totalCsValue: number = 0

  setTwoDecimalData(amount : number){
    return amount.toFixed(2)
  }
  getCSDetails(awardId: number) {
    this.csStatusDetailPage = true;
    this.csDetailLoading = true
    // this.isLoading = true;
    this.eventService.GetCSDetails(awardId).subscribe({
      next: (result: IDefaultResponseDto<ICsDetailDto>) => {
        if (result.success) {
          this.csDetailLoading = false


          this.itemSubTotal = 0
          this.otherChargesSubTotal = 0
          this.totalCsValue = 0


          this.lineDetailsData = result.data.lineDetails
          this.otherChargesForCSLinesData = result.data.otherChargesForCSLines
for(let i=0;i<this.lineDetailsData.length;i++){
  this.lineDetailsData[i].totalPrice=this.commonService.getFixedDecimalValue(this.lineDetailsData[i].totalPrice)
}

          this.lineDetailsData.forEach(val => {
            this.itemSubTotal = this.itemSubTotal + val.totalPrice
          })
this.itemSubTotal=this.commonService.getFixedDecimalValue(this.itemSubTotal);

          this.otherChargesForCSLinesData.forEach(val => {
            this.otherChargesSubTotal = this.otherChargesSubTotal + val.amount

          })
          this.otherChargesSubTotal=this.commonService.getFixedDecimalValue(this.otherChargesSubTotal);
          this.totalCsValue =this.commonService.getFixedDecimalValue (this.itemSubTotal + this.otherChargesSubTotal)
          // this.gridView = process(result.data.lineDetails, this.state)
          this.csitemlistdetails=result.data.lineDetails
          this.loaddata(result.data.lineDetails)
          this.gridView1 = process(result.data.otherChargesForCSLines, this.state)
          // this.csStatusDetailGrid = process(result.data, this.state)
          // this.cdr.detectChanges();
          // this.isLoading = false;

          // this.csStatusList = result.data
          // this.gridView1 = process(this.csStatusList, this.state);
          // this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.log(err);
        this.csDetailLoading = false

        // this.isLoading = false;
      },
    });
}

csitemlist:any
  loaddata(data: any) {
    this.csitemlist = data;
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.gridView = process(this.csitemlist, this.state)
  }


}
