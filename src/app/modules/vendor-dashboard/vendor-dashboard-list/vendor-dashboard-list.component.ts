import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import * as moment from 'moment';
import { CommonService } from 'src/app/shared/services/common.service';
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
import { PrModalComponent } from '../../event/components/summary/pr-modal/pr-modal.component';
import {
  IGetVendorWiseEventsResponseDto,
  IRfqDetailDataDto,
  ThreadReplyDto,
  ThreadUserDto,
} from '../../event/event.interface';
import { RegretModelComponent } from './regret-model/regret-model.component';
import { AuthModel } from '../../auth/models/auth.model';
import { MailBoxComponent } from '../../event/components/summary/mail-box/mail-box.component';
import { MailBoxViewComponent } from '../../event/components/summary/mail-box-view/mail-box-view.component';
import { ChatFileuploadComponent } from '../../event/components/summary/chat.fileupload/chat.fileupload.component';
import { ChatComponent } from '../../event/components/summary/chat/chat.component';

@Component({
  selector: 'app-vendor-dashboard-list',
  templateUrl: './vendor-dashboard-list.component.html',
  styleUrls: ['./vendor-dashboard-list.component.scss'],
})
export class VendorDashboardListComponent {
  loading: boolean = false;
  format='DD/MM/YYYY HH:mm:ss'
  public gridView: GridDataResult;
  dropdownListdata = ['Preview', 'RFQ', 'Auction', 'Lines', 'History'];
  dropdownListWithoutrfq = ['Preview', 'Lines', 'History'];
  vedordashboarddata: IGetVendorWiseEventsResponseDto[] = [];
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
  item: any;
  threadUsers: ThreadUserDto[] = [];
  authData: AuthModel | null | undefined;
  showProfileFlag: boolean = false;
  primaryList: ThreadReplyDto[] = [];
  threadRepliesList: ThreadReplyDto[] = [];
  chatTitle: string;
  _userId: number;
  _userRole: string;
  chatThreadId: string;
  _userEmail: string;
  _emailToReply: string;
  eventId: number;
  @ViewChild('scrollChatMe') private myScrollContainer: ElementRef;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private commonServices: CommonService,
    private router: Router,
    private prmodal: NgbModal,
    private commonService: CommonService,
    private regretmodal: NgbModal,
    private uploadService: NgbModal,
    private activeCanvas: NgbOffcanvas
  ) {}
  public ngOnInit() {
    this.getVendorWiseEvents();
    // this.loadData([{eventNo :"3295",EVENTNAME:"WCLRFQ / 113/ PR23014617",TYPE:"RFQ",PROJECTNAME:"No Project Name",BUYERNAME:"VIJAY CHAPLOT" },{eventNo :"3295",EVENTNAME:"WCLRFQ / 113/ PR23014617",TYPE:"RFQ",PROJECTNAME:"No Project Name",BUYERNAME:"VIJAY CHAPLOT" },{eventNo :"3295",EVENTNAME:"WCLRFQ / 113/ PR23014617",TYPE:"RFQ",PROJECTNAME:"No Project Name",BUYERNAME:"VIJAY CHAPLOT" },{eventNo :"3295",EVENTNAME:"WCLRFQ / 113/ PR23014617",TYPE:"RFQ",PROJECTNAME:"No Project Name",BUYERNAME:"VIJAY CHAPLOT" },{eventNo :"3295",EVENTNAME:"WCLRFQ / 113/ PR23014617",TYPE:"RFQ",PROJECTNAME:"No Project Name",BUYERNAME:"VIJAY CHAPLOT" }])
  }
  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.vedordashboarddata);
    }
  }
  getVendorWiseEvents() {
    const payload: any = {};
    this.loading = true;
    this.eventService.GetVendorWiseEvents().subscribe({
      next: (result: any) => {
        let data = result.data.map((val: any) => {
          val.isLoading = false;
          val.eventStatus = this.commonServices.eventStatusAndTypeMapping(
            val.currentstatus
          );
          val.EventType = this.commonServices.eventTypeMapping(val.eventtype);
          return val;
        });
        this.loading = false;
        this.loadData(data);
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
  gotoEventDashboard(eventDetail: any) {
    this.router.navigate(['/Event/EventDashboard'], {
      state: {
        EventId: eventDetail.eventid,
        threadid: eventDetail.threadId,
        eventName: eventDetail.eventName,
        vendorId: eventDetail.vendorid,
        msgSendTo: eventDetail.sendTo,
        eventDetail: eventDetail
      },
    });
  }
  regretCondition(item: IGetVendorWiseEventsResponseDto) {
    return item.eventStatus == 'Published' && item.isRegret == 1 ? true : false;
  }
  participatecondition(item: IGetVendorWiseEventsResponseDto) {
    return item.eventStatus == 'Published' && item.isParticipate == 1
      ? true
      : false;
  }

  showparticipateStatusColorClass(type: string): string {
    let color: string = '';
    switch (type) {
      case 'Participated':
        color = 'badge-light-success';
        break;
      case 'Pending':
        color = 'badge-light-warning';
        break;
      case 'Unpublished':
        color = 'badge-light-danger';
        break;
        case 'Regretted':
          color ='badge-light-danger';
          break;
          case 'Assigned':
            color ='badge-light-warning';
            break;
      default:
        break;
    }
    return color;
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

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.vedordashboarddata, {
        filters: [
          {
            filters: [
              {
                field: 'eventStatus',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'participatestatus',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'round',
                operator: 'contains',
                value: inputValue,
              },
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
              {
                field: 'EventType',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'buyerName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'remDays',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'bidClosingDate',
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
      return filterBy(this.vedordashboarddata, this.filter);
    }
  }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.vedordashboarddata = data;
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
  }
  openprmodal(item: any) {
    const modelRef = this.prmodal.open(PrModalComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    modelRef.componentInstance.eventId = item.eventid;
    modelRef.componentInstance.eventTitle = item.eventName;
    modelRef.result.then(
      (err) => {
        console.log('Detail', err);
      },
      (result) => {
        if (result) {
          // this.getPriceBidColumnsServiceCall();

          this.cdr.detectChanges();
        }
      }
    );
  }

  participateconfirmation(
    item: IGetVendorWiseEventsResponseDto,
    index: number
  ) {
    this.commonService
      .showAlertForWarning(
        'Participate',
        'Are you sure, you want to participate ?'
      )
      .then((result) => {
        if (result) {
          // this.deleteEventVendor(item);
          if (!this.vedordashboarddata[index].isLoading) {
            this.regretParticipateRfq(item, true, index);
          }
        }
      });
  }

  openregretmodel(item: IGetVendorWiseEventsResponseDto) {
    const modelRef = this.regretmodal.open(RegretModelComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });
    modelRef.componentInstance.eventId = item.eventid;
    modelRef.componentInstance.eventTitle = item.eventName;
    modelRef.componentInstance.eventNo = item.eventNo;

    modelRef.result.then(
      (res) => {
        if (res) {
          this.getVendorWiseEvents();
        }
      },
      (data) => {
        if (data) {
          // this.cdr.detectChanges();
        }
      }
    );
  }

  regretParticipateRfq(
    item: IGetVendorWiseEventsResponseDto,
    forParticipate: boolean,
    index: number
  ) {
    this.commonService.setGlobalLoaderStatus(true);
    // this.vedordashboarddata[index].isLoading = true;
    // this.loading=true;
    const payload: any = {
      eventId: item.eventid,
      participate: forParticipate,
      regret: !forParticipate,
      regretData: {
        regretType: forParticipate ? '' : 'need to update here',
        regretRemark: forParticipate ? '' : 'need to update here',
      },
    };

    this.eventService.RegretParticipateRfq(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          if (forParticipate) {
            this.gotoEventDashboard(item);
            this.commonService.setGlobalLoaderStatus(false);
          }
          this.commonService.setGlobalLoaderStatus(false);
          this.commonService.showToaster(
            `Vendor ${
              forParticipate ? 'participated' : 'regreted'
            } successfully `,
            true

          );
        } else {
          this.commonService.setGlobalLoaderStatus(false);
          this.getVendorWiseEvents();
          this.commonService.showToaster(result.errorDetail, false);
        }
        // this.vedordashboarddata[index].isloading = true;
        this.loading=false;
        this.cdr.detectChanges();
        this.commonService.setGlobalLoaderStatus(false);
      },
      error: (err) => {
        this.loading=false;
        this.commonService.setGlobalLoaderStatus(false);
      },
    });
  }

  // openChatDrawer(item: any) {
  //   const modelRef = this.activeCanvas.open(ChatComponent, {
  //     position: 'end',
  //     ariaLabelledBy: 'offcanvas-basic-title',
  //   });
  //   modelRef.componentInstance.eventId = item.eventid;
  //   modelRef.componentInstance.chatThreadId = item.threadId;
  //   modelRef.componentInstance.chatForBuyer = false;
  //   modelRef.componentInstance.isModel = false;
  //   modelRef.componentInstance.eventName = item.eventName;
  //   modelRef.componentInstance.writeable = true;
  // }
  // closeFilter(type: any) {}

  dateTimeZoneConverter(Date:any,fromTimeZone:any,toTimeZone:any){
    let convertedDate=this.convertDateString(Date)
    return this.commonService.convertTimeZone(convertedDate,fromTimeZone,toTimeZone,this.format)
  }

  convertDateString(dateStr: string): string {
    // Parse the input date string with moment
    const parsedDate = moment(dateStr);
  
    // Format the date to the ISO 8601 format
    // Note: This will keep the original date and time, converting it to ISO format
    const formattedDate = parsedDate.format('DD/MM/YYYY HH:mm:ss');
  
    return formattedDate;
  }
}
