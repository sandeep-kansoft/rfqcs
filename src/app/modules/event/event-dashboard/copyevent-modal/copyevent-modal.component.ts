import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  FilterDescriptor,
  SortDescriptor,
  State,
  filterBy,
  orderBy,
  process,
} from '@progress/kendo-data-query';
import { EventService } from '../../event.service';
import {
  IDefaultResponseDto,
  IGetRfqForCopyEvent,
  IRfqDataDtoById,
} from '../../event.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import { IRfqDetailDataDto } from '../../event.interface';
import { Subject, debounceTime } from 'rxjs';
@Component({
  selector: 'app-copyevent-modal',
  templateUrl: './copyevent-modal.component.html',
  styleUrls: ['./copyevent-modal.component.scss'],
})
export class CopyeventModalComponent {
  loading: boolean = false;
  public gridView: GridDataResult;
  @Input() rfqDetail: IRfqDetailDataDto;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  searchText: string = '';
  inputText: string = '';
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  getRfqdataforcopyevent: IGetRfqForCopyEvent[] = [];
  serachText: string = '';
  private searchSubject = new Subject<string>();

  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;
  saveLoading: boolean = false;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private commonService: CommonService
  ) {
    this.searchSubject.pipe(debounceTime(1200)).subscribe(() => {
      if (this.searchText.trim() != '') {
        this.initialLoadData();
      } else {
        this.initialLoadData();
      }
    });
  }
  public ngOnInit() {
    // this.getRfqforcopyevent();
    this.initialLoadData();
  }

  initialLoadData() {
    this.state.skip = 0
    this.pageNumber = 1;
    this.getRfqforcopyevent();
  }

  public onStateChange(state: any) {
    this.sort = state.sort;
    this.filter = state.filter;
    this.state = state;
    this.pageNumber = state.skip / this.pageSize + 1;
    this.pageSize = state.take;
    this.getRfqforcopyevent();
    this.cdr.detectChanges();

    // let pageSize = state.skip / state.take + 1;
    // if (pageSize != this.pageNumber) {
    //   this.pageNumber = pageSize;
    //   this.getRfqforcopyevent();
    // } else {
    //   this.loadData(this.getRfqdataforcopyevent);
    // }

    // this.loadData(this.getRfqdataforcopyevent);
  }

  searchChangeHandler() {
    this.inputText = this.searchText;
  }
  onFilterAllField(event: any) {
    this.serachText = event.target.value;
    this.searchSubject.next('');

  }
  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.getRfqdataforcopyevent, {
        filters: [
          {
            filters: [
              {
                field: 'eventNo',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'eventName',
                operator: 'contains',
                value: inputValue,
              },
              // {
              //   field: 'eventName',
              //   operator: 'contains',
              //   value: inputValue,
              // },
              // {
              //   field: 'eventTypeName',
              //   operator: 'contains',
              //   value: inputValue,
              // },
              // {
              //   field: 'eventName',
              //   operator: 'contains',
              //   value: inputValue,
              // },
              // {
              //   field: 'eventTypeName',
              //   operator: 'contains',
              //   value: inputValue,
              // },
              // {
              //   field: 'prSubType',
              //   operator: 'contains',
              //   value: inputValue,
              // },
              // {
              //   field: 'preparer',
              //   operator: 'contains',
              //   value: inputValue,
              // },
              // {
              //   field: 'totalValue',
              //   operator: 'contains',
              //   value: inputValue,
              // },
              // {
              //   field: 'assignBuyer',
              //   operator: 'contains',
              //   value: inputValue,
              // },
            ],
            logic: 'or',
          },
        ],
        logic: 'or',
      });
    } else {
      return filterBy(this.getRfqdataforcopyevent, this.filter);
    }
  }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.getRfqdataforcopyevent = data;
    this.gridView = {
      data: this.getRfqdataforcopyevent,
      total: this.getRfqdataforcopyevent[0]?.totalRows ? this.getRfqdataforcopyevent[0]?.totalRows : 0,
    };
    this.cdr.detectChanges();
  }
  close() {
    this.modalService.dismissAll();
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
        color = 'badge-light-primary';
        break;
      case 'Terminated':
        color = 'badge-light-danger';
        break;
      case 'Closed':
        color = 'badge-light-danger';
        break;
      case 'Extended':
        color = 'badge-light-info';
        break;
      default:
        break;
    }
    return color;
  }
  checkBoxSelectedHandler(item: IGetRfqForCopyEvent, index: number) {
    this.getRfqdataforcopyevent[index].eventId;
    this.confirmationModal(index, item);
    this.cdr.detectChanges();
  }

  confirmationModal(index: number, item: IGetRfqForCopyEvent) {
    this.commonService
      .showAlertForWarning(`Do you want To copy this event`, '')
      .then((result) => {
        if (result) {
          this.RfqcsCopyEvent(item.eventId, this.rfqDetail.eventid);
          this.close();
        } else {
          item.isEnabled = false;
          this.cdr.detectChanges();
        }
      });
  }
  RfqcsCopyEvent(copyFromEvent: number, copyToEvent: number) {
    if (!this.saveLoading) {
      this.saveLoading = true;
      this.eventService.rfqcsCopyEvent(copyFromEvent, copyToEvent).subscribe({
        next: (result: any) => {
          this.saveLoading = false;

          if (result.success) {
            this.commonService.showToaster('Event successfully copied', true);
          } else {
            this.commonService.showToaster(result.errorDetail, false);
          }

          // console.log('get rfq for copyevent: ', this.getRfqdataforcopyevent);
          // this.loadData(result.data);
          // this.cdr.detectChanges();
        },
        error: (err) => {
          this.saveLoading = false;
          console.log(err);
          this.loading = false;
        },
      });
    }
  }

  getRfqforcopyevent() {
    this.loading = true;
    this.eventService
      .getRfqForCopyEvent(this.pageNumber, this.pageSize, this.serachText)
      .subscribe({
        next: (result: IDefaultResponseDto<IGetRfqForCopyEvent[]>) => {
          this.loading = false;
          let data: any[] = []
          if (result.success) {
            data = result.data.sort(
              (a: any, b: any) => a.eventNo - b.eventNo
            );
          }
          // console.log('get rfq for copyevent: ', this.getRfqdataforcopyevent);

          this.loadData(data);
          // this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }
}
