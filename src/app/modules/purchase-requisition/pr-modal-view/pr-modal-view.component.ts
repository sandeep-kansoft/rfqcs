import { Component, HostListener, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, process, State } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
import { AlertModalComponent } from 'src/app/shared/components/alert-modal/alert-modal.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { PrDetailViewComponent } from '../pr-detail-view/pr-detail-view.component';
import { PrGridDataDto } from '../pr-grid-view';
import {
  PrLineHeaderDetail,
  PrLineHistoryResponseDto,
  PrLineResponseDto,
  PrLinesDetailResponseDto,
} from '../purchase-requisition';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';
import { PohistoryData, PrLinesData } from './data';

@Component({
  selector: 'app-pr-modal-view',
  templateUrl: './pr-modal-view.component.html',
  styleUrls: ['./pr-modal-view.component.scss'],
})
export class PrModalViewComponent {
  headerStyle = 'fw-bold';
  public gridView: GridDataResult;
  public PoHistorydataGridView: GridDataResult;
  @Input() prId: number;
  @Input() prNumber: number;
  @Input() isPrNumberClick: boolean;
  currentTabSelected: string = '';
  toasts: any = [];
  public toasterList$ = new BehaviorSubject([]);
  public currentToasterList$ = this.toasterList$.asObservable();
  public state: State = {
    // sort: [
    //   {
    //     field: 'prid',
    //     dir: 'asc',
    //   },
    // ],
    // filter: {
    //   logic: 'and',
    //   filters: [],
    // },
    skip: 0,
    take: 10,
  };
  prLineData: PrLineResponseDto[];
  prLineHistoryData: PrLineHistoryResponseDto[];
  currentSelectedHistoryData = {
    itemCode: '',
    itemDescription: '',
  };
  currentPage = 'Lines';
  dropdownListdata!: any;
  columnWidth = 150;
  pageSize = 10;
  isFormVisible: boolean = false;
  viewPoHistoryData = [];
  historyDataLoading = false;
  prLinesDetailLoading = false;
  linesDataLoading = false;
  PrheaderDetail: PrLineHeaderDetail;
  PrLinesDetail: PrLinesDetailResponseDto;

  public PoHistorydata: State = {
    sort: [
      {
        field: 'Vendor_Code',
        dir: 'asc',
      },
    ],
    filter: {
      logic: 'and',
      filters: [],
    },
    skip: 0,
    take: 10,
  };

  public isHistoricalDataVisible: boolean = false;

  constructor(
    private commonService: CommonService,
    public modal: NgbActiveModal,
    private prDetailModel: NgbModal,
    private prService: PurchaseRequistionServiceService,
    private modalService: NgbModal
  ) {}

  public ngOnInit() {
    this.dropdownListdata = this.isPrNumberClick
      ? ['VIEW']
      : ['VIEW', 'VIEW HISTORICAL DATA'];
    if (this.isPrNumberClick) {
      this.currentTabSelected = 'Header';
    } else {
      this.currentTabSelected = 'Line';
    }

    // this.getPrLines();
    // this.getPrHeaderDetailByid();

    // this.loadHistorydataTable();
  }

  private loadPrLineTable(): void {
    this.gridView = process(this.prLineData, this.state);
  }

  private loadHistorydataTable(): void {
    this.PoHistorydataGridView = process(
      this.prLineHistoryData,
      this.PoHistorydata
    );
  }

  checkMobileBrowser() {
    return this.commonService.isMobileBrowser;
  }

  editHandler(item: PrGridDataDto) {}

  removeHandler(item: PrGridDataDto) {}

  public onStateChange(state: any) {
    this.state = state;

    const newState: any = Object.assign({}, state);

    const sortDescriptor = state.sort.find((s: any) => s.field === 'prid');
    const newSortDescriptor: SortDescriptor = { field: '', dir: 'asc' };
    if (sortDescriptor && sortDescriptor.field === 'prid') {
      newSortDescriptor.field = 'Unit Price';
      newSortDescriptor.dir = sortDescriptor.dir;
    }
    newState.sort = newState.sort.filter(
      (s: any) => s.field !== 'ProdupridctName'
    );
    newState.sort.push(newSortDescriptor);
    this.loadPrLineTable();
  }

  closeModel() {
    switch (this.currentPage) {
      case 'Form':
        this.currentPage = 'Lines';
        break;
      case 'HistoryData':
        this.currentPage = 'Lines';
        break;
      case 'Lines':
        this.modal.dismiss();
        break;
      case 'Both':
        this.modal.dismiss();
        break;

      default:
        break;
    }

    // if (this.isFormVisible) {
    //   this.isFormVisible = false;
    // } else if (this.isHistoricalDataVisible) {
    //   this.isHistoricalDataVisible = false;
    // } else {
    //   this.modal.dismissAll();
    // }
  }

  dropDownMenuClickHandler(type: string, data: PrLineResponseDto) {
    switch (type) {
      case 'RFQT':
        this.createRfqByPrLine(data.prid, data.prtransid);
        break;
      case 'AUCTION':
        break;
      case 'VIEW':
        //this.showHistoryModel();
        if (!this.isPrNumberClick) {
          this.currentPage = 'Form';
        }

        this.getPrLineDetailByid(data.prtransid);
        break;
      case 'VIEW HISTORICAL DATA':
        this.getPrLinesHistory(data.itemcode);
        this.currentSelectedHistoryData.itemCode = data.itemcode;
        this.currentSelectedHistoryData.itemDescription = data.iteM_DESCRIPTION;
        this.currentPage = 'HistoryData';
        break;

      default:
        break;
    }
  }

  showHistoryModel() {
    this.prDetailModel.open(PrDetailViewComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });
  }

  showBadgeStatusColorClass(param: string): string {
    let type = param.toLowerCase();
    let color: string = '';
    switch (type) {
      case 'pending':
        color = 'badge-light-danger';
        break;
      case 'inprocess':
        color = 'badge-light-warning';
        break;
      case 'Approved':
        color = 'badge-light-success';
        break;
      default:
        break;
    }
    return color;
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

  getPrLinesHistory(itemCode: string) {
    this.historyDataLoading = true;
    this.prService.getPrLineHistory(itemCode).subscribe({
      next: (result: any) => {
        this.prLineHistoryData = result.data;
        this.loadHistorydataTable();
        this.historyDataLoading = false;
      },
      error: (err) => {
        this.historyDataLoading = false;
      },
    });
  }

  getPrHeader(itemCode: string) {
    this.historyDataLoading = true;
    this.prService.getPrLineHistory(itemCode).subscribe({
      next: (result: any) => {
        this.prLineHistoryData = result.data;
        this.loadHistorydataTable();
        this.historyDataLoading = false;
      },
      error: (err) => {
        this.historyDataLoading = false;
      },
    });
  }

  getPrHeaderDetailByid() {
    this.prService.getPrHeaderDetailBYid(this.prId).subscribe({
      next: (result: any) => {
        this.PrheaderDetail = result.data;
      },
      error: (err) => {
        this.historyDataLoading = false;
      },
    });
  }

  getPrLineDetailByid(prtransid: number) {
    this.prLinesDetailLoading = true;
    this.prService.getPrLineDetailBYid(prtransid).subscribe({
      next: (result: any) => {
        this.PrLinesDetail = result.data;
      },
      error: (err) => {
        this.prLinesDetailLoading = false;
      },
    });
  }

  createRfqByPrLine(prid: number, prtransid: number) {
    let payload = {
      pR_ID: prid,
      type: 'RFQ',
      prtraN_ID: prtransid,
    };
    this.prService.createRfqByPrLine(payload).subscribe({
      next: (result: any) => {},
      error: (err) => {
        console.log(err);
      },
    });
  }

  createRfqByLineHandler(item: any) {
    this.confirmationModal(item.prid, item.prtransid, 'are you sure ');
  }

  clearToaster() {
    this.toasts.splice(0, this.toasts.length);
    this.toasterList$.next(this.toasts);
  }

  confirmationModal(
    prid: number,
    prtransid: number,
    title?: string,
    bodyContent?: string
  ) {
    this.clearToaster();
    const modal: NgbModalRef = this.modalService.open(AlertModalComponent, {
      centered: true,
    });
    modal.componentInstance.title = title;
    modal.componentInstance.bodyContent = bodyContent;
    return modal.result.then(
      (result) => {
        this.createRfqByPrLine(prid, prtransid);
      },
      (reason) => {
        return reason;
      }
    );
  }

  onTabItemClick(type: string) {
    switch (type) {
      case 'Header':
        this.currentTabSelected = 'Header';
        break;
      case 'Line':
        this.currentTabSelected = 'Line';
        break;
      default:
        break;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.modal.dismiss()
    }
  }
}
