import {
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { PurchaseRequistionServiceService } from '../../purchase-requisition/purchase-requistion-service.service';

@Component({
  selector: 'app-event-pr-lines',
  templateUrl: './event-pr-lines.component.html',
  styleUrls: ['./event-pr-lines.component.scss'],
})
export class EventPrLinesComponent {
  linesDataLoading: boolean = false;
  prLineData: any[];
  @Input() prId: number;
  @Input() prNumber: number;
  @Input() isEditMode: boolean;
  @Input() editLineData: any = [];

  @Output() prLinesListEmitter = new EventEmitter<object>();
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  public gridView: GridDataResult;
  columnWidth = 100;
  pageSize = 100;
  isError: boolean = false;
  errorMessage: string = '';
  isInvalidate: boolean = false;

  public state: State = {};

  constructor(
    private prService: PurchaseRequistionServiceService,
    private cdr: ChangeDetectorRef,
    public modal: NgbModal
  ) {}

  ngOnInit() {
    this.getPrLines();
  }

  getPrLines() {
    this.linesDataLoading = true;
    this.prService.getLineItem(this.prId).subscribe({
      next: (result: any) => {
        this.linesDataLoading = false;
        result.data.map((val: any) => {
          if (this.isEditMode) {
            let obj = this.editLineData.find(
              (item: any) => val.prtransid == item.prtransid
            );

            if (obj) {
              val.isEnabled = true;
              val.enterQty = obj.enterQty;
            } else {
              val.isEnabled = false;
              val.enterQty = 0;
            }
          } else {
            val.isEnabled = false;
            val.enterQty = 0;
          }
          return val;
        });
        this.loadPrLineTable(result.data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.linesDataLoading = false;
      },
    });
  }

  private loadPrLineTable(data: any): void {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.prLineData = data;
    this.gridView = {
      data: filterData,
      total: 10,
    };
  }

  ngOnDestroy() {
    this.cdr.detach();
  }
  closeLineModel(data?: any) {
    this.modal.dismissAll(data);
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

  submitPrLine() {
    let data = this.prLineData.filter((val) => val.isEnabled);
    if (data.length == 0) {
      this.isError = true;
      this.errorMessage = 'Please select pr lines';
      this.isInvalidate = true;
    } else {
      let isValid = data.every((val) => {
        return val.enterQty >= 1 && val.enterQty <= val.remQty;
      });

      if (!isValid) {
        // this.isError = true;
        // this.errorMessage = 'Please select pr lines';
        this.isInvalidate = true;
      } else {
        this.closeLineModel(data);
      }
    }
  }
}
