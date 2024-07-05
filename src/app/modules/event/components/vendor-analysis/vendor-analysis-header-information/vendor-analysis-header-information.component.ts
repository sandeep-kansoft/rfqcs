import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  FilterDescriptor,
  SortDescriptor,
  State,
  filterBy,
  orderBy,
  process,
} from '@progress/kendo-data-query';

import { BehaviorSubject } from 'rxjs';
import { PrResponseDto } from 'src/app/modules/purchase-requisition/purchase-requisition';
import { PurchaseRequistionServiceService } from 'src/app/modules/purchase-requisition/purchase-requistion-service.service';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from '../../../event.service';

@Component({
  selector: 'app-vendor-analysis-header-information',
  templateUrl: './vendor-analysis-header-information.component.html',
  styleUrls: ['./vendor-analysis-header-information.component.scss'],
})
export class VendorAnalysisHeaderInformationComponent {
  public gridView: GridDataResult;
  dropdownListdata = ['Preview', 'RFQ', 'Auction', 'Lines', 'History'];
  dropdownListWithoutrfq = ['Preview', 'Lines', 'History'];
  public toasterList$ = new BehaviorSubject([]);
  public currentToasterList$ = this.toasterList$.asObservable();
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;

  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  myPrData: PrResponseDto[];
  customFilter: ICustomFilterDataDto = {
    dateRangeSelected: null,
    prNo: '',
    department: '',
    isPrFieldVisible: false,
    isDepartmentVisible: true,
    ppoNumber: '',
    isSearchByPPONumber: false,
    isSearchItemNumber: false,
    ItemNumber: '',
    site: '',
    isSiteVisible: true,
  };

  refreshComponent: boolean = true;
  createRfqLoader: boolean = false;

  createRfqLoading: boolean = false;
  toasts: any = [];

  newColumns: any = [];

  serachText: string = '';

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;

  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  constructor(
    private commonService: CommonService,
    private prDetailModel: NgbModal,
    private prLineViewModel: NgbModal,
    private prHistoryModel: NgbModal,
    private auctionDrawer: NgbOffcanvas,
    private prservice: PurchaseRequistionServiceService,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private offcanvasService: NgbOffcanvas,

    private router: Router
  ) {
    this.allData = this.allData.bind(this);
  }

  public ngOnInit() {
    this.loadData([
      { name: 'Unit Price', item: 'Item Code' },
      { name: 'Discount Percentage', item: 'Quantity' },
      { name: 'Discount Amount', item: 'UOM' },
      { name: 'Total Amount', item: 'Description' },
      { name: 'Make', item: '' },
      { name: 'Model ', item: '' },
      { name: 'Contract Manpower-Accomod', item: '' },
      { name: 'NT03D - 3 Days after Invoice ', item: '' },
      { name: 'C&F - Cost and Freight', item: '' },
    ]);
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
      this.loadData(this.myPrData);
    }
  }

  public allData(): ExcelExportData {
    let stateData = this.state;
    stateData.take = this.myPrData.length;
    let data;
    if (this.serachText != '') {
      let filterData = this.getFilteredData(this.serachText);
      data = process(filterData, stateData).data;
    } else {
      data = process(this.myPrData, stateData).data;
    }
    data = data.map((val, index) => {
      val.sno = index + 1;
      val.enterdateFormat = val.enterdateFormat
        ? this.commonService.getTimeFormatString(
            val.enterdate,
            'DD-MMM-YYYY HH:MM'
          )
        : '';
      val.approvedDateFormat = val.approvedDateFormat
        ? this.commonService.getTimeFormatString(
            val.approvedDate,
            'DD-MMM-YYYY HH:MM'
          )
        : '';
      return val;
    });
    const result: ExcelExportData = {
      data: data,
    };

    return result;
  }
  overviewdata: PrResponseDto[] = [];

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
      return filterBy(this.myPrData, {
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
      return filterBy(this.myPrData, this.filter);
    }
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.myPrData = data;
    // this.gridView = {
    //   data: filterData,
    //   total: data.length,
    // };
    this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
  }
}
