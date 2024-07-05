import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {
  PrLineHistoryResponseDto,
  PrLineResponseDto,
} from '../purchase-requisition';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';
import { filterBy, FilterDescriptor, orderBy, process, SortDescriptor, State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';

@Component({
  selector: 'app-pr-line-history-grid',
  templateUrl: './pr-line-history-grid.component.html',
  styleUrls: ['./pr-line-history-grid.component.scss'],
})
export class PrLineHistoryGridComponent {
  historyDataLoading: boolean = false;
  prLineHistoryData: PrLineResponseDto[];
  @Input() itemCode: string;
  PoHistorydataGridView: GridDataResult;
  headerStyle = 'fw-bold';
  columnWidth = 100;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  pageSize = 100;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  constructor(
    private prService: PurchaseRequistionServiceService,
    public activeModel: NgbActiveModal,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getPrLinesHistory(this.itemCode);
  }

  /**
   * This function retrieves purchase request line history data for a specific item code and formats the
   * date before displaying it in a table.
   * @param {string} itemCode - a string parameter representing the code of an item for which the
   * purchase request line history is being fetched.
   */
  getPrLinesHistory(itemCode: string) {
    this.historyDataLoading = true;
    this.prService
      .getPrLineHistory(itemCode)
      .pipe(
        map((items: any) =>
          items.data.map((o: any) => {
            o.podate = o.podate ? new Date(new Date((o.podate as any).split('T')[0]).setHours(0, 0, 0)) : null;
            return o;
          })
        )
      )
      .subscribe({
        next: (result: any) => {
          this.prLineHistoryData = result;
          this.historyDataLoading = false;
          this.loadHistorydataTable();

        },
        error: (err) => {
          this.historyDataLoading = false;
          this.cdr.detectChanges()
        },
      });
  }

  /**
   * The function loads data into a history data table using a process function and detects changes.
   */
  private loadHistorydataTable(): void {

    let sortedData = orderBy(this.prLineHistoryData, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.PoHistorydataGridView = process(filterData, this.state);
    this.cdr.detectChanges()

  }

  /**
   * The function updates the state object by modifying the sort descriptor and then loads a data table.
   * @param {any} state - The current state of the component. It is of type 'any', which means it can be
   * any data type.
   */
  public onStateChange(state: any) {
    this.sort = state.sort;
    this.filter = state.filter;
    this.state = state;
    this.loadHistorydataTable();
  }

  /**
   * The function closes a model.
   */
  closeModel() {
    this.activeModel.close();
  }
}
