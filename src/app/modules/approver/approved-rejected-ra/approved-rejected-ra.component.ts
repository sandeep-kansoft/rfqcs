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
import { CommonService } from 'src/app/shared/services/common.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import { NgbModal, NgbModalRef, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import {
  ExcelExportData,
  Workbook,
} from '@progress/kendo-angular-excel-export';
import { saveAs } from '@progress/kendo-file-saver';
import { filter, map, Observable, zip } from 'rxjs';

import { PrResponseDto } from '../../purchase-requisition/purchase-requisition';

import { Router } from '@angular/router';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { PrModalViewComponent } from '../../purchase-requisition/pr-modal-view/pr-modal-view.component';
import { ApproverService } from '../approver.service';
import { PrModalComponent } from '../../event/components/summary/pr-modal/pr-modal.component';
import { IDefaultResponseDto, IRfqcsListDataDto } from '../../event/event.interface';

@Component({
  selector: 'app-approved-rejected-ra',
  templateUrl: './approved-rejected-ra.component.html',
  styleUrls: ['./approved-rejected-ra.component.scss']
})
export class ApprovedRejectedRAComponent {

  public gridView: GridDataResult;
  dropdownListdata = ['Preview', 'RFQ', 'Auction', 'Lines', 'History'];
  columnWidth = 150;
  headerStyle = 'fw-bold';
  smallColumnWidth = 120;
  longColumnWidth = 200;
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  middleColumnWidth = 100;
  MediumColumnWidth = 130;
  LargeColumnWidth = 190;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  format='MM/DD/YYYY HH:mm:ss'
  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  authData: any;

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  rfqPrData: any;
  refreshComponent: boolean = true;

  serachText: string = '';
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
    private commonService: CommonService,
    private prDetailModel: NgbModal,
    private prLineViewModel: NgbModal,
    private prHistoryModel: NgbModal,
    private approveService: ApproverService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
    private modalService: NgbModal,
    private prmodal: NgbModal
  ) {
    this.allData = this.allData.bind(this);
  }

  public ngOnInit() {

    // this.commonService.isReadOnlyRfqcsView$.next(false)
    this.commonService.setAdminViewFlag(false)
    this.authData = this.commonService.getAuthData();
    this.setDefaultFilter();
    this.getApprovedRejectedRAList();
  }



  checkMobileBrowser() {
    return this.commonService.isMobileBrowser;
  }

  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.rfqPrData);
    }
  }

  showdata(data: any) {
  }

  openprmodal(item: any) {
    const modelRef = this.prmodal.open(PrModalComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    modelRef.componentInstance.eventId = item.evenT_ID;
    modelRef.componentInstance.eventTitle = item.evenT_NAME;
    modelRef.result.then(
      (err) => {
      },
      (data) => {
        if (data) {
          // this.getPriceBidColumnsServiceCall();
          this.cdr.detectChanges();
        }
      }
    );
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

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.rfqEventList, { sort: this.state.sort }).data,
    };

    return result;
  }
  rfqEventList: IRfqcsListDataDto[] = [];

  getApprovedRejectedRAList() {
    let payload = {
      userId: this.authData.userId,
      eventcode: '',
      eventname: '',
      currentstatus: '',
      projectName: '',
      eventType: '',
      userName: '',
      startDate: '',
      endDate: '',
    };

    if (this.customFilter.dateRangeSelected?.days != 0) {
      payload.startDate = this.commonService
        .getLastDateFromRange(this.customFilter.dateRangeSelected?.days)
        .toISOString()
        .slice(0, 10);
      payload.endDate = new Date().toISOString().slice(0, 10);
    } else {
      payload.startDate = this.customFilter.dateRangeSelected?.startDate
        .toISOString()
        .slice(0, 10);
      payload.endDate = this.customFilter.dateRangeSelected?.endDate.toISOString().slice(0, 10);
    }

    this.loading = true;
    this.approveService
      .getApprovedRejectedRAList(payload)

      .subscribe({
        next: (result: IDefaultResponseDto<IRfqcsListDataDto[]>) => {

          if (result.success) {
            let resultFilterData = result.data.map((o: any) => {
              o.evenT_NO = parseInt(o.evenT_NO);
              o.createD_DATE = o.createD_DATE ? new Date(new Date((o.createD_DATE as any).split('T')[0]).setHours(0, 0, 0)) : null;
              o['closinG_TIME_Format'] = o.closinG_TIME ? new Date(new Date((o.closinG_TIME as any).split('T')[0]).setHours(0, 0, 0)) : null;
              return o;
            }).filter(
              (val: any) => val.evenT_STATUS != 'Deleted'
            );
            this.loading = false;
            this.refreshComponentFunction();
            this.loadData(resultFilterData);
            this.cdr.detectChanges();
          } else {
            this.loading = false;
            this.commonService.showToaster(result.errorDetail, false)
            this.cdr.detectChanges()
          }


        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }

 


  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.rfqPrData = data;
    this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
    else {
      this.gridView = process(filterData, this.state);
    }
    this.cdr.detectChanges();
  }

  gotoEventDashboard(eventDetail: any) {

    // this.router.navigate(
    //   ['/Event/EventDashboard'], {state:{ EventId: eventDetail.evenT_ID }}
    // );
    this.router.navigate(['/Event/EventDashboard'], {
      state: { EventId: eventDetail.evenT_ID,eventDetail: eventDetail },
    });
  }

  // goToCreateRfq() {
  //   this.router.navigate(['/Event/CreateRfqAuction']);
  // }

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

    let filterData;
    if (inputValue != '') {
      filterData = filterBy(this.rfqPrData, {
        filters: [
          {
            filters: [
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
                field: 'evenT_STATUS',
                operator: 'contains',
                value: inputValue,
              },
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
                field: 'evenT_ROUND',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'createD_BY',
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
            ],
            logic: 'or',
          },
        ],
        logic: 'or',
      });
    } else {
      filterData = filterBy(this.rfqPrData, this.filter);
    }

    this.gridView = process(filterData, this.state);
  }

  //filter code start from here
  openFilterDrawer() {
    this.commonService.clearToaster();
    const modalRef = this.offcanvasService.open(FilterComponent, {
      position: 'end',
      ariaLabelledBy: 'offcanvas-basic-title',
    });
    modalRef.componentInstance.customFilter = JSON.stringify(this.customFilter);
    modalRef.result.then(
      (response) => {
      },
      (data) => {
        if (data) {
          this.customFilter = data;
          this.getApprovedRejectedRAList();
          this.cdr.detectChanges();
        }
      }
    );
  }

  closeFilter() {
    if (this.customFilter.dateRangeSelected?.isDefault) {
      //show alert here
    } else {
      this.setDefaultFilter();
      this.getApprovedRejectedRAList();
    }
  }

  setDefaultFilter() {
    this.customFilter = {
      dateRangeSelected: this.commonService.getDefaultDateRange(),
      prNo: '',
      department: '',
      isPrFieldVisible: true,
      isDepartmentVisible: true,
      ppoNumber: '',
      isSearchByPPONumber: false,
      isSearchItemNumber: false,
      ItemNumber: '',
      site: '',
      isSiteVisible: false,
    };
  }

  refreshComponentFunction() {
    this.refreshComponent = false;
    setTimeout(() => {
      this.refreshComponent = true;
      this.cdr.detectChanges();
    }, 1);
  }

  openLinesModel(prNumber: number, prId: number) {
    const modelRef = this.prLineViewModel.open(PrModalViewComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });

    modelRef.componentInstance.prId = prId;
    modelRef.componentInstance.prNumber = prNumber;
    modelRef.componentInstance.isPrNumberClick = true;
  }

  //single input modal code start from here
 
  dateTimeZoneConverter(Date:any,fromTimeZone:any,toTimeZone:any){
    return this.commonService.convertTimeZone(Date,fromTimeZone,toTimeZone,this.format)
  }


}
