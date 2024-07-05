import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import {
  PrLineHeaderDetail,
  PrLineResponseDto,
  PrLinesDetailResponseDto,
} from '../purchase-requisition';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';

@Component({
  selector: 'app-pr-detail-view',
  templateUrl: './pr-detail-view.component.html',
  styleUrls: ['./pr-detail-view.component.scss'],
})
export class PrDetailViewComponent {
  @Input() PrheaderDetail: PrLineHeaderDetail;
  @Input() PrLinesDetail: PrLinesDetailResponseDto;
  @Input() Data: any;
  @Input() prid: number;
  gridView: GridDataResult;
  prLineData: PrLineResponseDto[] = [];
  columnWidth = 100;
  linesDataLoading: boolean = false;
  pageSize = 100;
  constructor(
    public modal: NgbModal,
    private prService: PurchaseRequistionServiceService,
    private cdr: ChangeDetectorRef
  ) {}
  closeModel() {
    this.modal.dismissAll();
  }
  currentSelected: string = '';
  public state: State = {
    skip: 0,
    take: 10,
  };
  ngOnInit() {
    this.getPrLines();

  }

  getPrLines() {
    this.linesDataLoading = true;
    this.prService.getLineItem(this.prid).subscribe({
      next: (result: any) => {
        // this.prLineData = result.data;
        this.loadPrLineTable(result.data);
        this.linesDataLoading = false;
      },
      error: (err) => {
        this.linesDataLoading = false;
      },
    });
  }

  private loadPrLineTable(prLineData: PrLineResponseDto[]): void {
    this.prLineData = prLineData;
    this.gridView = process(prLineData, this.state);
    this.cdr.detectChanges();
  }

  // setCurrentTab(type: string) {
  //   this.currentSelected = type
  // }
}
