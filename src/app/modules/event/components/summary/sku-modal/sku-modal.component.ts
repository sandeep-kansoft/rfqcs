import { ChangeDetectorRef, Component ,Input} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IRfqDetailDataDto } from '../../../event.interface';
import { IPriceBidResultDataDto } from '../../../event.interface';
import { FilterDescriptor, SortDescriptor, State, filterBy, orderBy,process } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { EventService } from '../../../event.service';

@Component({
  selector: 'app-sku-modal',
  templateUrl: './sku-modal.component.html',
  styleUrls: ['./sku-modal.component.scss']
})
export class SkuModalComponent {
  @Input() rfqDetail : IRfqDetailDataDto

  loading: boolean = false;
  public gridView: GridDataResult;
  dropdownListdata = ['Preview', 'RFQ', 'Auction', 'Lines', 'History'];
  dropdownListWithoutrfq = ['Preview', 'Lines', 'History'];

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  prmodallist:any;
  serachText: string = '';
  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  constructor(
    private modalService: NgbModal,
    private cdr:ChangeDetectorRef,
    private eventService: EventService,
  ){}
  public ngOnInit() {
    // console.log('Rfq Detail : ', this.rfqDetail);
    //this.getGetAllVendorsServiceCall();

    this.getPriceBidLinesServiceCall();

  }


  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      // let pageSize = state.skip / state.take + 1;
      // if (pageSize != this.pageNumber) {
      //   this.pageNumber = pageSize;
      //   this.getMyPrList();
      // } else {
      // }
      this.loadData(this.prmodallist);
    }
  }
  onFilterAllField(event: any) {
    //console.log("Value : ", event.target.value);

    let inputValue;
    if (event) {
      inputValue = event.target.value;
      this.serachText = inputValue;
    } else {
      inputValue = this.serachText;
    }

    let filterData = this.getFilteredData(inputValue);
    this.gridView = process(filterData, this.state);
  }
  showBadgeStatusColorClass(type: string): string {
    let color: string = '';
    switch (type) {
      case 'Published':
        color = 'badge-light-success';
        break;
      case 'Pending':
        color = 'badge-light-warning';
        break;
      case 'Unpublished':
        color = 'badge-light-danger';
        break;
      default:
        break;
    }
    return color;
  }
  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.prmodallist, {
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
      return filterBy(this.prmodallist, this.filter);
    }
  }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.prmodallist = data;
    // this.gridView = {
    //   data: filterData,
    //   total: data.length,
    // };
    this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
  }
  getPriceBidLinesServiceCall() {
    this.loading = true;
    this.eventService.getPriceBidLines(this.rfqDetail.eventid).subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        this.prmodallist = result.data;
        this.loadData(this.prmodallist);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
close(){
    this.modalService.dismissAll();
  }
}
