import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, process, State, FilterDescriptor } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/shared/services/common.service';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';

@Component({
  selector: 'app-pr-min-max-pending-order-onhand',
  templateUrl: './pr-min-max-pending-order-onhand.component.html',
  styleUrls: ['./pr-min-max-pending-order-onhand.component.scss']
})
export class PrMinMaxPendingOrderOnhandComponent {
  headerStyle = 'fw-bold';
  @Input() ppoId: number;
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
  onHandData!: any[];
  dropdownListdata = ['RFQT', 'AUCTION', 'VIEW', 'VIEW HISTORICAL DATA'];
  columnWidth = 150;
  pageSize = 10;
  isLoading = false
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;


  constructor(
    private commonService: CommonService,
    public modal: NgbModal,
    private prDetailModel: NgbModal,
    private prService: PurchaseRequistionServiceService
  ) { }

  public ngOnInit() {
    this.getOnHandQuantity();
    // this.loadProducts();
  }

  private loadProducts(): void {
    this.gridView = process(this.onHandData, this.state);
  }

  checkMobileBrowser() {
    return this.commonService.isMobileBrowser;
  }

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

  getOnHandQuantity() {
    this.isLoading = true
    this.prService.getOnHandQuantity(this.ppoId).subscribe({
      next: (result: any) => {
        this.onHandData = [result.data];
        this.isLoading = false
        this.loadProducts();
      },
      error: (err) => {
        this.isLoading = false
      },
    });
  }
}
