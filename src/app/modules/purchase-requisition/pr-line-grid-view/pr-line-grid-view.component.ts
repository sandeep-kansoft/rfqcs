import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { PrLineResponseDto } from '../purchase-requisition';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';
import { FilterDescriptor, process, SortDescriptor, State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AlertModalComponent } from 'src/app/shared/components/alert-modal/alert-modal.component';
import { PrLineHistoryGridComponent } from '../pr-line-history-grid/pr-line-history-grid.component';
import { PrLineDeatailFormComponent } from '../pr-line-detail-form/pr-line-deatail-form.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { CreateAuctionComponent } from '../create-auction/create-auction.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pr-line-grid-view',
  templateUrl: './pr-line-grid-view.component.html',
  styleUrls: ['./pr-line-grid-view.component.scss'],
})
export class PrLineGridViewComponent {
  linesDataLoading: boolean = false;
  @Input() prId: number;
  @Input() prnum: number;
  @Input() type: boolean;
  headerStyle = 'fw-bold';
  prLineData: PrLineResponseDto[];
  pageSize: number = 10;
  columnWidth = 100;
  longColumnWidth = 200;
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 100;
  MediumColumnWidth = 120;
  LargeColumnWidth = 170;
  XtraLargeColumnWidth = 190;
  XtraXtraLargeColumnWidth = 280;
  dropdownListdata!: any;
  gridView: GridDataResult;

    public state: State = {
      filter: undefined,
      group: [],
      skip: 0,
      sort: [],
      take: 10,
    };

  toasts: any = [];
  public toasterList$ = new BehaviorSubject([]);
  public currentToasterList$ = this.toasterList$.asObservable();
  constructor(
    private prService: PurchaseRequistionServiceService,
    private modalService: NgbModal,
    private prLineHistoryModel: NgbModal,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private auctionDrawer: NgbModal,
    private router: Router,
    private acitveNgbModel: NgbActiveModal
  ) { }

  ngOnInit() {
    this.dropdownListdata = ['VIEW', 'VIEW HISTORICAL DATA'];
    this.getPrLines();
  }

  getPrLines() {
    this.linesDataLoading = true;
    this.prService.getLineItem(this.prId).subscribe({
      next: (result: any) => {
        this.prLineData = result.data;
        this.loadPrLineTable();
        this.linesDataLoading = false;
      },
      error: (err) => {
        this.linesDataLoading = false;
      },
    });
  }
  private loadPrLineTable(): void {
    this.gridView = process(this.prLineData, this.state);
  }

  // public onStateChange(state: any) {
  //   this.state = state;

  //   const newState: any = state
  //   // Object.assign({}, state);

  //   const sortDescriptor = state.sort.find((s: any) => s.field === 'prid');
  //   const newSortDescriptor: SortDescriptor = { field: '', dir: 'asc' };
  //   if (sortDescriptor && sortDescriptor.field === 'prid') {
  //     newSortDescriptor.field = 'Unit Price';
  //     newSortDescriptor.dir = sortDescriptor.dir;
  //   }
  //   newState.sort = newState.sort.filter(
  //     (s: any) => s.field !== 'ProdupridctName'
  //   );
  //   newState.sort.push(newSortDescriptor);
  //   this.loadPrLineTable();
  // }
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  public onStateChange(state: any) {
    if (!this.linesDataLoading ) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadPrLineTable();
    }
  }
  /**
   * The function returns a CSS class based on the input status type.
   * @param {string} type - a string representing the status type of a badge.
   * @returns a string representing the CSS class for the badge status.
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
    return color;
  }

  /**
   * creates an RFQ for a PR line item after confirming with the user.
   */
  createRfqByLineHandler(item: PrLineResponseDto) {
    let pR_NUM: any = item.pR_NUM;
    if (!item.isEventCreation) {
      this.commonService.showToaster('Rfq already created', false);
      return;
    }
    this.commonService
      .showAlertForWarning(`Are you sure?`, `you want to create RFQ for ${this.prnum} ?`)
      .then((result) => {
        if (result) {
          this.createRfqByPrLine(item.prid, item.prtransid);
        }
      });
  }

  clearToaster() {
    this.toasts.splice(0, this.toasts.length);
    this.toasterList$.next(this.toasts);
  }



  /**
   * Api request for quotation (RFQ) based on a purchase request line and handles
   * the response.
   * @param {number} prid - a number representing the ID of a purchase request
   * @param {number} prtransid - The prtransid parameter is the ID of a specific transaction within a
   * purchase request (PR)
   */
  createRfqByPrLine(prid: number, prtransid: number) {
    let payload = {
      pR_ID: prid,
      type: 'RFQ',
      prtraN_ID: prtransid,
    };
    this.prService.createRfqByPrLine(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonService.showToaster('RFQ created successfully', true);
          this.acitveNgbModel.close();
          this.router.navigate(['/Event/EventDashboard'], {
            state: { EventId: result.data },
          });
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * The function handles click events on a dropdown menu and performs different actions based on the
   * selected option.
   * @param {string} type - a string that represents the type of action to be performed when the dropdown
   * menu is clicked. It can be either "VIEW" or "VIEW HISTORICAL DATA".
   * @param {PrLineResponseDto} data - The data parameter is an
   * object containing information related to a purchase request line.
   */
  dropDownMenuClickHandler(type: string, data: PrLineResponseDto) {
    switch (type) {
      case 'VIEW':
        this.showPrlineDetailFormComponent(data.prtransid);
        break;
      case 'VIEW HISTORICAL DATA':
        this.showPrLineHistoryModel(data.itemcode);
        break;

      default:
        break;
    }
  }

  showPrLineHistoryModel(itemCode: string) {
    let modelRef: NgbModalRef = this.prLineHistoryModel.open(
      PrLineHistoryGridComponent,
      {
        centered: true,
        fullscreen: true,
        scrollable: true,
      }
    );
    modelRef.componentInstance.itemCode = itemCode;
  }

  /**
   * This function opens a modal window for displaying the details of a PR line item.
   * @param {number} prtansId - prtansId is a number parameter that represents the ID of a PR (Purchase
   * Request) transaction. It is used as input to open a modal window that displays the details of a PR
   * line item.
   */
  showPrlineDetailFormComponent(prtansId: number) {
    let modelRef: NgbModalRef = this.prLineHistoryModel.open(
      PrLineDeatailFormComponent,
      {
        centered: true,
        fullscreen: true,
        scrollable: true,
      }
    );
    modelRef.componentInstance.prtransid = prtansId;
  }

  /**
   * This function checks if an auction has already been created for a given item and opens a drawer to
   * create a new auction if one does not already exist.
   */
  createAuctionByPrLineHandler(item: PrLineResponseDto) {
    if (!item.isEventCreation) {
      this.commonService.showToaster('Auction already created', false);
      return;
    }

    this.openAuctionDrawer(item);
  }

  openAuctionDrawer(item: PrLineResponseDto) {
    const modelRef = this.auctionDrawer.open(CreateAuctionComponent, {
      centered: true,
      animation: true,
      scrollable: true,
    });
    modelRef.componentInstance.PrId = item.prid;
    modelRef.componentInstance.prtraN_ID = item.prtransid;
    modelRef.componentInstance.isModel = true;
    modelRef.componentInstance.type = 'Lines';
    modelRef.result.then(
      (err) => { },
      (data) => { }
    );
  }
}
