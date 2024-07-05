import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from '../../../event.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  FilterDescriptor,

  State,
  filterBy,
  orderBy,
  process,
} from '@progress/kendo-data-query';




import { Subject, debounceTime } from 'rxjs';
import { IGetAllBuyer, IRfqDetailDataDto, getBuyer } from '../../../event.interface';
import { Router } from '@angular/router';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-transfer-buyer',
  templateUrl: './transfer-buyer.component.html',
  styleUrls: ['./transfer-buyer.component.scss']
})
export class TransferBuyerComponent {
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  @Input() rfqDetail: IRfqDetailDataDto;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
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
  serachText: string = '';

  getallbuyerlist: any;
  public gridView: GridDataResult;
  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  private searchSubject = new Subject<string>();

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private commonServices: CommonService
  ) {

    this.searchSubject.pipe(debounceTime(1200)).subscribe(() => {
      this.initialLoadData()
    });
  }
  ngOnInit() {
    this.initialLoadData()
  }

  initialLoadData() {
    this.state.skip = 0;
    this.pageNumber = 1;
    this.getAllBuyerApi();
  }


  getAllBuyerApi() {
    let payload: any = {

      searchText: this.serachText,
      pageSize: this.pageSize,
      pageIndex: this.pageNumber,
      sorting: 0

    }
    this.loading = true;
    this.eventService.getAllBuyer(payload).subscribe({
      next: (
        result: any
      ) => {
        this.loading = false;
        this.loadData(result?.data ? result.data : []);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  transferEventToOtherBuyer(item: any) {
    this.loading = true;
    this.eventService.TranferEventToOtherBuyer(this.rfqDetail.eventid, item.personId).subscribe({
      next: (
        result: any
      ) => {
        this.loading = false;
        this.commonServices.showToaster("Event Transfered Successfully", true);
        this.router.navigate(['/Event/RFQList']);
        this.getAllBuyerApi();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.commonServices.showToaster(err.ErrorDetail, false);
      },
    });
  }


  searchChangeHandler() {
    this.inputText = this.searchText;
  }

  public onStateChange(state: any) {
    this.sort = state.sort;
    this.filter = state.filter;
    this.state = state;
    this.pageNumber = state.skip / this.pageSize + 1;
    this.pageSize = state.take;
    this.getAllBuyerApi();
    this.cdr.detectChanges();

  }


  onFilterAllField(event: any) {
    this.serachText = event.target.value;
    this.searchSubject.next('');
  }
  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.getallbuyerlist, {
        filters: [
          {
            filters: [
              {
                field: 'name',
                operator: 'contains',
                value: inputValue,
              },
              // {
              //   field: 'eventName',
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
      return filterBy(this.getallbuyerlist, this.filter);
    }
  }
  checkBoxSelectedHandler(item: any, index: number) {
    this.confirmationModal(item, index);
    this.cdr.detectChanges();
  }

  confirmationModal(item: any, index: any) {
    this.commonServices
      .showAlertForWarning(`Do you want To Transfer this event to this buyer`, '')
      .then((result) => {
        if (result) {
          this.transferEventToOtherBuyer(item);
        } else {
          item.isEnabled = false;
          this.cdr.detectChanges();
        }
      });
  }



  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.getallbuyerlist = data;
    this.gridView = {
      data: this.getallbuyerlist,
      total: this.getallbuyerlist[0]?.totalRows ? this.getallbuyerlist[0].totalRows : 0,
    };
    this.cdr.detectChanges();
  }
  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonServices.checkPermission(key)
  }
}
