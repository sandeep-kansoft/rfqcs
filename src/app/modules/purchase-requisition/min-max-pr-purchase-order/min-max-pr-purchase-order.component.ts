import { ChangeDetectorRef, Component } from '@angular/core';
import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';

import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import { CommonService } from 'src/app/shared/services/common.service';
import { PrGridDataDto } from '../pr-grid-view';
import { SortDescriptor } from '@progress/kendo-data-query';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PrModalViewComponent } from '../pr-modal-view/pr-modal-view.component';
import { PrHistoryDetailComponent } from '../pr-history-detail/pr-history-detail.component';
import {
  ExcelExportData,
  Workbook,
} from '@progress/kendo-angular-excel-export';
import { saveAs } from '@progress/kendo-file-saver';
import { Observable, zip } from 'rxjs';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';
import {
  PPOPendingOrderDto,
  PrHistoryResponseDto,
  PrResponseDto,
} from '../purchase-requisition';
import { PrMinMaxPendingOrderOnhandComponent } from '../pr-min-max-pending-order-onhand/pr-min-max-pending-order-onhand.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-min-max-pr-purchase-order',
  templateUrl: './min-max-pr-purchase-order.component.html',
  styleUrls: ['./min-max-pr-purchase-order.component.scss'],
})
export class MinMaxPrPurchaseOrderComponent {
  public gridView: GridDataResult;
  dropdownListdata = ['Preview', 'RFQ', 'Auction', 'Lines', 'History'];
  columnWidth = 150;
  headerStyle = 'fw-bold';

  longColumnWidth = 200;
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 100;
  MediumColumnWidth = 120;
  LargeColumnWidth = 170;
  XtraLargeColumnWidth = 190;
  XtraXtraLargeColumnWidth = 280;
  pageSize = 10;
  pageNumber = 0;
  loading: boolean = false;
  searchText: string = '';
  threeDecimalRegex: RegExp
  // ppoPendingData: PPOPendingOrderDto[] = [];
  formGroup!: FormGroup;
  isInvalidate: boolean = false;
  serachText: string = '';
  createPPOLoading: boolean = false;

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  pendingPPOList: PPOPendingOrderDto[];
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  lastSelectedSite: number | null = null;

  customFilter: ICustomFilterDataDto = {
    dateRangeSelected: null,
    prNo: '',
    department: '',
    isPrFieldVisible: false,
    isDepartmentVisible: false,
    ppoNumber: '',
    isSearchByPPONumber: true,
    isSearchItemNumber: false,
    ItemNumber: '',
    site: '',
    isSiteVisible: true,
  };
  refreshComponent: boolean = true;

  constructor(
    private commonService: CommonService,
    private prDetailModel: NgbModal,
    private prLineViewModel: NgbModal,
    private prHistoryModel: NgbModal,
    private prservice: PurchaseRequistionServiceService,
    private cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    private offcanvasService: NgbOffcanvas,
    private router: Router,

  ) {
    this.allData = this.allData.bind(this);
    this.formGroup = this.fb.group({
      startDate: [''],
      endDate: [''],
      searchText: [''],
    });
  }
  getValidation(item: any) {
    return (
      this.isInvalidate &&
      item.isEnabled &&
      (item.enterQty === 0 ||
        item.enterQty > item.remQty ||
        item.enterQty < item.remQty)
    );
  }
  public ngOnInit() {
    this.setDefaultFilter();
    this.getPendingPPO();
    this.threeDecimalRegex = this.commonService.threeDecimalRegex
  }
  checkMobileBrowser() {
    return this.commonService.isMobileBrowser;
  }

  editHandler(item: PrGridDataDto) { }

  removeHandler(item: PrGridDataDto) { }

  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.pendingPPOList);
    }
  }

  public allData(): ExcelExportData {
    let stateData = this.state;
    stateData.take = this.pendingPPOList.length;
    let data;
    if (this.serachText != '') {
      let filterData = this.getFilteredData(this.serachText);
      data = process(filterData, stateData).data;
    } else {
      data = process(this.pendingPPOList, stateData).data;
    }
    data = data.map((val, index) => {
      val.sno = index + 1;
      val.ppoDate = val.ppoDate
        ? this.commonService.getTimeFormatString(val.ppoDate, 'DD-MMM-YYYY')
        : '';
      val.lastPODate = val.lastPODate
        ? this.commonService.getTimeFormatString(val.lastPODate, 'DD-MMM-YYYY')
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
      return filterBy(this.pendingPPOList, {
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
                field: 'ppoNo',
                operator: 'contains',
                value: inputValue,
              },

              {
                field: 'itemCode',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'itemDescription',
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
                field: 'reqQuantity',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'poQty',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'poInProcess',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'inProcessQty',
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
                field: 'prQty',
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
                field: 'lastPPONo',
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
      return filterBy(this.pendingPPOList, this.filter);
    }
  }

  onModelClick(
    type: string,
    item: PPOPendingOrderDto,
    isPrNumberClick = false
  ) {
    switch (type) {
      case 'Preview':
        break;
      case 'RFQ':
        break;
      case 'Auction':
        break;
      case 'Lines':
        break;
      case 'History':
        break;
      case 'Hand':
        this.openOnHandModel(item);
        break;
      default:
        break;
    }
  }

  openLinesModel(id?: number, isPrNumberClick: boolean = false) {
    const modelRef = this.prLineViewModel.open(PrModalViewComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });

    modelRef.componentInstance.prId = id;
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

  openOnHandModel(data: PPOPendingOrderDto) {
    const modelRef = this.prHistoryModel.open(
      PrMinMaxPendingOrderOnhandComponent,
      {
        centered: true,
        fullscreen: true,
        scrollable: true,
      }
    );
    modelRef.componentInstance.ppoId = data.ppoId;
  }
  showdata(data: any) {
  }

  showBadgeStatusColorClass(type: string): string {
    let color: string = '';
    switch (type) {
      case 'Approved':
        color = 'badge-light-success';
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

  getPendingPPO() {
    this.loading = true;
    let startDate;
    let endDate;
    if (this.customFilter.dateRangeSelected?.days != 0) {
      startDate = this.commonService
        .getLastDateFromRange(this.customFilter.dateRangeSelected?.days)
        .toISOString()
        .slice(0, 10);
      endDate = new Date().toISOString().slice(0, 10);
    } else {
      startDate = this.customFilter.dateRangeSelected?.startDate
        .toISOString()
        .slice(0, 10);
      endDate = this.customFilter.dateRangeSelected?.endDate
        .toISOString()
        .slice(0, 10);
    }
    this.prservice
      .getPendingPPO(startDate, endDate, this.customFilter.site)
      .pipe(
        map((items: any) =>
          items.data.map((val: any) => {
            val.isEnabled = false;
            val.enterQty = 0;
            val.ppoDate = val.ppoDate
              ? new Date(
                new Date((val.ppoDate as any).split('T')[0]).setHours(0, 0, 0)
              )
              : null;
            val.lastPODate = val.lastPODate
              ? new Date(
                new Date((val.lastPODate as any).split('T')[0]).setHours(
                  0,
                  0,
                  0
                )
              )
              : null;
            return val;
          })
        )
      )
      .subscribe({
        next: (data: any) => {
          this.pendingPPOList = data;
          this.loading = false;
          this.refreshComponentFunction();
          this.loadData(data);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }

  // public btnCommand(item: any) {
  //   console.log("hello",item);
  // }
  // rfqfunction(){
  //   console.log('rfq is hit')
  // }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.pendingPPOList = data;
    this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
    else {
      this.gridView = process(filterData, this.state);
    }
    this.cdr.detectChanges();
  }

  searchButtonCLick() { }

  filterButton(isReset: boolean = false) {
    if (isReset) {
      this.formGroup.get('searchText')?.setValue('');
    }
    this.getPendingPPO();
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

  createRfqHandler() {
    let selectedList: any = this.pendingPPOList.filter(
      (val: any) => val.isEnabled
    );
    for(let i=0;i<selectedList.length;i++){
      if(selectedList[i].enterQty>selectedList[i].netOrderQty){
        this.commonService.showToaster("Order Qty can not be greater than net Qty",false);
        // console.log("this.is for test",this.threeDecimalRegex.test(selectedList[i].enterQty))
        return;
      }
      if(!this.threeDecimalRegex.test(selectedList[i].enterQty)){
        this.commonService.showToaster("Order Qty can not exceed three decimal value",false)
        return;
      }
    }
    if (selectedList.length == 0) {
      // handle if no list is selected
    }

    else {
      // validate qty is not  0

      let isValid = selectedList.every((val: any) => {
        return val.enterQty > 0;
      });

      if (isValid) {
        let ppoDtoList = selectedList.map((val: any) => {
          let obj = {
            ppoid: val.ppoId,
            qty: val.enterQty,
            line: 0,
          };
          return obj;
        });
        let payload = {
          siteId: selectedList[0].site,
          pPODto: ppoDtoList,
        };

        this.createRfqByPPo(payload);
      } else {
        this.commonService.showToaster(
          'Order qty should be greater than 0.',
          false
        );
      }
    }
  }

  // create rfq by ppo
  createRfqByPPo(payload: any) {
    let node = document.getElementById('createRfq');
    // loader on
    node?.setAttribute('data-kt-indicator', 'on');

    this.createPPOLoading = true;
    this.prservice.createRfqByPPO(payload).subscribe({
      next: (result: any) => {
        this.createPPOLoading = false;
        // loader off

        node?.removeAttribute('data-kt-indicator');
        if (result.success) {
          this.commonService.showToaster('RFQ created successfully', true);
          this.router.navigate(['/Event/EventDashboard'], {
            state: { EventId: result.data },
          });
        } else {
          this.commonService.showToaster(result.errorDetail, false);
        }
      },
      error: (err) => {
        node?.removeAttribute('data-kt-indicator');
        this.createPPOLoading = false;
      },
    });
  }

  //open alert
  confirmationModal(index: number, item: any) {
    // let title = 'Alert';
    // let bodyContent =
    //   'If you select this item, preview items will be deselected. are you sure, you want select this one?';
    // this.commonService
    //   .confirmationModal(title, bodyContent)
    //   .then((result: any) => {
    //     //alert(result);
    //     switch (result) {
    //       case 'YES':
    //         this.pendingPPOList = this.pendingPPOList.map((val: any) => {
    //           val.isEnabled = false;
    //           return val;
    //         });
    //         this.lastSelectedSite = item.site;
    //         this.pendingPPOList[index].isEnabled = true;
    //         this.loadData(this.pendingPPOList);
    //         break;
    //       default:
    //         // this.lastSelectedSite = null;
    //         this.pendingPPOList[index].isEnabled = false;
    //         this.loadData(this.pendingPPOList);
    //         break;
    //     }
    //     this.cdr.detectChanges();
    //   });

    // Swal.fire({
    //   title: 'Alert',
    //   icon: 'success',
    //   text: 'If you select this item, preview items will be deselected. are you sure, you want select this one?',
    //   showDenyButton: false,
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: `No`,
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {
    //   }
    // });

    this.commonService
      .showAlertForWarning(
        `Selected item is of site ${item.site}  If you select this item, Already selected items of ${this.lastSelectedSite} will be deselected. Are you sure you want continue?`,
        ''
      )
      .then((result) => {
        if (result) {
          this.pendingPPOList = this.pendingPPOList.map((val: any) => {
            val.isEnabled = false;
            return val;
          });
          this.lastSelectedSite = item.site;
          this.pendingPPOList[index].isEnabled = true;
          this.loadData(this.pendingPPOList);
        } else {
          this.pendingPPOList[index].isEnabled = false;
          this.loadData(this.pendingPPOList);
        }
      });
  }

  checkBoxSelectedHandler(item: any, index: number) {
      this.cdr.detectChanges();
    if (item.isEnabled) {
      item.enterQty=item.netOrderQty;
     if (this.lastSelectedSite == null || this.lastSelectedSite == item.site) {
        this.lastSelectedSite = item.site;
      } else {
        this.confirmationModal(index, item);
        this.cdr.detectChanges();
      }
    } else {
      item.enterQty=0;
      let selectedList: any = this.pendingPPOList.filter(
        (val: any) => val.isEnabled
      );
      if (selectedList.length == 0) {
        this.lastSelectedSite = null;
      }
    }

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
          this.getPendingPPO();
          this.cdr.detectChanges();
        }
      }
    );
  }

  closeFilter(type: any) {
    switch (type) {
      case 'LAST_30_Days':
        break;
      case 'site':
        this.customFilter.site = '';
        this.getPendingPPO();
        break;
      case 'prNo':
        this.customFilter.prNo = '';
        this.getPendingPPO();
        break;
      case 'department':
        this.customFilter.department = '';
        this.getPendingPPO();
        break;
      default:
        this.setDefaultFilter();
        this.getPendingPPO();

        break;
    }
    // if (this.customFilter.rangeType == 'LAST_30_DAYS') {
    //   //show alert here
    // } else {
    //   this.setDefaultFilter();
    //   this.getPendingPPO();
    // }
  }

  setDefaultFilter() {
    this.customFilter = {
      dateRangeSelected: this.commonService.getDefaultDateRange(),
      prNo: '',
      department: '',
      isPrFieldVisible: false,
      isDepartmentVisible: false,
      ppoNumber: '',
      isSearchByPPONumber: true,
      isSearchItemNumber: false,
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
