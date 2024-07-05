import { ChangeDetectorRef, Component } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import { CommonService } from 'src/app/shared/services/common.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import {
  NgbModal,
  NgbOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import { PrModalViewComponent } from '../pr-modal-view/pr-modal-view.component';
import { PrHistoryDetailComponent } from '../pr-history-detail/pr-history-detail.component';
import {
  ExcelExportData,
} from '@progress/kendo-angular-excel-export';
import { BehaviorSubject, map } from 'rxjs';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';
import { PrResponseDto } from '../purchase-requisition';
import { EventService } from '../../event/event.service';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CreateAuctionComponent } from '../create-auction/create-auction.component';

@Component({
  selector: 'app-pr-overview',
  templateUrl: './pr-overview.component.html',
  styleUrls: ['./pr-overview.component.scss'],
})
export class PrOverviewComponent {
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
  overviewdata: PrResponseDto[] = [];
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
    private prLineViewModel: NgbModal,
    private prHistoryModel: NgbModal,
    private auctionDrawer: NgbOffcanvas,
    private prservice: PurchaseRequistionServiceService,
    private cdr: ChangeDetectorRef,
    private offcanvasService: NgbOffcanvas,
    private router: Router
  ) {
    this.allData = this.allData.bind(this);
  }

  public ngOnInit() {
    this.setDefaultFilter();
    this.getMyPrList();
  }

  /**
   * The function returns a dropdown list of action options based on whether an event creation is
   * involved or not.
   */
  actionOptionsForPrLines(item: PrResponseDto) {
    return item.isEventCreation
      ? this.dropdownListdata
      : this.dropdownListWithoutrfq;
  }

  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.myPrData);
    }
  }

  /**
   * The function handles different types of clicks on a dropdown and performs corresponding actions.
   * @param {string} type - a string that determines the action to be taken when a model is clicked. It
   * can be one of the following: 'Preview', 'RFQ', 'Auction', 'Lines', or 'History'.
   * @param {PrResponseDto} item - A variable of type PrResponseDto, which contains information about a
   * purchase request (PR).
   * @param [isPrNumberClick=false] - A boolean value that indicates whether the user clicked on the PR
   * number in the model or not.
   */
  onModelClick(type: string, item: PrResponseDto, isPrNumberClick = false) {
    switch (type) {
      case 'Preview':
        this.downlaodPDFAPI(item.prid);
        break;
      case 'RFQ':
        this.createRfqByPr(item.prid);
        break;
      case 'Auction':
        this.openAuctionDrawer(item);
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

  openLinesModel(item?: PrResponseDto, isPrNumberClick: boolean = false) {
    const modelRef = this.prLineViewModel.open(PrModalViewComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });
    modelRef.componentInstance.prId = item?.prid;
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

  /**
   * The function returns a CSS class based on the input status type.
   * @param {string} type - a string representing the status type of a badge. The function returns a
   * string representing the CSS class for the corresponding color of the badge based on the status
   * type. The possible status types are 'Approved', 'InProcess', 'Pending', and 'Closed'.
   * @returns a string that represents a CSS class for the badge status color based on the input type.
   */
  showBadgeStatusColorClass(type: string): string {
    let color: string = '';
    switch (type) {
      case 'Approved':
        color = 'badge-light-success';
        break;
      case 'InProcess':
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

  /**
   * This function exports data to Excel format with some formatting and filtering options.
   */
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


  getMyPrList() {
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

    this.loading = true;
    this.prservice
      .getMyPrList(
        startDate,
        endDate,
        this.customFilter.site,
        this.customFilter.department
      )
      .pipe(
        map((items: any) =>
          items.data.map((o: any) => {
            o['approvedDateFormat'] = new Date(
              new Date((o.approvedDate as any).split('T')[0]).setHours(0, 0, 0)
            );
            o['enterdateFormat'] = new Date(
              new Date((o.enterdate as any).split('T')[0]).setHours(0, 0, 0)
            );
            return o;
          })
        )
      )
      .subscribe({
        next: (result: any) => {
          this.overviewdata = result;
          this.loading = false;
          this.refreshComponentFunction();
          this.loadData(result);
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.myPrData = data;

    if (this.serachText != '') {
      this.onFilterAllField(null);
    } else {
      this.gridView = process(filterData, this.state);
    }
    this.cdr.detectChanges()
  }

  /**
   * The function downloads a PDF file using an API and opens it in a new window.
   * @param {number} prid - a number representing the ID of a purchase request (PR) that is used to
   * download a PDF file associated with that PR.
   */
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


  /**
   * This function filters data based on user input and updates the grid view accordingly.
   * @param {any} event -  A string value that is used to filter the data based on various
   * fields.
   */
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

  /**
   * This function opens a filter drawer and updates the custom filter based on user input.
   */
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
          this.cdr.detectChanges();
          this.getMyPrList();
        }
      }
    );
  }

  /**
   * The function performs the action then the chip close is clicked
   * @param {any} type - The type of filter to be closed. It can be 'LAST_30_Days', 'site', or
   * 'department'.
   */
  closeFilter(type: any) {
    debugger;
    switch (type) {
      case 'LAST_30_Days':
        break;
      case 'site':
        this.customFilter.site = '';
        this.getMyPrList();
        break;
      case 'department':
        this.customFilter.department = '';
        this.getMyPrList();
        break;

      default:
        this.setDefaultFilter();
        this.getMyPrList();

        break;
    }

    // if (this.customFilter.rangeType == 'LAST_30_Days') {
    //   //show alert here
    // } else {
    //   this.setDefaultFilter();
    //   this.getMyPrList();
    // }
  }

  /**
   * The function sets default values for a custom filter object.
   */
  setDefaultFilter() {
    this.customFilter = {
      dateRangeSelected: this.commonService.getDefaultDateRange(),
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
    this.cdr.detectChanges();
  }

  /**
   * This function displays a confirmation modal for creating an RFQ and calls the createRfqByPr function
   * if the user confirms.
   */
  confirmationModalForRfqCreate(item: PrResponseDto) {
    let prid: number = item.prid;
    let pR_NUM: string = item.pR_NUM;

    if (!item.isEventCreation) {
      this.commonService.showToaster('Rfq already created', false);
      return;
    }

    if (!this.createRfqLoader) {
      this.commonService
        .showAlertForWarning(
          `Are you sure`,
          `you want to create RFQ for ${pR_NUM} ?`
        )
        .then((result) => {
          if (result) {
            this.createRfqByPr(prid);
          }
        });
    }
  }

  /**
   * This function creates a request for quotation (RFQ) based on a purchase request ID (PRID) and
   * navigates to the event dashboard upon successful creation.
   * @param {number} prid - a number representing the ID of a purchase request (PR) for which an RFQ
   * (request for quotation) is to be created.
   */
  createRfqByPr(prid: number) {
    let payload = {
      pR_ID: prid,
      type: 'RFQ',
    };
    this.createRfqLoader = true;
    this.prservice.createRfqByPr(payload).subscribe({
      next: (result: any) => {
        this.createRfqLoader = false;
        if (result.success) {
          this.commonService.showToaster('RFQ created successfully', true);

          this.router.navigate(['/Event/EventDashboard'], {
            state: { EventId: result.data },
          });
          this.cdr.detectChanges();
        } else {
          this.createRfqLoader = false;
          this.commonService.showToaster(result.errorDetail, false);
        }

        // Swal.fire('Created Successfully!', '', 'success');
      },
      error: (err) => {
        this.createRfqLoader = false;

        // this.commonService.showToaster(result.errorDetail,false)
        // this.commonService.showToaster(err.errorDetail, false);
        console.log(err.errors);
      },
    });
  }

  /**
   * This function opens a drawer to create an auction for a PR item if it has not already been created.
   * @param {PrResponseDto} item - A parameter of type PrResponseDto that represents the item for which
   * the auction drawer is being opened.
   */
  openAuctionDrawer(item: PrResponseDto) {
    if (!item.isEventCreation) {
      this.commonService.showToaster('Auction already created', false);
      return;
    }

    const modelRef = this.auctionDrawer.open(CreateAuctionComponent, {
      position: 'end',
      ariaLabelledBy: 'offcanvas-basic-title',
    });
    modelRef.componentInstance.PrId = item.prid;
    modelRef.componentInstance.type = 'PR';
    modelRef.componentInstance.remQty = item.remQty;
    modelRef.result.then(
      (response) => {
      },
      (data) => {
        if (data) {
        }
      }
    );
  }

  refreshComponentFunction() {
    this.refreshComponent = false;
    setTimeout(() => {
      this.refreshComponent = true;
      this.cdr.detectChanges();
    }, 1);
  }
}
