import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  State,
  process,
  SortDescriptor,
  FilterDescriptor,
  orderBy,
  filterBy,
} from '@progress/kendo-data-query';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import { PrGridDataDto } from '../pr-grid-view';
import { PrHistoryDetailComponent } from '../pr-history-detail/pr-history-detail.component';
import { PrModalViewComponent } from '../pr-modal-view/pr-modal-view.component';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';
import { LineData, PrGridData } from './data';
import { PrAllViewData } from './data';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-pr-all-view',
  templateUrl: './pr-all-view.component.html',
  styleUrls: ['./pr-all-view.component.scss'],
})
export class PrAllViewComponent {
  replytype: any = 1;
  headerStyle = 'fw-bold';
  loading: boolean = false;
  public lineviewdata: GridDataResult;
  public gridView: GridDataResult;
  dropdownListdata = ['Preview', 'Lines', 'History'];
  columnWidth = 150;
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  middleColumnWidth = 100;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;

  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;
  isLoading: boolean = false;
  serachText: string = '';
  allPrData: any[] = [];
  formGroup!: FormGroup;

  customFilter: ICustomFilterDataDto = {
    dateRangeSelected: null,
    prNo: '',
    department: '',
    isPrFieldVisible: true,
    isDepartmentVisible: true,
    ppoNumber: '',
    isSearchByPPONumber: false,
    isSearchItemNumber: false,
    ItemNumber: '',
    site: '',
    isSiteVisible: true,
  };

  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  prData: PrGridDataDto[] = PrAllViewData;
  linedata: PrGridDataDto[] = LineData;

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  refreshComponent: boolean = true;

  constructor(
    private commonService: CommonService,
    private prDetailModel: NgbModal,
    private prLineViewModel: NgbModal,
    private prHistoryModel: NgbModal,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private prservice: PurchaseRequistionServiceService,
    public fb: FormBuilder,
    private offcanvasService: NgbOffcanvas,
    private datePipe: DatePipe
  ) {
    this.allData = this.allData.bind(this);
    this.formGroup = this.fb.group({
      startDate: '',
      endDate: '',
      searchText: [''],
    });
  }

  public ngOnInit() {
    this.setDefaultFilter();
    this.getALLMyPrList();
  }

  backbutton() {
    this.replytype = 1;
  }
  checkMobileBrowser() {
    return this.commonService.isMobileBrowser;
  }

  editHandler(item: PrGridDataDto) {}

  removeHandler(item: PrGridDataDto) {}

  public onStateChange(state: any) {
    if (!this.isLoading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      // let pageSize = state.skip / state.take + 1;
      // console.log('Page size : ', pageSize);
      // if (pageSize != this.pageNumber) {
      //   this.pageNumber = pageSize;
      //   //this.getALLMyPrList();
      // } else {
      // }
      this.loadData(this.allPrData);
    }
  }

  dropDownMenuClickHandler(type: string, item: any) {
    switch (type) {
      case 'Preview':
        break;
      case 'RFQ':
        break;
      case 'Auction':
        break;
      case 'Lines':
        this.differentdiv();
        break;
      case 'History':
        // this.openHistoryModel();
        break;

      default:
        break;
    }
  }

  downlaodPDFAPI(prid: number) {
    this.prservice.DownloadPRPdf(prid).subscribe({
      next: (result: any) => {
        window.open(result.data.pdfURL, '_blank');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  prnoclicked() {
    this.router.navigate(['./pr-detail-view.module']);
  }
  onModelClick(type: string, item: any, isPrNumberClick = false) {
    switch (type) {
      case 'Preview':
        this.downlaodPDFAPI(item.prid);
        break;
      case 'RFQ':
        break;
      case 'Auction':
        break;
      case 'Lines':
        this.openLinesModel(item, isPrNumberClick);
        break;
      case 'History':
        this.openHistoryModel(item.prid);
        break;

      default:
        break;
    }
  }

  showBadgeStatusColorClass(type: string): string {
    let color: string = '';
    switch (type) {
      case 'In Process':
        color = 'badge-light-warning';
        break;
      case 'Pending':
        color = 'badge-light-info';
        break;
      case 'Closed':
        color = 'badge-light-danger';
        break;
      default:
        break;
    }
    return color;
  }

  differentdiv() {
    this.replytype = 2;
  }
  public allData(): ExcelExportData {
    let stateData = this.state;
    stateData.take = this.allPrData.length;
    let data;
    if (this.serachText != '') {
      let filterData = this.getFilteredData(this.serachText);
      data = process(filterData, stateData).data;
    } else {
      data = process(this.allPrData, stateData).data;
    }
    data = data.map((val, index) => {
      val.enterdate = val.enterdate
        ? this.commonService.getTimeFormatString(val.enterdate, 'DD-MMM-YYYY')
        : '';
      val.sno = index + 1;
      return val;
    });
    const result: ExcelExportData = {
      data: data,
    };

    return result;
  }

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.allPrData, {
        filters: [
          {
            filters: [
              {
                field: 'pR_NUM',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'buyerstatus',
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
                field: 'projecT_NAME',
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
                field: 'enterby',
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
      return filterBy(this.allPrData, this.filter);
    }
  }

  getALLMyPrList() {
    this.isLoading = true;
    let payload = {
      userId: '',
      isAllPR: 1,
      startdate: '',
      enddate: '',
      prNo: this.customFilter.prNo,
      prId: 0,
      site: this.customFilter.site,
      department: this.customFilter.department,
    };

    if (this.customFilter.dateRangeSelected?.days != 0) {
      payload.startdate = this.commonService
        .getLastDateFromRange(this.customFilter.dateRangeSelected?.days)
        .toISOString()
        .slice(0, 10);
      payload.enddate = new Date().toISOString().slice(0, 10);
    } else {
      payload.startdate = this.customFilter.dateRangeSelected?.startDate
        .toISOString()
        .slice(0, 10);
      payload.enddate = this.customFilter.dateRangeSelected?.endDate
        .toISOString()
        .slice(0, 10);
    }

    this.prservice
      .getALLPrList(payload)
      .pipe(
        map((items: any) =>
          items.data
            ? items.data.map((o: any) => {
                o['enterdate'] = new Date(
                  new Date((o.enterdate as any).split('T')[0]).setHours(0, 0, 0)
                );
                return o;
              })
            : []
        )
      )
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          this.refreshComponentFunction();
          this.loadData(result);
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          // this.loading = false;
        },
      });
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.allPrData = data;
    // this.gridView = {
    //   data: filterData,
    //   total: data.length,
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

  openLinesModel(item?: any, isPrNumberClick: boolean = false) {
    const modelRef = this.prLineViewModel.open(PrModalViewComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });

    modelRef.componentInstance.prId = item.prid;
    modelRef.componentInstance.prNumber = item?.pR_NUM;
    modelRef.componentInstance.isPrNumberClick = isPrNumberClick;
  }

  openHistoryModel(id: number) {
    const modelRef = this.prHistoryModel.open(PrHistoryDetailComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });
    modelRef.componentInstance.prId = id;
  }

  searchButtonClick() {
    if (!this.isLoading) {
      this.getALLMyPrList();
    }
  }

  onFilterAllField(event: any) {
    // console.log("Value : ", event.target.value);
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

  filterButton(isReset: boolean = false) {
    if (isReset) {
      this.formGroup.get('startDate')?.setValue('');
      this.formGroup.get('endDate')?.setValue('');
      this.formGroup.get('searchText')?.setValue('');
    }
    this.getALLMyPrList();
  }

  //filter code start from here
  openFilterDrawer() {
    this.commonService.clearToaster();
    const modalRef = this.offcanvasService.open(FilterComponent, {
      position: 'end',
      ariaLabelledBy: 'offcanvas-basic-title',
      panelClass: 'custom-css-modal',
      scroll: true,
    });
    modalRef.componentInstance.customFilter = JSON.stringify(this.customFilter);
    modalRef.result.then(
      (response) => {
      },
      (data) => {
        if (data) {
          this.customFilter = data;
          this.getALLMyPrList();
          this.cdr.detectChanges();
        }
      }
    );
  }

  closeFilter(type: any) {
    // if (this.customFilter.rangeType == 'LAST_30_DAYS') {
    //   //show alert here
    // } else {
    //   this.setDefaultFilter();
    //   this.getALLMyPrList();
    // }

    switch (type) {
      case 'LAST_30_Days':
        break;
      case 'site':
        this.customFilter.site = '';
        this.getALLMyPrList();
        break;
      case 'department':
        this.customFilter.department = '';
        this.getALLMyPrList();
        break;
      case 'prNo':
        this.customFilter.prNo = '';
        this.getALLMyPrList();
        break;

      default:
        this.setDefaultFilter();
        this.getALLMyPrList();

        break;
    }
  }

  setDefaultFilter() {
    // this.customFilter = {
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   prNo: '',
    //   days: 30,
    //   department: '',
    //   rangeType: 'LAST_30_DAYS',
    //   rangeName: 'Last 30 days',
    //   isPrFieldVisible: true,
    //   isDepartmentVisible: true,
    //   ppoNumber: '',
    //   isSearchByPPONumber: false,
    //   isSearchItemNumber: false,
    //   ItemNumber: '',
    //   site: '',
    //   isSiteVisible: true,
    // };
    this.customFilter = {
      dateRangeSelected: this.commonService.getDefaultDateRange(),
      prNo: '',
      department: '',
      isPrFieldVisible: true,
      isDepartmentVisible: true,
      ppoNumber: '',
      isSearchByPPONumber: false,
      isSearchItemNumber: false,
      ItemNumber: '',
      site: '',
      isSiteVisible: true,
    };
  }

  //open alert for rfq
  confirmationModalForRfqCreate(prid: number) {
    let title = 'Alert';
    let bodyContent = 'Are you sure?';
    this.commonService
      .confirmationModal(title, bodyContent)
      .then((result: any) => {
        //alert(result);
        switch (result) {
          case 'YES':
            this.createRfqByPr(prid);
            break;
          default:
            break;
        }
        this.cdr.detectChanges();
      });
  }

  createRfqByPr(prid: number) {
    let payload = {
      pR_ID: prid,
      type: 'RFQ',
    };
    this.prservice.createRfqByPr(payload).subscribe({
      next: (result: any) => {},
      error: (err) => {
        console.log(err);
      },
    });
  }

  refreshComponentFunction() {
    this.refreshComponent = false;
    setTimeout(() => {
      this.refreshComponent = true;
      this.cdr.detectChanges();
    }, 1);
  }
}
