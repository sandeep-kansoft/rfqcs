import { Component } from '@angular/core';

import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

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
import {
  AuctionGraphDetails,
  IDefaultResponseDto,
  IItemAmountInfo,
  IPriceBidLinesListDataDto,
  IPriceBidResultDataDto,
  IPriceBidVendorDetailDataDto,
  IRankAndColor,
  IRfqDetailDataDto,
  IgetAuctionDetailsForVendorsDataDto,
  PublishChecklistResponseDto,
  ReadMessageDto,
} from '../../event.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { VendorAddSubItemsComponent } from '../price-bid/vendor-charges/vendor-add-sub-items/vendor-add-sub-items.component';
import { VendorChargesEditComponent } from '../price-bid/vendor-charges/vendor-charges-edit/vendor-charges-edit.component';
import { SubmitBidPopUpComponent } from '../price-bid/vendor-charges/submit-bid-pop-up/submit-bid-pop-up.component';
import { LegendLabelsContentArgs } from '@progress/kendo-angular-charts';
import { IntlService } from '@progress/kendo-angular-intl';
import { BrodcastComponent } from '../view-auction/brodcast/brodcast.component';

@Component({
  selector: 'app-go-to-auction',
  templateUrl: './go-to-auction.component.html',
  styleUrls: ['./go-to-auction.component.scss'],
})
export class GoToAuctionComponent {
  priceBidLinesList: IPriceBidLinesListDataDto[] = [];
  chargeNRemarkData: IPriceBidVendorDetailDataDto;
  @Input() EventId: number;
  timezoneSelected:any;
  public maxDivisions = 12;
  @Input() publishCheckList: PublishChecklistResponseDto
  lotTotal: any;
  templateId: number | undefined;
  auctionVendorList: IgetAuctionDetailsForVendorsDataDto[] = []
  auctions: string = 'l1';
  format='DD/MM/YYYY HH:mm:ss'
  low: boolean = false;
  mid: boolean = false;
  high: boolean = false;
  @Input() vendorId: number;
  priceBidColumnList: Array<any> = [];
  rankAndColorList: IRankAndColor;
  authData: AuthModel | null | undefined;
  auctionrank: any;
  loading: boolean = false;
  public gridView: GridDataResult;
  loader: boolean = false;
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
  longColumnWidth = 200;
  eventVendorList: any;
  @Input() rfqDetail: IRfqDetailDataDto;
  pageSize = 10;
  pageNumber = 1;
  intervalId: any;
  readDto : ReadMessageDto = {};

  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  public pieData = [];
  public data: any[] = [{ category: new Date(2023, 1, 1), value: 1 }, { category: new Date(2023, 2, 1), value: 10 }];

  auctionGraphList: AuctionGraphDetails[] = []
  actionGraphLoader: boolean = false


  // templateId : number;
  public dateRange: Date[] = [];
  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private activeModel: NgbModal,
    public commonServices: CommonService,
    private intl: IntlService,
    private offcanvasService: NgbOffcanvas
  ) {
    const startDate = new Date(2020, 0, 1);
    const endDate = new Date(2020, 11, 31);

    let currentDate = startDate;
    while (currentDate <= endDate) {
      this.dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

  }

  list: any[] = []
  public ngOnInit() {
    if(this.rfqDetail.eventStatus=="Published"){
      this.intervalId = setInterval(() => {
        this.refreshButtonHandler();
      }, 60000);
    } 
    this.commonServices._msgCount$.next(parseInt(this.rfqDetail.unreadMsgCount));
    this.authData = this.commonServices.getAuthData();
    this.templateId = this.rfqDetail.templateId;
    this.initLoadApi()
    this.readDto = {
      UserId :this.authData?.userId,
      UserRole:this.authData?.userRole,
      EventId:this.rfqDetail.eventid,
      ThreadId:this.rfqDetail.bCastThreadId,
      ThreadFor:'BCAST'
    }
    this.GetUnreadMsgCount();
  }

  refreshButtonHandler() {
    this.initLoadApi()
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  initLoadApi() {
    this.GetRankAndColorForVendors();
    this.getAuctionGraphDetails();
    this.getChargesNRemarksServiceCall();
    this.getAuctionDetailsForVendors();
    
  }

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
    this.auctionVendorList = data;
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
  }


  GetRankAndColorForVendors() {
    let vendorid = 0;
    this.commonServices.setGlobalLoaderStatus(true);
    if (this.authData?.userRole) {
      vendorid = this.authData.userId;
    }

    this.eventService
      .getRankandColorRangeForVendors(this.rfqDetail.eventid, vendorid)
      .subscribe({
        next: (result: any) => {
          if (result.success) {
            this.commonServices.setGlobalLoaderStatus(false);
            this.rankAndColorList = result.data[0];
            // console.log('this is auction rank', this.rankAndColorList);
            this.low = false;
            this.high = false;
            this.mid = false
            this.colorRankMarker(this.rankAndColorList.colorRange);
            this.cdr.detectChanges();
          } else {
            this.commonServices.showToaster(result.errorDetail, false);
            this.commonServices.setGlobalLoaderStatus(false);
          }
        },
        error: (err) => {
          console.log(err);
          this.commonServices.setGlobalLoaderStatus(false);
        },
      });
  }
  colorRankMarker(color: any) {
    if (color == 'Green') {
      this.low = true;
    } else if (color == 'Yellow') {
      this.mid = true;
    } else if (color == 'Red') {
      this.high = true;
    }
  }

  getAuctionDetailsForVendors() {

    let vendorid = 0;
    if (this.authData?.userRole == 'Vendor') {
      vendorid = this.authData.userId;
    }
    this.loading = true;
    this.commonServices.setGlobalLoaderStatus(true);

    this.eventService
      .getAuctionDetailsForVendors(this.rfqDetail.eventid, vendorid)
      .subscribe({
        next: (result: any) => {
          if (result.success) {
            this.loading = false;
            this.lotTotal = 0;
            this.commonServices.setGlobalLoaderStatus(false);
            this.lotTotal = this.commonServices.getFixedDecimalValue(result.data.reduce((prev: any, curr: any) => {
              prev = curr.currentBid + prev
              return prev
            }, 0))

            this.lotTotal=this.chargeNRemarkData?.otherCharges + this.lotTotal;
            // for (let i = 0; i < result.length; i++) {
            //   this.lotTotal = this.commonServices.getFixedDecimalValue((this.auctionVendorList[i].currentBid + this.lotTotal));
            // }
            this.loadData(result.data)
          } else {
            this.loading = false;
            this.commonServices.setGlobalLoaderStatus(false);
            this.commonServices.showToaster(result.errorDetail, false);
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          this.loading = false;
          this.commonServices.setGlobalLoaderStatus(false);
        },
      });
  }
  itemforvendorEdit: IPriceBidLinesListDataDto;
  indexforvendorEdit: number
  openSubItemVendorModal(item: IPriceBidLinesListDataDto, index: number) {
    this.itemforvendorEdit = item;
    this.indexforvendorEdit = index;
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

        this.openVendorEditCharges(item, index);
        this.cdr.detectChanges();
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
    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.componentInstance.templateId = this.templateId;
    modelRef.componentInstance.itemLineInfo = item;
    modelRef.componentInstance.previousCurrentBid = item.currentBid;
    // modelRef.componentInstance.CurrentBid=item?.currentBid;
    modelRef.result.then(
      (err) => {
      },
      (data) => {
        if (data) {
          this.getAuctionDetailsForVendors();
          this.cdr.detectChanges();
        }
      }
    );
  }
  getPriceBidColumnsServiceCall() {
    this.loading = true;
    this.eventService.getPriceBidColumns(this.rfqDetail.eventid).subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.priceBidColumnList = result.data;

      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }



  getAuctionGraphDetails() {
    this.actionGraphLoader = true;
    this.eventService.getAuctionGraphDetails(this.rfqDetail.eventid, this.authData?.userId).subscribe({
      next: (result: IDefaultResponseDto<AuctionGraphDetails[]>) => {
        if (result.success) {
          // this.auctionGraphList = result.data
          this.timezoneSelected=result.data[0].timeZoneShortName
          let sortedData = result.data.reduce((pre: any, curr) => {
            if (!pre[curr.vendorid]) {
              if (curr.bidDate) {
                pre[curr.vendorid] = [{ category: (curr.bidDate), value: curr.startingBid }]
              }

            } else {
              if (curr.bidDate) {
                pre[curr.vendorid].push({ category: (curr.bidDate), value: curr.startingBid })
              }
              // pre[curr.vendorid].push(curr.bidDate)
            }
            return pre;
          }, {})
          this.list = []
          Object.keys(sortedData).forEach(val => {
            this.list.push(sortedData[val])
          })
        }
        this.list = this.list.map(series => 
          series.map((dataPoint:any) => ({
            ...dataPoint,
            category: this.dateTimeZoneConverter(dataPoint.category,"default")
          }))
        );
        this.cdr.detectChanges();
        console.log("listing",this.list)
        this.actionGraphLoader = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.actionGraphLoader = false;

      },
    });
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
  openSubmitBidPop() {
    const modelRef = this.modalService.open(SubmitBidPopUpComponent, {
      centered: true,
      fullscreen: false,
      scrollable: true,
    });

    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.result.then(
      (result) => {
        this.initLoadApi()
      },
      (err) => { }
    );
  }

  openBroadcastDrawer(){
    this.commonServices.clearToaster();
    const modalRef = this.offcanvasService.open(BrodcastComponent, {
      position: 'end',
      ariaLabelledBy: 'offcanvas-basic-title',
    });
    modalRef.componentInstance.rfqDetail = this.rfqDetail;
    modalRef.componentInstance.readOnly = true;
    modalRef.result.then((success)=>{

    } ,(close)=>{
      // active .dismiss
      this.commonServices.MarkMessageAsRead(this.readDto).subscribe({
        next : (res)=>{
          this.GetUnreadMsgCount();
        },
        error : (err) =>{
          
        }
      });
    })
    this.commonServices._msgCount$.next(0);
  }

  GetUnreadMsgCount(){
    if(this.authData && this.authData.userId && this.authData.userRole){
      this.commonServices.GetUnreadMsgCountByUser(this.readDto).subscribe({
        next : (res)=>{
          this.commonServices._msgCount$.next(parseInt(res.data));
        },
        error : (err) =>{
          
        }
      });

    }
  }


  // public labelContent(args: LegendLabelsContentArgs): string {
  //   return `${args.dataItem.category} years old: ${this.intl.formatNumber(args.dataItem.value, 'p2')}`;
  // }


  // public seriesData: any[] = [
  //   {
  //     product: 'Chai',
  //     sales: 200
  //   }, {
  //     product: 'Water',
  //     sales: 200
  //   }, {
  //     product: 'Others',
  //     sales: 250
  //   }
  // ];

  getChargesNRemarksServiceCall() {
    this.loading = true;
    this.eventService.getVendorChargesNCRemarks(this.rfqDetail.eventid).subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.chargeNRemarkData = result.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  dateTimeZoneConverter(Date:any,fromTimeZone:any){
    let converteddate=this.convertDateString(Date);
    return this.commonServices.convertTimeZone(converteddate,fromTimeZone,this.timezoneSelected,this.format)
  }


// Function to convert the date string to the desired format
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
