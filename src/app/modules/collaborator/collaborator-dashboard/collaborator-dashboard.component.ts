import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import { SortDescriptor } from '@progress/kendo-data-query';
import {
  NgbActiveOffcanvas,
  NgbModal,
  NgbModalRef,
  NgbOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import {
  ExcelExportData,
  Workbook,
} from '@progress/kendo-angular-excel-export';
import { EventService } from '../../event/event.service';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { IRfqcsListDataDto } from '../../event/event.interface';
@Component({
  selector: 'app-collaborator-dashboard',
  templateUrl: './collaborator-dashboard.component.html',
  styleUrls: ['./collaborator-dashboard.component.scss'],
})
export class CollaboratorDashboardComponent {
  loading: boolean = false;
  collabratordata: IRfqcsListDataDto[] = [];
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
  customFilter: ICustomFilterDataDto = {
    dateRangeSelected: null,
    prNo: '',
    department: '',
    isPrFieldVisible: false,
    isDepartmentVisible: false,
    ppoNumber: '',
    isSearchByPPONumber: false,
    isSearchItemNumber: false,
    ItemNumber: '',
    site: '',
    isSiteVisible: false,
  };
  constructor(
    private router: Router,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService
  ) { }
  public ngOnInit() {
    // this.authData = this.commonService.getAuthData();
    // this.setDefaultFilter();
    this.commonService.setAdminViewFlag(false)
    this.getRfqPrList();
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
      this.loadData(this.collabratordata);
    }
  }
  onFilterAllField(event: any) {
    //console.log("Value : ", event.target.value);

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

  getRfqPrList() {
    let payload = {
      eventcode: '',
      eventname: '',
      currentstatus: '',
      projectName: '',
      eventType: '',
      userName: '',
      startDate: '',
      endDate: '',
    };

    payload.startDate = this.commonService
      .getLastDateFromRange(360)
      .toISOString()
      .slice(0, 10);
    payload.endDate = new Date().toISOString().slice(0, 10);

    this.loading = true;
    this.eventService.getRFQListApi(payload).subscribe({
      next: (result: any) => {
        this.collabratordata = result.data;
        this.loading = false;
        this.loadData(this.collabratordata);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.collabratordata, {
        filters: [
          {
            filters: [
              {
                field: 'evenT_ROUND',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'evenT_NO',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'evenT_NAME',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'pR_NO',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'pR_VALUE',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'createD_BY',
                operator: 'contains',
                value: inputValue,
              },
              // {
              //   field: 'closinG_TIME',
              //   operator: 'contains',
              //   value: inputValue,
              // },
              {
                field: 'projecT_NAME',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'event_Type',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'evenT_STATUS',
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
      return filterBy(this.collabratordata, this.filter);
    }
  }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.collabratordata = data;
    if (this.serachText != '') {
      this.onFilterAllField(null);
    } else {
      this.gridView = process(filterData, this.state);
    }
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

  gotoEventDashboard(eventDetail: IRfqcsListDataDto) {
    this.router.navigate(['/Event/EventDashboard'], {
      state: {
        EventId: eventDetail.evenT_ID,
        threadid: eventDetail.threadId,
        eventName: eventDetail.evenT_NAME,
        eventDetail: eventDetail
      },
    });
  }
}
