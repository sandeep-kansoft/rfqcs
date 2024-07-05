import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuctionSettingFormComponent } from './auction-setting-form/auction-setting-form.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ChangeDetectorRef, Input } from '@angular/core';

import * as moment from 'moment';

import {
  FilterDescriptor,
  SortDescriptor,
  State,
  filterBy,
  orderBy,
  process,
} from '@progress/kendo-data-query';

import { EventService } from '../../event.service';
import { AuctionGraphDetails, IDefaultResponseDto, IRankAndColor, IRfqDetailDataDto, IgetAuctionDetailsDataDto } from '../../event.interface';
import { ViewAuctionDetailsForVendorsComponent } from './view-auction-details-for-vendors/view-auction-details-for-vendors.component';
import { BaseUnit, LegendLabelsContentArgs } from '@progress/kendo-angular-charts';
import { IntlService } from '@progress/kendo-angular-intl';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { SingleInputModalComponent } from '../single-input-modal/single-input-modal.component';
import { Path } from '@progress/kendo-drawing';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';
import { BrodcastComponent } from './brodcast/brodcast.component';
import { AnyMxRecord } from 'dns';
import { ViewAuctionDisqualificationDetailsPopupComponent } from './view-auction-disqualification-details-popup/view-auction-disqualification-details-popup.component';

@Component({
  selector: 'app-view-auction',
  templateUrl: './view-auction.component.html',
  styleUrls: ['./view-auction.component.scss'],
})
export class ViewAuctionComponent {
  public baseUnit: BaseUnit = "minutes";
  timezoneSelected:any;
  public maxDivisions = 12;
  public majorUnit=5;
  @Input() rfqDetail: IRfqDetailDataDto;
  opensettingModel() {
    this.activeModel.open(AuctionSettingFormComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
  }

  getAuctionDetailList: IgetAuctionDetailsDataDto[] = []
  loading: boolean = false;
  public gridView: GridDataResult;
  public tooltipContent = (e: any): string => {
    const date = new Date(e.category);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    return `${formattedDate}: ${e.value}`;
  }
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  prmodallist: any;
  serachText: string = '';
  format='DD/MM/YYYY HH:mm:ss'
  
  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;
  intervalId: any;
  authData: AuthModel | null | undefined;
  rankColorLoading: boolean = false
  rankAndColorList: IRankAndColor[] = []
  pieChartNoDataFound: boolean = false
  actionGraphLoader: boolean = false
  lineGraphNoDataFound: boolean = false
  refreshPieChart: boolean = true
  public seriesColors: string[] = [
    '#5fa1e7',
    '#5f6ee7',
    "#f3a787",
    "#4ab9a3",
    '#4593a5',
    "#fdfe89",
    '#6074ab',
    '#6b9acf',
    '#8bbde6',
    '#aae0f3',
    '#c8eded',
    '#faffe0',
    '#dde6e0',
    '#b4bec2',
    '#949da8',
    '#7a7a99',
    '#5b5280',
    '#4e3161',
    '#421e42',
    '#612447',
    '#7a3757',
    '#96485b',
    '#bd6868',
    '#d18b79',
    '#dbac8c',
    '#e6cfa1',
    '#e7ebbc',
    '#b2dba0',
    '#87c293',
    '#70a18f',
    '#637c8f',
    '#b56e75',
    '#c98f8f',
    '#dfb6ae',
    '#edd5ca',
    '#bd7182',
    '#9e5476',
    '#753c6a',



  ];
  lineChartList: any[] = []
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private activeModel: NgbModal,
    private openAuctionModel: NgbModal,
    private intl: IntlService,
    private commonServices: CommonService,
    private offcanvasService: NgbOffcanvas,
    private modalctrl: NgbModal
  ) {
    this.labelContent = this.labelContent.bind(this);
    this.pieChartLegendText = this.pieChartLegendText.bind(this);
  }
  public ngOnInit() {
    console.log("this is rfq detail",this.rfqDetail);
    this.initLoadApis();
    if(this.rfqDetail.eventStatus=="Published"){
    this.intervalId = setInterval(() => {
      this.refreshButtonHandler();
    }, 60000); 
  }
    // this.pieChartToolTipFormatter = this.pieChartToolTipFormatter.bind(this)
    
  }


  initLoadApis() {
    this.authData = this.commonServices.getAuthData();
    this.getAuctionDetails();
    this.getAuctionGraphDetails()
    this.GetRankAndColorForVendors();
  }
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public pieData: any[] = [
    // { category: 'Abhishek Enterprice', value: 0.2545 },
    // { category: 'Radha Enterprice', value: 0.1552 },
    // { category: 'shiva', value: 0.4059 },
    // { category: 'devika', value: 0.0911 },
    // { category: 'Test', value: 0.0933 }
  ];
  close() {
    this.modalService.dismissAll();
  }
  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      // let pageSize = state.skip / state.take + 1;
      // if (pageSize != this.pageNumber) {
      //   this.pageNumber = pageSize;
      //   this.getMyPrList();
      // } else {
      // }
      this.loadData(this.prmodallist);
    }
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
    this.gridView = process(filterData, this.state);
  }
  showBadgeStatusColorClass(type: string): string {
    let color: string = '';
    switch (type) {
      case 'Published':
        color = 'badge-light-success';
        break;
      case 'Pending':
        color = 'badge-light-warning';
        break;
      case 'Unpublished':
        color = 'badge-light-danger';
        break;
      default:
        break;
    }
    return color;
  }
  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.prmodallist, {
        filters: [
          {
            filters: [
              {
                field: 'pR_NUM',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'description',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'siteName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'PROJECT_NAME',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'departmentName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'prtype',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'prSubType',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'preparer',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'totalValue',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'assignBuyer',
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
      return filterBy(this.prmodallist, this.filter);
    }
  }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.prmodallist = data;

    this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
    this.cdr.detectChanges();
  }
  // getPriceBidLinesServiceCall() {
  //   this.loading = true;
  //   this.eventService.getPriceBidLines(this.eventId).subscribe({
  //     next: (result: IPriceBidResultDataDto) => {
  //       this.loading = false;
  //       this.prmodallist = result.data;
  //       console.log('Price bid lines : ', this.prmodallist);
  //       this.loadData(this.prmodallist);
  //       this.cdr.detectChanges();
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.loading = false;
  //     },
  //   });
  // }
  getAuctionDetails() {
    this.loading = true;
    this.eventService.getAuctionDetails(this.rfqDetail.eventid).subscribe({
      next: (result: any) => {
        // this.getAuctionDetailList = result.data;

        let data = result.data.sort(
          (a: any, b: any) => a.currentBid - b.currentBid
        );
        this.getAuctionDetailList = []
        this.getAuctionDetailList = result.data;
        let count = 0;
        // for (let i = 0; i < this.getAuctionDetailList.length; i++) {
        //   if (this.getAuctionDetailList[i].currentBid != 0) {
        //     count = count + 1;
        //     if (
        //       i != 0 &&
        //       this.getAuctionDetailList[i].currentBid ==
        //       this.getAuctionDetailList[i - 1].currentBid
        //     ) {
        //       this.getAuctionDetailList[i].rank = this.getAuctionDetailList[i - 1].rank;
        //       count = count - 1;
        //     } else {
        //       this.getAuctionDetailList[i].rank = `L${count}`;
        //     }
        //   } else {
        //     this.getAuctionDetailList[i].rank = '';
        //   }
        // }
        this.loading = false;
        this.loadData(this.getAuctionDetailList);
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  showReviewModel(item: IgetAuctionDetailsDataDto) {
    let modelRef = this.openAuctionModel.open(ViewAuctionDetailsForVendorsComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    modelRef.componentInstance.VendorId = item.vendorid;
    modelRef.componentInstance.EventId = this.rfqDetail.eventid

  }



  public labelContent(args: LegendLabelsContentArgs): string {
    return `Vendor count : ${args.dataItem.value * 100}`;
  }


  pieChartLegendText(args: LegendLabelsContentArgs) {
    let str = ''
    switch (args.dataItem.category) {
      case 'Green':
        str = 'Near to lowest bid.'
        break;
      case 'Yellow':
        str = 'Middle of the lowest & far bid.'
        break;
      case 'Red':
        str = 'Far from lowest bid / bid not submitted'
        break;

      default:
        break;
    }

    return `${str}`;
  }




  GetRankAndColorForVendors() {
    this.rankColorLoading = true
    this.eventService
      .getRankandColorRangeForVendors(this.rfqDetail.eventid, 0)
      .subscribe({
        next: (result: any) => {
          if (result.success) {
            this.rankAndColorList = result.data;

            // grouping the data based on color Range in key , pair
            let rankData = this.rankAndColorList.reduce((pre: any, curr) => {
              if (!pre[curr.colorRange]) {
                pre[curr.colorRange] = [curr]
              } else {
                pre[curr.colorRange].push(curr)
              }
              return pre;
            }, {})

            //
            this.pieData = []
            if (Object.keys(rankData).length != 0) {
              Object.keys(rankData).forEach(val => {
                this.pieData.push({ category: val, value: rankData[val].length, color: val.toLowerCase() })
              })
            } else {
              this.pieChartNoDataFound = true
            }
          } else {
            this.commonServices.showToaster(result.errorDetail, false);
          }
          this.rankColorLoading = false

          this.refreshPieChart = false
          setTimeout(() => {
            this.refreshPieChart = true
            this.cdr.detectChanges()
          }, 100);
          // setTimeout(() => {
          //   this.cdr.detectChanges()
          // }, 1000);

        },
        error: (err) => {
          console.log(err);
          this.rankColorLoading = false

        },
      });
  }

  // lineChartList: any[] = []
   categories:any[]=[];
  getAuctionGraphDetails() {
    this.actionGraphLoader = true;
    this.lineChartList = []
    this.lineGraphNoDataFound = false

    this.eventService.getAuctionGraphDetails(this.rfqDetail.eventid, 0).subscribe({
      next: (result: IDefaultResponseDto<AuctionGraphDetails[]>) => {
        if (result.success) {
          // this.auctionGraphList = result.data
this.timezoneSelected=result.data[0].timeZoneShortName
          let sortedData = result.data.reduce((pre: any, curr) => {
            if (!pre[curr.vendorid]) {
              if (curr.bidDate) {
                pre[curr.vendorid] = [{ category: (curr.bidDate), value: curr.startingBid, vendorName: curr.vendorname }]
              }

            } else {
              if (curr.bidDate) {
                pre[curr.vendorid].push({ category: (curr.bidDate), value: curr.startingBid, vendorName: curr.vendorname })
              }
              // pre[curr.vendorid].push(curr.bidDate)
            }
            return pre;
          }, {})

          this.lineChartList = []
          if (Object.keys(sortedData).length != 0) {
            Object.keys(sortedData).forEach(val => {
              console.log("val",val,sortedData)
              this.lineChartList.push(sortedData[val])
            })
          } else {
            this.lineGraphNoDataFound = true
          }

        }
        this.categories = this.lineChartList.flat(1).map((item) => item['category']);
        this.lineChartList = this.lineChartList.map(series => 
          series.map((dataPoint:any) => ({
            ...dataPoint,
            category: this.dateTimeZoneConverter(dataPoint.category,"default")
          }))
        );
        this.cdr.detectChanges();
        this.actionGraphLoader = false;
        console.log("log chart list",this.lineChartList,"Categories",this.categories);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.actionGraphLoader = false;

      },
    });
  }

  public labelContentLine(e: any): string {
    console.log("e.value",e.value);
    function padZero(value: number) {
      return value < 10 ? `0${value}` : value.toString();
    }
    const date = new Date(e.value);
    return `${padZero(date.getUTCHours())}:${padZero(date.getUTCMinutes())}`;
  }
  pieChartToolTipFormatter(event: any): string {
    return ``
  }

  refreshButtonHandler() {
    this.initLoadApis();
  }


  // resultDb: any[] = [
  //   {
  //     "eventId": 248,
  //     "vendorId": 6399,
  //     "totalAmount": 585,
  //     "colorRange": "Yellow",
  //     "vendorRank": "L1"
  //   },
  //   {
  //     "eventId": 248,
  //     "vendorId": 6399,
  //     "totalAmount": 585,
  //     "colorRange": "Yellow",
  //     "vendorRank": "L1"
  //   },
  //   {
  //     "eventId": 248,
  //     "vendorId": 6399,
  //     "totalAmount": 585,
  //     "colorRange": "Green",
  //     "vendorRank": "L1"
  //   },
  //   {
  //     "eventId": 248,
  //     "vendorId": 6399,
  //     "totalAmount": 585,
  //     "colorRange": "Red",
  //     "vendorRank": "L1"
  //   },

  //   {
  //     "eventId": 248,
  //     "vendorId": 6399,
  //     "totalAmount": 585,
  //     "colorRange": "Red",
  //     "vendorRank": "L1"
  //   }

  // ]

  showRemarkModel(item: any) {

    const modelRef = this.activeModel.open(SingleInputModalComponent, {
      centered: true,
      fullscreen: false,
      scrollable: true,
      keyboard: false
    });

    modelRef.componentInstance.title = 'Reject Last Bid'
    modelRef.componentInstance.placeholderName = 'Remark';
    modelRef.result.then(
      (result) => { },
      (result) => {
        if (result) {
          this.RejectLastBid(item, result)
        }
      }
    );

  }


  RejectLastBid(item: any, result: any) {

    this.loading = true;

    this.eventService.RejectLastBid(item.eventId, item.vendorid, result).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.loading = false;
          this.commonServices.showToaster('Last Bid Rejected', true);
          this.initLoadApis();
          this.cdr.detectChanges();
        } else {
          this.commonServices.showToaster(result.errorDetail, false);
          this.loading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.commonServices.showToaster(err.title, false);
        this.cdr.detectChanges();
      },
    });

  }
  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonServices.checkPermission(key)
  }
  openBroadcastDrawer(){
    this.commonServices.clearToaster();
    const modalRef = this.offcanvasService.open(BrodcastComponent, {
      position: 'end',
      ariaLabelledBy: 'offcanvas-basic-title',
    });
    modalRef.componentInstance.rfqDetail = this.rfqDetail;
    // modalRef.componentInstance.customFilter = JSON.stringify(this.customFilter);
    // modalRef.result.then(
    //   (response) => {
    //   },
    //   (data) => {
    //     if (data) {
    //       this.customFilter = data;
    //       this.getRfqPrList();
    //       this.cdr.detectChanges();
    //     }
    //   }
    // );
  }

  DisqualifyVendorBid(item:any){
    const modal: NgbModalRef = this.modalService.open(
      SingleInputModalComponent,
      { centered: true }
    );
    modal.componentInstance.title = 'Reason';
    modal.componentInstance.placeholderName = 'Disqualification Remarks';
    modal.componentInstance.value = '';
    return modal.result.then(
      (result) => { },
      (reason) => {
        if (reason) {
          this.disqualifyVendorBidCall(item,reason)
        }
      }
    );
  }
  disqualifyVendorBidCall(item:any,reason:any){
    this.eventService.DisqualifyVendorBid(item.eventId, item.vendorid, reason).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.loading = false;
          this.commonServices.showToaster('Vendor Bid Disqualified', true);
          this.initLoadApis();
          this.cdr.detectChanges();
        } else {
          this.commonServices.showToaster(result.errorDetail, false);
          this.loading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.commonServices.showToaster(err.title, false);
        this.cdr.detectChanges();
      },
    });
  }
  disquailificationDetails(item:any){
    const modelRef = this.modalctrl.open(ViewAuctionDisqualificationDetailsPopupComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    // modelRef.componentInstance.eventId = item.eventId;
    modelRef.componentInstance.item = item;
  }

  DownloadReverseAuctionReportCondition(){
console.log("this is rfq detail",this.rfqDetail);
if(this.rfqDetail.eventType=='3'){
  return true
}
else{
  return false;
}
  }
  saveReverseAuctionReport(){
     let payload:any={
     "eventId":this.rfqDetail.eventid
    }
      this.eventService.DownloadReverseAuctionReport(payload).subscribe({
        next: (result: any) => {
          console.log("this is result",result)
          const urlBlob = window.URL.createObjectURL(result);
          const link = document.createElement('a');
          link.href = urlBlob;
          link.download = `Reverse_Auction_Report${this.rfqDetail.eventid}.xlsx`
          link.click();
          window.URL.revokeObjectURL(urlBlob);
         this.commonServices.showToaster("Reverse Auction Report Downloaded",true)
        },
        error: (err) => {
          console.log(err);
          this.commonServices.showToaster(err.title, false);
          this.cdr.detectChanges();
        },
      });
    
  }
  setSecondsToZero(date: Date | string): Date | null {
    return date ? new Date(new Date(new Date(date).setSeconds(0)).setMilliseconds(0)) : null;
  }
  dateTimeZoneConverter(Date:any,fromTimeZone:any){
    let converteddate=this.convertDateString(Date);
    console.log("date converted",this.commonServices.convertTimeZone(converteddate,fromTimeZone,this.timezoneSelected,this.format))
    return this.commonServices.convertTimeZone(converteddate,fromTimeZone,this.timezoneSelected,this.format)
  }


// Function to convert the date string to the desired format
// convertDateString(dateStr: string): string {
//   // Parse the input date string with moment
//   const parsedDate = moment(dateStr);

//   // Format the date to the ISO 8601 format
//   // Note: This will keep the original date and time, converting it to ISO format
//   const formattedDate = parsedDate.format('DD/MM/YYYY HH:mm:ss.SSS');
// console.log("formated date first",formattedDate)
//   return formattedDate;
// }
 convertDateString(dateStr: string): string {
  // Specify the input format to ensure accurate parsing
  const inputFormat = 'YYYY-MM-DDTHH:mm:ss.SSS'; // Adjust format based on your input specifics

  // Parse the input date string with moment specifying the expected format
  const parsedDate = moment(dateStr, inputFormat);

  // Check if the date is valid to handle invalid date inputs
  if (!parsedDate.isValid()) {
    console.log("Invalid date provided");
    return "Invalid date"; // or handle this case as appropriate for your application
  }

  // Format the date to 'DD/MM/YYYY HH:mm:ss'
  const formattedDate = parsedDate.format('DD/MM/YYYY HH:mm:ss');
  console.log("Formatted date:", formattedDate);

  return formattedDate;
}
}
