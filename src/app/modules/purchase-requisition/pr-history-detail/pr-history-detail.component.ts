import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, process, State, FilterDescriptor, orderBy, filterBy } from '@progress/kendo-data-query';
import { map } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { PrHistoryResponseDto } from '../purchase-requisition';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';
import { historyData } from './historydata';

@Component({
  selector: 'app-pr-history-detail',
  templateUrl: './pr-history-detail.component.html',
  styleUrls: ['./pr-history-detail.component.scss'],
})
export class PrHistoryDetailComponent {
  headerStyle = 'fw-bold';
  @Input() prId: number;
  public gridView: GridDataResult;
  public state: State = {
    sort: [
      {
        field: 'prid',
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
  historyDataLocal!: PrHistoryResponseDto[];
  dropdownListdata = ['RFQT', 'AUCTION', 'VIEW', 'VIEW HISTORICAL DATA'];
  columnWidth = 150;
  pageSize = 10;
  isLoading = false;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  constructor(
    private commonService: CommonService,
    public modal: NgbModal,
    private prDetailModel: NgbModal,
    private prService: PurchaseRequistionServiceService,
    public cdr : ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.getPrHistory();
  }

  private loadProducts(): void {
    let sortedData = orderBy(this.historyDataLocal, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges()
  }

  checkMobileBrowser() {
    return this.commonService.isMobileBrowser;
  }

  public onStateChange(state: any) {
    this.sort = state.sort;
    this.filter = state.filter;
    this.state = state;
    this.loadProducts();
  }

  closeModel() {
    this.modal.dismissAll();
  }
  showBadgeStatusColorClass(type: string): string {
    let color: string = '';
    switch (type) {
      case 'Approved':
        color = 'badge-light-success';
        break;
      case 'Pending':
        color = 'badge-light-warning';
        break;
      case ' [ Recall ] ':
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

  getPrHistory() {
    this.isLoading = true;
    this.prService
      .getPrHistory(this.prId)
      .pipe(
        map((items: any) =>
          items.data.map((o: any) => {
            o.assigned_Date = new Date(
              new Date((o.assigned_Date as any).split('T')[0]).setHours(0, 0, 0)
            );
            o.action_Taken_Date = new Date(
              new Date((o.action_Taken_Date as any).split('T')[0]).setHours(
                0,
                0,
                0
              )
            );
            return o;
          })
        )
        // if I understand what you are wanting here, otherwise replace "{extra}" with "extra", or go back to your original notation
      )
      .subscribe({
        next: (result: any) => {
          this.historyDataLocal = result;
          this.isLoading = false;
          this.loadProducts();
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }
}
