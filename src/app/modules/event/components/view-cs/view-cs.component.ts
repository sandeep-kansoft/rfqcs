import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BidOptimizationComponent } from './bid-optimization/bid-optimization.component';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { EventService } from '../../event.service';
import {
  ComparisonVendorParam,
  IDefaultResponseDto,
  IGetAssignnedCollabrativeUserDataDta,
  IPriceBidResultDataDto,
  IRfqDetailDataDto,
  IRfqcsListDataDto,
  IVendorListdataDto,
  IheaderBidComparision,
  IroundlistDto,
  ItemBidComparison,
  ItemBidComparisonData,
} from '../../event.interface';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
  selector: 'app-view-cs',
  templateUrl: './view-cs.component.html',
  styleUrls: ['./view-cs.component.scss'],
})
export class ViewCSComponent {
  @Input() csId: number;
  @Input() rfqDetail: IRfqDetailDataDto;
  @Input() collaboratorPermission: IGetAssignnedCollabrativeUserDataDta;
  loading: boolean = false;
  authData: AuthModel | null | undefined;
  authnewdata: any;
  viewcsdata: any;
  pricebidDetailsoption: number = 2;
  Technicalparameterdetailsoption: number = 3;
  Termsdetailsoption: number = 4;
  vendorslistdata: IVendorListdataDto[] = [];
  allvendorslistdata: IVendorListdataDto[] = [];
  selectAllvendor: boolean;
  itemBidComparisonsList: ItemBidComparison[] = [];
  public gridView: GridDataResult;
  public headerOtherChargesGridView: GridDataResult;
  public headerTandCGridView: GridDataResult;
  public commercialTAndCRowData: ComparisonVendorParam[] = [];
  public chargesAndTermsRowData: ComparisonVendorParam[] = [];
  headerBidIsExpanded: boolean;

  dropdownListdata = ['Preview', 'RFQ', 'Auction', 'Lines', 'History'];
  dropdownListWithoutrfq = ['Preview', 'Lines', 'History'];
  itemBidComparisonsData: ItemBidComparisonData;
  headerBidComparisiondata: IheaderBidComparision;
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
  serachText: string = '';
  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;
  selectedPaperSize: string = 'A2';
  selectedPaperSizefortechnicalspecification: string = 'A4';
  selectedPaperSizeforpdf1: string = 'A2';
  isLandScape: boolean = false;
  roundlist: IroundlistDto[] = [];
  dummyDataIterator: any = [1];
  selectAllrounds: boolean;
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
    private commonService: CommonService
  ) {
    this.authData = this.commonService.getAuthData();
    this.authnewdata = this.commonService.getAuthData();
  }

  public ngOnInit() {
    console.log("rfq list",this.rfqDetail);
    if(this.rfqDetail.eventType == "3"){
      // this.getRAPrList();
      this.getRfqPrList();
    }
    else{
    this.getRfqPrList();
    }
    this.viewCs();
    this.cssheetcs();

    // this.getBidComparisonServiceCall();
    // this.getHeaderBidComparisonServiceCall();
  }
  getPdfFileName() {
    return `CS_${this.rfqDetail.eventNo} (Round - ${this.rfqDetail.round})`;
  }
  getviewcs1filename() { }
  gettechnicalspecification() {
    return `technical_Specification_${this.rfqDetail.eventNo} (Round - ${this.rfqDetail.eventRound})`;
  }

  viewCs() {
    this.loading = true;
    this.eventService.ViewCsApi(this.rfqDetail.eventid).subscribe({
      next: (result: any) => {
        this.loading = false;
        this.allvendorslistdata = result.data
        this.loadData(result.data);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  cssheetcs() {
    this.loading = true;
    this.eventService.ViewCsApi(this.rfqDetail.eventid, this.rfqDetail.eventNo).subscribe({
      next: (result: any) => {
        this.loading = false;
        let uniqueItem = result.data.reduce((prev: any, crr: IVendorListdataDto) => {
          prev[crr.vendorid] = crr
          return prev
        }, {})
        this.vendorslistdata = Object.values(uniqueItem);
        // console.log("this are unique elements", Object.values(uniqueItem))
        // this.loadData(result.data);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  ViewCsForCsSheet() {
    this.loading = true;
    this.eventService.ViewCsApi(this.rfqDetail.eventid).subscribe({
      next: (result: any) => {
        this.loading = false;

        this.loadData(result.data);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
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
      this.loadData(this.viewcsdata);
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

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.viewcsdata, {
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
      return filterBy(this.viewcsdata, this.filter);
    }
  }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.viewcsdata = data;
    // this.vendorslistdata = data;

    this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
  }

  techApproveAndScoreCondition() {
    let eventStatus = this.rfqDetail.eventStatus;

    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Unpublished') {
          return true;
        }

        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Unpublished') {
          return true;
        }
        break;
      case 'Requester/Technical':
        if (eventStatus == 'Published') {
          return true;
        } else {
          return false;
        }

        break;

      default:
        return false;
        break;
    }
  }

  downloadAttachment(url: string) {
    this.commonService.downloadFile(url);
  }
  scoreCondition() {
    let eventStatus = this.rfqDetail.eventStatus;

    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Unpublished') {
          return true;
        }

        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return false;
        }
        break;
      case 'Requester/Technical':
        if (eventStatus == 'Published') {
          return true;
        } else {
          return false;
        }

        break;

      default:
        return false;
        break;
    }
  }

  expandAll() {
    this.itemBidComparisonsList.map((val: any) => (val.isShow = true));
    this.headerBidIsExpanded = true;
    // this.headerBidIsExpanded=true;
  }

  collapseAll() {
    this.itemBidComparisonsList.map((val: any) => (val.isShow = false));
    this.headerBidIsExpanded = false;
  }

  getComparisionVendorParam(
    comparisonParams: any,
    comparisonVendorParams: any
  ) {
    let valueItem = comparisonVendorParams.filter(
      (val: any) => val.key == comparisonParams.key
    )[0];
    if (valueItem) {
      return valueItem.value;
    } else {
      return '-';
    }
  }
  getBidComparisonServiceCall() {
    //this.loading = true;

    let csIdVal = 0;

    if (this.csId) {
      csIdVal = this.csId;
    }

    this.eventService
      .getBidComparison(this.rfqDetail.eventid, csIdVal)
      .subscribe({
        next: (result: IPriceBidResultDataDto) => {
          this.loading = false;
          debugger;
          this.itemBidComparisonsData = result.data;
          this.itemBidComparisonsList =
            this.itemBidComparisonsData.itemBidComparisons;

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }

  getHeaderBidComparisonServiceCall() {
    //this.loading = true;
    let csIdVal = 0;

    if (this.csId) {
      csIdVal = this.csId;
    }

    this.eventService
      .getHeaderBidComparison(this.rfqDetail.eventid, csIdVal)
      .subscribe({
        next: (result: IDefaultResponseDto<IheaderBidComparision>) => {
          this.loading = false;
          // this.headerBidComparisiondata = result.data;
          // this.headerInformationloadData(res);
          this.loadDataheaderOtherCha(
            result.data.pricingAndTerms.comparisonParamList
          );
          this.loadDataHeaderTAndC(
            result.data.commercialTNC.comparisonParamList
          );

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }

  loadDataHeaderTAndC(data: any[]) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.commercialTAndCRowData = data;
    this.headerTandCGridView = process(filterData, this.state);
  }

  loadDataheaderOtherCha(data: any[]) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.chargesAndTermsRowData = data;
    this.headerOtherChargesGridView = process(filterData, this.state);
  }

  selectallvendor() {
    for (let i = 0; i < this.vendorslistdata.length; i++) {
      this.vendorslistdata[i].isvendorEnabled = this.selectAllvendor;
    }
  }
  selectallrounds() {
    for (let i = 0; i < this.roundlist.length; i++) {
      this.roundlist[i].isroundenabled = this.selectAllrounds;
    }
  }
  getRfqPrList() {
    let payload = {
      userId: this.authnewdata.userId,
      eventcode: this.rfqDetail.eventNo,
      eventname: '',
      currentstatus: '',
      projectName: '',
      eventType: '',
      userName: '',
      // if event is click form view only then all event round will be shown
      getAll: this.commonService.getAdminViewFlag() ? true : false,
      startDate: this.commonService
        .getLastDateFromRange(365)
        .toISOString()
        .slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
    };

    this.eventService.getRFQListApi(payload).subscribe({
      next: (result: IDefaultResponseDto<IRfqcsListDataDto[]>) => {
        if (result.success) {
          this.roundlist = result.data
            .sort(
              (a: IRfqcsListDataDto, b: IRfqcsListDataDto) =>
                a.evenT_ROUND - b.evenT_ROUND
            )
            .slice(0, Number(this.rfqDetail.eventRound));
            if(this.rfqDetail.eventType == "3"){
              this.getRAPrList()
            }
        } else {
          this.loading = false;
          this.commonService.showToaster(result.errorDetail, false);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  getRAPrList() {
    let payload = {
      userId: this.authnewdata.userId,
      eventcode: this.rfqDetail.eventNo,
      eventname: '',
      currentstatus: '',
      projectName: '',
      eventType: '',
      userName: '',
      // if event is click form view only then all event round will be shown
      getAll: this.commonService.getAdminViewFlag() ? true : false,
      startDate: this.commonService
        .getLastDateFromRange(365)
        .toISOString()
        .slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
    };

    this.eventService.getReverseAuctionListApi(payload).subscribe({
      next: (result: IDefaultResponseDto<IRfqcsListDataDto[]>) => {
        if (result.success) {
          let roundlistForRa :any = result.data.sort((a: IRfqcsListDataDto, b: IRfqcsListDataDto) => a.evenT_ROUND - b.evenT_ROUND).slice(0, Number(this.rfqDetail.eventRound));
          this.roundlist.push(...roundlistForRa);
          console.log("this is round list",this.roundlist);
        } else {
          this.loading = false;
          this.commonService.showToaster(result.errorDetail, false);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  checkboxChnageHandler(roundItem: IroundlistDto) {
    let RoundList = this.roundlist.filter((val) => val.isroundenabled);
    if (RoundList.length == this.roundlist.length) {
      this.selectAllrounds = true;
    } else {
      this.selectAllrounds = false;
    }
    for (let i = 0; i < this.roundlist.length; i++) {
      if (this.roundlist[i].isroundenabled) {
      }
    }
  }

  vendorboxChnageHandler(vendorItem: IVendorListdataDto) {
    let vendorList = this.vendorslistdata.filter((val) => val.isvendorEnabled);
    if (vendorList.length == this.vendorslistdata.length) {
      this.selectAllvendor = true;
    } else {
      this.selectAllvendor = false;
    }

    for (let i = 0; i < this.vendorslistdata.length; i++) {
      if (this.vendorslistdata[i].isvendorEnabled) {
      }
    }
  }

  downloadCsComparisionSheet() {
    let apivalidation = true;
    let roundlist = this.roundlist.filter((val) => val.isroundenabled);
    let vendorlist = this.vendorslistdata.filter((val) => val.isvendorEnabled);
    if (roundlist.length == 0) {
      this.commonService.showToaster('please select round', false);
    }
    if (vendorlist.length == 0) {
      this.commonService.showToaster('please select vendor', false);
    }
    if (
      this.pricebidDetailsoption == this.Technicalparameterdetailsoption ||
      this.pricebidDetailsoption == this.Termsdetailsoption ||
      this.Technicalparameterdetailsoption == this.Termsdetailsoption
    ) {
      this.commonService.showToaster(
        'please select different values for report layout',
        false
      );
      apivalidation = false;
    }
    if (roundlist.length != 0 && vendorlist.length != 0 && apivalidation) {
      let payload = {
        eventId: this.rfqDetail.eventid,
        vendorIds: this.vendorslistdata
          .filter((val) => val.isvendorEnabled)
          .map((val) => val.vendorid)
          .join(','),
        rounds: this.roundlist
          .filter((val) => val.isroundenabled)
          .map((val) => val.evenT_ID)
          .join(','),
        priceBidDetailNo: this.pricebidDetailsoption,
        techParaDetailNo: this.Technicalparameterdetailsoption,
        tcDetailNo: this.Termsdetailsoption,
      };

      this.eventService.DownloadComparisionSheet(payload).subscribe({
        next: (result: any) => {
          const urlBlob = window.URL.createObjectURL(result);
          const link = document.createElement('a');
          link.href = urlBlob;
          link.download = `${this.commonService.eventTypeMapping(this.rfqDetail.eventType)}_${this.rfqDetail.eventNo}_Round_${this.rfqDetail.eventRound}.xlsx`; // Replace 'file.pdf' with the desired filename;
          link.click();
          window.URL.revokeObjectURL(urlBlob);

          //   const urlBlob = window.URL.createObjectURL(result);
          //   const link = document.createElement('a');
          //   link.href = urlBlob;
          //   link.download = 'file.xlsx'; // Replace 'file.pdf' with the desired filename
          //   link.click();
          //   window.URL.revokeObjectURL(urlBlob);
          // //  else {
          // //   this.loading = false;
          // //   this.commonService.showToaster(result.errorDetail, false);
          // //   this.cdr.detectChanges();
          // // }
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
    }
  }

  pricebiddetailsvalue() {

  }
  viewCsCondition() {
    return !this.csId ? true : false
  }
}
