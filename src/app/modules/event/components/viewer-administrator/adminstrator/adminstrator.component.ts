import { Component, EventEmitter, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-adminstrator',
  templateUrl: './adminstrator.component.html',
  styleUrls: ['./adminstrator.component.scss']
})
export class AdminstratorComponent {

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
  @Output() updateCheckList$ = new EventEmitter();
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
    this.getAllBuyerApiForAdmistrator();
  }


  getAllBuyerApiForAdmistrator() {
    let payload: any = {
      isAdmin: true,
      searchText: this.serachText,
      pageSize: this.pageSize,
      pageIndex: this.pageNumber,
      sorting: 0,
      eventId:this.rfqDetail.eventid

    }
    this.loading = true;
    this.eventService.getAllBuyerForAdminstrator(payload).subscribe({
      next: (
        result: any
      ) => {
        this.loading = false;
        let data = result.data.sort(
          (a: any, b: any) =>   {
            return (a.isAdmin   === b.isAdmin)? 0 : a.isAdmin? -1 : 1;
          });
          console.log("sorted admin list",data)
        this.loadData(result?.data ? data : []);
        this.updateCheckList();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  SaveRAadmin(item: any) {
    this.loading = true;
    this.eventService.SelectAdministratorApi(this.rfqDetail.eventid, item.personId).subscribe({
      next: (
        result: any
      ) => {
        this.loading = false;
        this.commonServices.showToaster("Administrator Saved Successfully", true);
        // this.router.navigate(['/Event/RFQList']);
        this.getAllBuyerApiForAdmistrator();
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
    this.getAllBuyerApiForAdmistrator();
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
              {
                field: 'personId',
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
      return filterBy(this.getallbuyerlist, this.filter);
    }
  }
  checkBoxSelectedHandler(event:any,item: any, index: number) {
    this.confirmationModal(event,item, index);
    this.cdr.detectChanges();
  }

  confirmationModal(event:any,item: any, index: any) {
    this.commonServices
      .showAlertForWarning(`Do you want To Select Admistrator`, '')
      .then((result) => {
        if (result) {
          this.SaveRAadmin(item);
        } else {
          this.getAllBuyerApiForAdmistrator();
          event.target.checked=false;
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
  updateCheckList() {
    this.updateCheckList$.emit();
  }

  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonServices.checkPermission(key)
  }
}
