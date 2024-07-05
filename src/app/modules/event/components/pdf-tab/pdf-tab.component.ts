import { Component } from '@angular/core';
import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { ChangeDetectorRef, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { filterBy, orderBy, process, State } from '@progress/kendo-data-query';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';

import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';

import {
  ComparisonVendorParam,
  IDefaultResponseDto,
  IRfqDetailDataDto,
  ItemBidComparison,
  IVendorBidDto,
  IVendorDetail,
  VendorBidRound,
  VendorDetail,
} from '../../event.interface';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from '../../event.service';
@Component({
  selector: 'app-pdf-tab',
  templateUrl: './pdf-tab.component.html',
  styleUrls: ['./pdf-tab.component.scss'],
})
export class PdfTabComponent {
  @Input() csId: number;
  @Input() rfqDetail: IRfqDetailDataDto;
  hiddenColumns: string[] = []
  loading: boolean = false;
  authData: AuthModel | null | undefined;
  viewcsdata: any;
  itemBidComparisonsList: ItemBidComparison[] = [];
  selectedPaperSize: string = 'A2';
  isLandScape: boolean = false

  public gridView: GridDataResult;
  public headerOtherChargesGridView: GridDataResult;
  public headerTandCGridView: GridDataResult;
  public commercialTAndCRowData: ComparisonVendorParam[] = [];
  public chargesAndTermsRowData: ComparisonVendorParam[] = [];
  overlay = false;
  dropdownListdata = ['Preview', 'RFQ', 'Auction', 'Lines', 'History'];
  dropdownListWithoutrfq = ['Preview', 'Lines', 'History'];
  dropList: any[] =
    [{ value: 'Round 1', label: 'Round 1' },
    { value: 'Round 2', label: 'Round 2' },
    { value: 'Round 3', label: 'Round 3' }, { value: 'Round 4', label: 'Round 4' }, { value: 'Round 5', label: 'Round 5' }]
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  roundWidth = 70;
  comparisionWidth = 100;
  XtraXtraLargeColumnWidth = 240;
  serachText: string = '';
  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;
  dummyDataIterator: any = [1];
  selectRoundList: any[] = []
  public vendorDetailState: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10000,
  };

  public vendorComparisionState: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10000,
  };
  vendorBidLoader: boolean = false
  public sortVendorDetail: SortDescriptor[] = [];
  public filterVendorDetail: FilterDescriptor;
  public vendorParamList: VendorDetail[] = []
  public vendorDetailGrid: GridDataResult;
  vendorDetailList: any[] = []
  allRoundCol = Array.from(Array(50).keys()).map((val: any, index) => `Round ${index + 1}`)

  vendorComparsionLoader: boolean = false
  public sortVendorComparison: SortDescriptor[] = [];
  public filterVendorComparison: FilterDescriptor;
  public vendorComparisonGrid: GridDataResult;
  public vendorComparisonList: VendorDetail[] = []
  vendorComparisionBidData: VendorDetail[] = []



  constructor(private eventService: EventService, private cdr: ChangeDetectorRef, private commonService: CommonService) {
    this.authData = this.commonService.getAuthData();
  }

  ngOnInit() {

    if (this.authData?.userRole == 'Buyer') {
      this.getVendorBidComparisonServiceCall()
    }
    this.setDisableFilter();
    this.roundFilter();

  }


  setDisableFilter() {
    this.dropList = Array.from(Array(parseInt(this.rfqDetail.eventRound)).keys()).map((val, index) => { return { value: `Round ${index + 1}`, label: `Round ${index + 1}` } })
    this.hiddenColumns = []
    this.selectRoundList = Array.from(Array(parseInt(this.rfqDetail.eventRound)).keys()).map((val, index) => `Round ${index + 1}`)
  }
  getPdfFileName() {
    return `CS_${this.rfqDetail.eventNo} (Round - ${this.rfqDetail.eventRound})`
  }



  getVendorBidComparisonServiceCall() {
    this.vendorBidLoader = true
    this.eventService
      .getVendorBidComparison(this.rfqDetail.eventid)
      .subscribe({
        next: (result: IDefaultResponseDto<IVendorBidDto>) => {
          this.vendorBidLoader = false


          let paramList: any[] = [];
          Object.keys(result.data.vendorDetail[0]).forEach(val => {
            if (val != 'vendorBidRound' && val != 'vendorId' && val != 'eventId') {
              paramList.push({ key: val, value: val ? val.split(/(?=[A-Z])/).join(' ') : '' })
            }
          })
          this.vendorDetailList = result.data.vendorDetail.map((val: any) => {
            val.bidRound = []
            paramList.forEach(item => {
              val.bidRound.push({ key: item.key, value: val[item.key] })
            })
            return val
          })

          // this.vendorComparisonList = result.data.vendorDetail
          this.vendorComparisionBidData = result.data.vendorDetail
          this.loadDataVendorDetail(paramList)
          this.loadDataVendorComparision(result.data.comparisonParamList)
          // this.transposeData(result.data.vendorDetail)
        },
        error: (err) => {
          this.vendorBidLoader = false
          console.log(err);
        },
      });
  }

  loadDataVendorDetail(data: VendorDetail[]) {
    let sortedData = orderBy(data, this.sortVendorDetail);
    let filterData = filterBy(sortedData, this.filterVendorDetail);
    this.vendorParamList = data
    this.vendorDetailGrid = process(filterData, this.vendorDetailState);
    this.cdr.detectChanges()
  }


  loadDataVendorComparision(data: any[]) {
    let sortedData = orderBy(data, this.sortVendorComparison);
    let filterData = filterBy(sortedData, this.filterVendorComparison);
    this.vendorComparisonList = data
    this.vendorComparisonGrid = process(filterData, this.vendorComparisionState);
    this.cdr.detectChanges()
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

  roundSelectHandler(event: any) {
  }

  roundFilter() {
    // this.hiddenColumns = this.dropList.filter(val => !this.selectRoundList.includes(val.value)).map(val => val.value)
    this.hiddenColumns = this.allRoundCol.filter(val => !this.selectRoundList.includes(val)).map(val => val)

    // this.selectRoundList.includes(val.value)
    // this.selectRoundList.forEach(val => {
    //   if (!this.hiddenColumns.includes(val)) {
    //     this.hiddenColumns.push(val)
    //   }
    // })
    // this.allRoundCol.forEach(val => {
    //   if (this.selectRoundList.includes(val)) {
    //     let index = this.hiddenColumns.findIndex(item => item == val)
    //     if (index != 1) {
    //       this.hiddenColumns.splice(index, 1)
    //     }
    //   }
    // })

  }


  transposeData(data: VendorDetail[]) {

  }




  // transposeGried(list: VendorDetail[]) {
  //   let params = Object.keys(list[0])
  //   list.map(val => {
  //     let obj = { key: val.vendorId, value:  }
  //     return obj

  //   })


  // }

  // transposeGrid(gridData: any[]): any[] {
  //   const transposedData: any[] = [];

  //   // Loop through each column and create a new row for it in the transposed array
  //   gridData[0].forEach((_: any, columnIndex: number) => {
  //     transposedData[columnIndex] = [];
  //   });

  //   // Loop through each row and column, swapping the values into the transposed array
  //   gridData.forEach(row => {
  //     row.forEach((cellValue: any, columnIndex: any) => {
  //       transposedData[columnIndex].push(cellValue);
  //     });
  //   });

  //   return transposedData;
  // }

  getTitleName(item: VendorDetail) {
    return ` ${item.vendorName} | ${item.vendorCode} | ${item.vendorEmail} | ${item.vendorPhone} |  ${item.vendorCity} `
  }

  vendorGridCondition() {
    return this.authData?.userRole == 'Vendor' ? false : true
  }

  roundSelectionCondition() {
    return !this.csId ? true : false
  }

}
