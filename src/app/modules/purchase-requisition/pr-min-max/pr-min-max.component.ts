import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  State,
  process,
  SortDescriptor,
  orderBy,
  filterBy,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { CommonService } from 'src/app/shared/services/common.service';
import { PrGridDataDto } from '../pr-grid-view';
import { PrHistoryDetailComponent } from '../pr-history-detail/pr-history-detail.component';
import { PrModalViewComponent } from '../pr-modal-view/pr-modal-view.component';
import { PrGridData } from '../pr-overview/data';
import { AllPPOResponseDto } from '../purchase-requisition';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';
import { Po_or_RFQOrder } from './data';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { map } from 'rxjs';
@Component({
  selector: 'app-pr-min-max',
  templateUrl: './pr-min-max.component.html',
  styleUrls: ['./pr-min-max.component.scss'],
})
export class PrMinMaxComponent {
  public gridView: GridDataResult;
  dropdownListdata = ['Preview', 'RFQ', 'Auction', 'Lines', 'History'];
  columnWidth = 150;

  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  middleColumnWidth = 100;
  MediumColumnWidth = 130;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;

  longColumnWidth = 200;
  pageNumber = 1;
  pageSize = 10;
  refreshComponent: boolean = true;

  loading: boolean = false;
  minmaxdata: AllPPOResponseDto[] = [];
  serachText: string = '';
  formGroup!: FormGroup;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  totalcount: number;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  prData: any[] = Po_or_RFQOrder;
  customFilter: ICustomFilterDataDto = {
    dateRangeSelected:null,
    prNo: '',
    department: '',
    isPrFieldVisible: false,
    isDepartmentVisible: false,
    ppoNumber: '',
    isSearchByPPONumber: true,
    isSearchItemNumber: true,
    ItemNumber: '',
    site: '',
    isSiteVisible: true,
  };

  constructor(
    private commonService: CommonService,
    private prDetailModel: NgbModal,
    private prLineViewModel: NgbModal,
    private prHistoryModel: NgbModal,
    private prservice: PurchaseRequistionServiceService,
    private cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    private offcanvasService: NgbOffcanvas
  ) {
    this.allData = this.allData.bind(this);
    this.formGroup = this.fb.group({
      startDate: [null],
      endDate: [null],
      ppoNumber: [''],
      itemNumber: [''],
    });
  }

  public ngOnInit() {
    this.setDefaultFilter();
    this.getAllPpo();
    // this.loadProducts();
  }

  private loadProducts(): void {
    this.gridView = process(this.minmaxdata, this.state);
  }
  public allData(): ExcelExportData {
    let stateData = this.state;
    stateData.take = this.minmaxdata.length;
    let data;
    if (this.serachText != '') {
      let filterData = this.getFilteredData(this.serachText);
      data = process(filterData, stateData).data;
    } else {
      data = process(this.minmaxdata, stateData).data;
    }
    data = data.map((val, index) => {
      val.sno = index + 1;
      val.ppoDate = val.ppoDate
        ? this.commonService.getTimeFormatString(val.ppoDate, 'DD-MMM-YYYY')
        : '';
      return val;
    });
    const result: ExcelExportData = {
      data: data,
    };

    return result;
  }

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.minmaxdata, {
        filters: [
          {
            filters: [
              {
                field: 'site',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'warehouse',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'buyerGroup',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'itemGroup',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'ppoNo',
                operator: 'contains',
                value: inputValue,
              },

              {
                field: 'itemId',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'item_Description',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'config',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'uom',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'minOrderQty',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'maxOrderQty',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'onHandQtyinMain',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'reqQuantity',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'onHandQtyinOther',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'pendingPO',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'poInProcess',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'inProcessQtyPR',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'netOrderQty',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'orderedQty',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'orderedQty',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'pendingPRQty',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'prInReview',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'lastPurchasePrice',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'ppoAmount',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'ppoId',
                operator: 'contains',
                value: inputValue,
              },

              {
                field: 'vendorName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'totalConsumption365Days',
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
      return filterBy(this.minmaxdata, this.filter);
    }
  }

  checkMobileBrowser() {

    return this.commonService.isMobileBrowser;
  }

  editHandler(item: PrGridDataDto) {}

  removeHandler(item: PrGridDataDto) {}

  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      // let pageSize = state.skip / state.take + 1;
      // if (pageSize != this.pageNumber) {
      //   this.pageNumber = pageSize;
      //   this.getAllPpo();
      // } else {
      this.loadData(this.minmaxdata);
      // }
    }
  }

  onModelClick(type: string, item: any) {
    switch (type) {
      case 'Preview':
        break;
      case 'RFQ':
        break;
      case 'Auction':
        break;
      case 'Lines':
        this.openLinesModel();
        break;
      case 'History':
        this.openHistoryModel();
        break;

      default:
        break;
    }
  }

  openLinesModel() {
    this.prLineViewModel.open(PrModalViewComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });
  }

  openHistoryModel() {
    this.prHistoryModel.open(PrHistoryDetailComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });
  }
  showdata(data: any) {
  }

  getAllPpo() {
    this.loading = true;
    let payload: any = {
      searchbyPPONo: this.customFilter.ppoNumber
        ? this.customFilter.ppoNumber
        : '',
      searchbyItemNumber: this.customFilter.ItemNumber
        ? this.customFilter.ItemNumber
        : '',
      searchbyProductName: '',
      site: this.customFilter.site,
      // pageSize: 10,
      // pageIndex: 1,
    };

    if (this.customFilter.dateRangeSelected?.days != 0) {
      payload.fromDate = this.commonService
        .getLastDateFromRange(this.customFilter.dateRangeSelected?.days)
        .toISOString()
        .slice(0, 10);
      payload.todate = new Date().toISOString().slice(0, 10);
    } else {
      payload.fromDate = this.customFilter.dateRangeSelected?.startDate.toISOString().slice(0, 10);
      payload.todate = this.customFilter.dateRangeSelected?.endDate.toISOString().slice(0, 10);
    }
    this.prservice
      .getAllPpo(payload)
      .pipe(
        map((items: any) =>
          items.data.map((o: any) => {
            o.ppoDate = o.ppoDate
              ? new Date(
                  new Date((o.ppoDate as any).split('T')[0]).setHours(0, 0, 0)
                )
              : null;
            return o;
          })
        )
      )
      .subscribe({
        next: (result: any) => {
          // this.minmaxdata = result.data;
          this.loading = false;
          this.refreshComponentFunction();
          this.loadData(result);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }
  filterButton(isReset: boolean = false) {
    if (isReset) {
      this.formGroup.get('startDate')?.setValue('');
      this.formGroup.get('endDate')?.setValue('');
      this.formGroup.get('ppoNumber')?.setValue('');
      this.formGroup.get('itemNumber')?.setValue('');
    }
    this.getAllPpo();
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.minmaxdata = data;
    // this.gridView = {
    //   data: filterData,
    //   total: this.minmaxdata.length,
    // };
    this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
    else {
      this.gridView = process(filterData, this.state);
    }
    this.cdr.detectChanges();
  }
  onFilterAllField(event: any) {

    let inputValue;
    if (event) {
      this.state.skip = 0
      inputValue = event.target.value;
      this.serachText = inputValue;
    } else {
      inputValue = this.serachText;
    }

    let filterData = this.getFilteredData(inputValue);
    this.gridView = process(filterData, this.state);
  }

  //filter code start from here
  openFilterDrawer() {
    this.commonService.clearToaster();
    const modalRef = this.offcanvasService.open(FilterComponent, {
      position: 'end',
      ariaLabelledBy: 'offcanvas-basic-title',
    });
    modalRef.componentInstance.customFilter = JSON.stringify(this.customFilter);
    modalRef.result.then(
      (response) => {
      },
      (data) => {
        if (data) {
          this.customFilter = data;
          this.getAllPpo();
          this.cdr.detectChanges();
        }
      }
    );
  }

  closeFilter(type: any) {
    // if (this.customFilter.rangeType == 'LAST_30_Days') {
    //   //show alert here
    // } else {
    //   this.setDefaultFilter();
    //   this.getAllPpo();
    // }

    switch (type) {
      case 'LAST_30_Days':
        break;
      case 'site':
        this.customFilter.site = '';
        this.getAllPpo();
        break;
      case 'ppoNumber':
        this.customFilter.ppoNumber = '';
        this.getAllPpo();
        break;
      case 'ItemNumber':
        this.customFilter.ItemNumber = '';
        this.getAllPpo();
        break;

      default:
        this.setDefaultFilter();
        this.getAllPpo();

        break;
    }
  }

  setDefaultFilter() {
    this.customFilter = {
      dateRangeSelected:this.commonService.getDefaultDateRange(),
      prNo: '',
      department: '',
      isPrFieldVisible: false,
      isDepartmentVisible: false,
      ppoNumber: '',
      isSearchByPPONumber: true,
      isSearchItemNumber: true,
      ItemNumber: '',
      site: '',
      isSiteVisible: true,
    };
  }

  refreshComponentFunction() {
    this.refreshComponent = false;
    setTimeout(() => {
      this.refreshComponent = true;
      this.cdr.detectChanges();
    }, 1);
  }
}
