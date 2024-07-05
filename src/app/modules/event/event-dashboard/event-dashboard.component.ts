import { ActivatedRoute, Params } from '@angular/router';

import { PrResponseDto } from '../../purchase-requisition/purchase-requisition';
import {
  EventDashboardEnums,
  IDefaultResponseDto,
  IGetAssignnedCollabrativeUserDataDta,
  IGetVendorWiseEventsResponseDto,
  IgetWfUserRole,
  INextRoundRfqTypePayload,
  IRfqcsListDataDto,
  IRfqDataDtoById,
  IRfqDetailDataDto,
  PublishChecklistResponseDto,
  TabDataDto,
} from '../event.interface';

import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
import { BehaviorSubject, catchError, debounceTime, forkJoin, interval, map, Observable, of, Subject, Subscription, switchAll, switchMap, takeUntil, tap, timer, zip } from 'rxjs';

import { EventService } from '../../event/event.service';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { AlertModalComponent } from 'src/app/shared/components/alert-modal/alert-modal.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { SingleInputModalComponent } from '../components/single-input-modal/single-input-modal.component';
import { ScrollTopComponent } from 'src/app/_metronic/kt/components';
import { AuthModel } from '../../auth/models/auth.model';
import { CopyeventModalComponent } from './copyevent-modal/copyevent-modal.component';
import { ChatComponent } from '../components/summary/chat/chat.component';
import { NextRoundComponentPopUpComponent } from '../next-round-component-pop-up/next-round-component-pop-up.component';
import * as moment from 'moment';
import { SingleDropdownComponentComponent } from '../components/single-dropdown-component/single-dropdown-component.component';
import { ApproverService } from '../../approver/approver.service';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-event-dashboard',
  templateUrl: './event-dashboard.component.html',
  styleUrls: ['./event-dashboard.component.scss'],
})
export class EventDashboardComponent {
  public gridView: GridDataResult;
  columnWidth = 150;
  ApproveAndSubmitAuctionButtonEnabled:boolean=true;
  submitforapprovalButtonEnabled:boolean=true;
  reverseAuctionSubmitLoading: boolean = false;
  headerStyle = 'fw-bold';
  isApproveRejectButtonDisabled: boolean = false;
  ExtraSmallColumnWidth = 50;
  WFuserRole: IgetWfUserRole;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  pageSize = 10;
  serachText: string = '';
  pageNumber = 1;
  longColumnWidth = 200;
  eventId: number;
  threadId: any;
  eventName: any;
  msgSendTo: number;
  currentCollaboratorPermission: IGetAssignnedCollabrativeUserDataDta | null =
    null;
  vendorwisedata: any;
  loading: boolean = false;
  myPrData: PrResponseDto[];
  rfqDetail: IRfqDetailDataDto;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  public vendorWiseLoading: boolean = false;
  public vendorWiseList: IGetVendorWiseEventsResponseDto[] = [];
  public vendorgGridView: GridDataResult;
  authData: AuthModel | null | undefined;
  eventRound: string;
  private subscription: Subscription;
  collaboratorPermission: IGetAssignnedCollabrativeUserDataDta;
  // @ViewChild('scrollEventRef') scrollEvent: ElementRef;
  @ViewChild('scrollEventRef', { read: ElementRef }) scrollEventRef: any;
  private autoRefreshRfqDetial = new Subject<string>();

  activeTab: string = 'SUMMARY';
  iconBaseUrl: string = 'assets/media/wonder/';
  publishMailData: any = {
    subject: "",
    body: ""
  }
  publishCheckList: PublishChecklistResponseDto


  tabList: TabDataDto[] = [
    {
      tabName: 'Summary',
      tabType: EventDashboardEnums.SUMMARY,
      isVisible: false,
      icon: this.iconBaseUrl + 'summary.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'Technical',
      tabType: EventDashboardEnums.TECHNICAL,
      isVisible: false,
      icon: this.iconBaseUrl + 'technical-icon.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'T & C',
      tabType: EventDashboardEnums.TERM_CONDITION,
      isVisible: false,
      icon: this.iconBaseUrl + 'terms-and-condition-icon.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'Price Bid',
      tabType: EventDashboardEnums.PRICE_BID,
      isVisible: false,
      icon: this.iconBaseUrl + 'price-bid-icon.svg',
      isChecked: false,
      isDisabled: false
    },

    {
      tabName: 'Buyer Doc.',
      tabType: EventDashboardEnums.BUYER_DOCUMENTS,
      isVisible: false,
      icon: this.iconBaseUrl + 'buyer-document.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'View CS',
      tabType: EventDashboardEnums.VIEW_CS,
      isVisible: false,
      icon: this.iconBaseUrl + 'view-cs.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'Vendors',
      tabType: EventDashboardEnums.VENDORS,
      isVisible: false,
      icon: this.iconBaseUrl + 'vendors-tab-icon.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'Collaboration',
      tabType: EventDashboardEnums.COLLABORATION,
      isVisible: false,
      icon: this.iconBaseUrl + 'collaborator-icon.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'Reverse Auction Settings',
      tabType: EventDashboardEnums.Reverse_Auction_Settings,
      isVisible: false,
      icon: this.iconBaseUrl + 'price-bid-icon.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'Viewer & Adminstrator',
      tabType: EventDashboardEnums.Viewers_And_Administrator,
      isVisible: false,
      icon: this.iconBaseUrl + 'price-bid-icon.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'Schedule',
      tabType: EventDashboardEnums.SCHEDULE,
      isVisible: false,
      icon: this.iconBaseUrl + 'schedule-icon.svg',
      isChecked: false,
      isDisabled: false
    },

    {
      tabName: 'Publish',
      tabType: EventDashboardEnums.PUBLISH,
      isVisible: false,
      icon: this.iconBaseUrl + 'publish-icon.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'Cs-Approval',
      tabType: EventDashboardEnums.CS_APPROVAL,
      isVisible: false,
      icon: this.iconBaseUrl + 'cs-approve.svg',
      isChecked: false,
      isDisabled: false
    },

    {
      tabName: 'Vendor Analysis',
      tabType: EventDashboardEnums.VENDOR_ANALYSIS,
      isVisible: false,
      icon: this.iconBaseUrl + 'publish-icon.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'View Auction',
      tabType: EventDashboardEnums.VIEW_AUCTION,
      isVisible: false,
      icon: this.iconBaseUrl + 'view-auction.svg',
      isChecked: false,
      isDisabled: false
    },
    {
      tabName: 'Goto Auction',
      tabType: EventDashboardEnums.GOTO_AUCTION,
      isVisible: false,
      icon: this.iconBaseUrl + 'goto-auction.svg',
      isChecked: false,
      isDisabled: false
    },

    {
      tabName: 'Vendor PDF',
      tabType: EventDashboardEnums.VENDOR_PDF,
      isVisible: false,
      icon: this.iconBaseUrl + 'vendor-pdf.svg',
      isChecked: false,
      isDisabled: false
    },
  ];

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
    isSiteVisible: true,
  };

  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  interval: any

  constructor(
    private commonService: CommonService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private copyevent: NgbModal,
    private activeCanvas: NgbOffcanvas,
    private nextRoundModel: NgbModal,
    private approveService: ApproverService,
    private permissionService: PermissionService
  ) {
    this.authData = this.commonService.getAuthData();
    console.log("authData",this.authData);
    this.autoRefreshRfqDetial.pipe(
      debounceTime(800),
    ).subscribe(() => {
      this.syncRfqDetail()
    });
  }

  onFilterAllField(event: any) {
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
      return filterBy(this.myPrData, {
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
      return filterBy(this.myPrData, this.filter);
    }
  }

  closeFilter() {
    if (this.customFilter.dateRangeSelected?.isDefault) {
      //show alert here
    } else {
      this.setDefaultFilter();
    }
  }

  setDefaultFilter() {
    this.customFilter = {
      dateRangeSelected: this.commonService.getDefaultDateRange(),
      prNo: '',
      department: '',
      isPrFieldVisible: false,
      isDepartmentVisible: true,
      ppoNumber: '',
      isSearchByPPONumber: false,
      isSearchItemNumber: false,
      ItemNumber: '',
      site: '',
      isSiteVisible: true,
    };
  }
  vendorRfqDetail: IGetVendorWiseEventsResponseDto;

  public ngOnInit() {
    this.eventId = history.state.EventId;
    this.isApproveRejectButtonDisabled = history.state.approvedRejectButtonCondition
    this.threadId = history.state.threadid;
    this.eventName = history.state.eventName;
    this.msgSendTo = history.state.msgSendTo;

    console.log("button is", this.isApproveRejectButtonDisabled)
    // this.eventRoundupdated();
    this.initLoad()
    this.commonService.activeLink = '';
    this.cdr.detectChanges();

  }


  initLoad() {
    // let eventDetail: IRfqcsListDataDto = history.state.eventDetail;
    this.setDefaultFilter();
    this.eventService.getRFQDetailsById(this.eventId).pipe(
      switchMap((eventDetails) => {
        // Log the event details
        console.log("Event details:", eventDetails);

        // Check some condition on eventDetails
        if (eventDetails.data.eventType == '3' && (this.authData?.userRole != 'Vendor' && this.authData?.userRole !="Requester/Technical" )) {
          // If the condition is met, call the next service and combine the results
          return this.eventService.getWfUserRolesById(this.eventId).pipe(
            map(userRoles => {
              // Combine the eventDetails with the userRoles in a single object
              return {
                eventDetails: eventDetails,
                userRoles: userRoles
              };
            })
          );
        } else {
          // If the condition is not met, return the eventDetails wrapped in an observable
          return of({ eventDetails: eventDetails });
        }
      }),
      catchError(error => {
        console.error('API call failed', error);
        return of(null); // or throw an appropriate error
      })
    )
      .subscribe({
        next: (response: any) => {

          if (response?.userRoles) {
            this.eventService.WFuserRole = response?.userRoles;
            // 
            // this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), []);
            
          }
          // work for rfqdeatil by id
          
          if (response?.eventDetails) {
            let result = response?.eventDetails
            this.loading = false;
            this.rfqDetail = result.data;
            if(this.authData?.userRole!="Vendor"){
            this.wfuserrolewisepermissions()
          }
            this.eventRoundupdated();
            debugger;
            // to hide or show publish tab
            let index = this.tabList.findIndex((val) => val.tabType == 'PUBLISH');
            if (index != -1) {
              this.tabList[index].isVisible =
                this.rfqDetail.eventStatus == 'Unpublished' ? true : false;
            }

            // once data recived then set tab data
            this.updateCheckList()
            if (this.authData?.userRole == 'Buyer' || this.authData?.userRole == 'Vendor') {
              this.getPublishCheckList();
            }
            this.setTabAccordingToRole();
            if (this.rfqDetail?.eventStatus == 'Published') {
              // this.subscription.unsubscribe()
              if (this.interval) {
                clearInterval(this.interval)
              }

              this.startCountdownTimer();
            }
          }



        }, error: () => { }
      })

    // this.getRfqDetailById();
    // this.getWFUserRole();
    // this.getVendorWiseEvents();
    this.setTabAccordingToRole();
    if (this.authData?.userRole == 'Requester/Technical') {
      setTimeout(() => {
        this.getAssignnedCollabrativeUser();
      }, 250);
    }
  }
  ActiveTabCondition() {
    this.activeTab = 'SUMMARY';
    this.ngOnInit();
  }
  getAssignnedCollabrativeUser() {
    this.eventService
      .getAssignedcollaborativeuser(this.eventId, true)
      .subscribe({
        next: (
          result: IDefaultResponseDto<IGetAssignnedCollabrativeUserDataDta[]>
        ) => {
          let list: string[] = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.VENDOR_ANALYSIS,
          ];

          if (this.commonService.getAdminViewFlag()) {
            let dataForAdmin: string[] = [
              EventDashboardEnums.TECHNICAL,
              EventDashboardEnums.TERM_CONDITION,
              EventDashboardEnums.PRICE_BID,
              EventDashboardEnums.COLLABORATION,


            ]
            list = list.filter(val => val != EventDashboardEnums.VENDOR_ANALYSIS)

            switch (this.rfqDetail.eventStatus) {
              case 'Published':
                let index = this.tabList.findIndex(
                  (val) => val.tabType == EventDashboardEnums.SCHEDULE
                );
                this.tabList[index].tabName = 'Change Schedule';
                dataForAdmin.push(EventDashboardEnums.BUYER_DOCUMENTS)
                dataForAdmin.push(EventDashboardEnums.SCHEDULE)
                dataForAdmin.push(EventDashboardEnums.VIEW_CS)
                dataForAdmin.push(EventDashboardEnums.VENDORS)
                if (this.rfqDetail.eventType == '2' || this.rfqDetail.eventType == '3') {
                  dataForAdmin.push(EventDashboardEnums.VIEW_AUCTION)
                }
                break;
              case 'Unpublished':
                dataForAdmin.push(EventDashboardEnums.SCHEDULE)
                dataForAdmin.push(EventDashboardEnums.PUBLISH)
                dataForAdmin.push(EventDashboardEnums.VENDORS)

                break;
              case 'Closed':
                dataForAdmin.push(EventDashboardEnums.BUYER_DOCUMENTS)
                dataForAdmin.push(EventDashboardEnums.CS_APPROVAL)
                dataForAdmin.push(EventDashboardEnums.VENDORS)

                dataForAdmin.push(EventDashboardEnums.VIEW_CS)
                if (this.rfqDetail.eventType == '2' || this.rfqDetail.eventType == '3') {
                  dataForAdmin.push(EventDashboardEnums.VIEW_AUCTION)
                }


                break;
              case 'Terminated':
                dataForAdmin.push(EventDashboardEnums.BUYER_DOCUMENTS)
                dataForAdmin.push(EventDashboardEnums.CS_APPROVAL)
                dataForAdmin.push(EventDashboardEnums.VIEW_CS)
                if (this.rfqDetail.eventType == '2' || this.rfqDetail.eventType == '3') {
                  dataForAdmin.push(EventDashboardEnums.VIEW_AUCTION)
                }


                break;
              case 'Extended':
                dataForAdmin.push(EventDashboardEnums.BUYER_DOCUMENTS)
                dataForAdmin.push(EventDashboardEnums.VIEW_CS)
                dataForAdmin.push(EventDashboardEnums.VENDORS)
                if (this.rfqDetail.eventType == '2' || this.rfqDetail.eventType == '3') {
                  dataForAdmin.push(EventDashboardEnums.VIEW_AUCTION)
                }


                break;

              default:
                break;
            }

            list = [...list, ...dataForAdmin]

          }

          if (result.success) {
            if (result.data.length != 0) {
              this.collaboratorPermission = result.data[0];
              if (this.collaboratorPermission.iS_COMMERCIAL_ACCESS) {
                list.push(EventDashboardEnums.TERM_CONDITION);
              }
              if (this.collaboratorPermission.iS_TECHNICAL_ACCESS) {
                list.push(EventDashboardEnums.TECHNICAL);
              }
            }
          }
          this.updateCheckList()
          this.setEventDashboardTabData(list);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  setEventDashboardTabData(list: string[]) {
    this.tabList = this.tabList.map((val, index) => {
      if (list.includes(val.tabType)) {
        val.isVisible = true;
      } else {
        val.isVisible = false;
      }
      return val;
    });
  }
  opencopyeventmodel() {
    const modelRef = this.copyevent.open(CopyeventModalComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
    });
    modelRef.componentInstance.rfqDetail = this.rfqDetail;
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
  setTabAccordingToRole() {
    let role = this.authData?.userRole;
    if (this.rfqDetail?.eventType && (this.rfqDetail?.eventType != '3' || this.authData?.userRole == 'Vendor')) {
      if (role == 'Vendor') {
        let list = [
          EventDashboardEnums.SUMMARY,
          EventDashboardEnums.TECHNICAL,
          EventDashboardEnums.PRICE_BID,
          EventDashboardEnums.TERM_CONDITION,
          EventDashboardEnums.VENDOR_PDF,

        ];

        // if (this.publishCheckList?.vendorTechnical == 'Yes' && this.publishCheckList?.vendorTNC == 'Yes') {
        //   list.push(EventDashboardEnums.PRICE_BID,)
        // }


        if (
          this.rfqDetail.eventType == '2' ||
          this.rfqDetail.eventType == '3'
        ) {
          if (
            this.rfqDetail.eventStatus == 'Published' ||
            this.rfqDetail.eventStatus == 'Closed' ||
            this.rfqDetail.eventStatus == 'Extended'
          ) {
            list.push(EventDashboardEnums.GOTO_AUCTION);
          }
        }
        this.setEventDashboardTabData(list);
      } else if (role == 'Requester/Technical') {
        return
      } else if (role == 'Buyer' || role == 'Approver') {
        if (this.rfqDetail.eventStatus == 'Published') {
          // let list = [];

          let index = this.tabList.findIndex(
            (val) => val.tabType == EventDashboardEnums.SCHEDULE
          );
          this.tabList[index].tabName = 'Change Schedule';
          let list = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.SCHEDULE,
            // EventDashboardEnums.VIEW_AUCTION,
          ];

          if (this.rfqDetail.eventType == '2' || this.rfqDetail.eventType == '3') {
            list.push(EventDashboardEnums.VIEW_AUCTION)
          }

          this.setEventDashboardTabData(list);
        } else if (this.rfqDetail.eventStatus == 'Unpublished') {
          let list = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.SCHEDULE,
            EventDashboardEnums.PUBLISH,
          ];
          this.setEventDashboardTabData(list);
        } else if (this.rfqDetail.eventStatus == 'Closed') {
          let list = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
          ];

          if (this.rfqDetail.eventType == '2' || this.rfqDetail.eventType == '3') {
            list.push(EventDashboardEnums.VIEW_AUCTION)
          }


          this.setEventDashboardTabData(list);
        } else if (this.rfqDetail.eventStatus == 'Terminated') {
          let list = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
          ];

          if (this.rfqDetail.eventType == '2' || this.rfqDetail.eventType == '3') {
            list.push(EventDashboardEnums.VIEW_AUCTION)
          }

          this.setEventDashboardTabData(list);
        }
        else if (this.rfqDetail.eventStatus == 'Extended') {
          let list = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.CS_APPROVAL,

          ];


          if (this.rfqDetail.eventType == '2' || this.rfqDetail.eventType == '3') {
            list.push(EventDashboardEnums.VIEW_AUCTION)
          }
          this.setEventDashboardTabData(list);
        }
      }
    }
    else if (this.rfqDetail?.eventType && this.rfqDetail?.eventType == '3' && this.authData?.userRole != 'Vendor') {
      let raTabs: Array<any> = []
      if (this.eventService.WFuserRole.userRole == 'Auction Buyer') {
        if (this.rfqDetail.eventStatus == 'Unpublished') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.SCHEDULE,
            EventDashboardEnums.Reverse_Auction_Settings,
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Published') {
          let index = this.tabList.findIndex(
            (val) => val.tabType == EventDashboardEnums.SCHEDULE
          );
          this.tabList[index].tabName = 'Change Schedule';
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.SCHEDULE,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
            EventDashboardEnums.VIEW_AUCTION
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Closed') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Terminated') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Extended') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
      }
      else if (this.eventService.WFuserRole.userRole == 'Auction Approver') {
        if (this.rfqDetail.eventStatus == 'Unpublished') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.SCHEDULE,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Published') {
          let index = this.tabList.findIndex(
            (val) => val.tabType == EventDashboardEnums.SCHEDULE
          );
          this.tabList[index].tabName = 'Change Schedule';
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.SCHEDULE,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
            EventDashboardEnums.VIEW_AUCTION
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Closed') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Terminated') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Extended') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
      }
      else if (this.eventService.WFuserRole.userRole == 'Auction Viewer') {
        if (this.rfqDetail.eventStatus == 'Unpublished') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.SCHEDULE,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Published') {
          let index = this.tabList.findIndex(
            (val) => val.tabType == EventDashboardEnums.SCHEDULE
          );
          this.tabList[index].tabName = 'Change Schedule';
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.SCHEDULE,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
            EventDashboardEnums.VIEW_AUCTION
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Closed') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Terminated') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Extended') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
      }
      else if (this.eventService.WFuserRole.userRole == 'Auction Admin') {
        if (this.rfqDetail.eventStatus == 'Unpublished') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.SCHEDULE,
            EventDashboardEnums.PUBLISH,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Published') {
          let index = this.tabList.findIndex(
            (val) => val.tabType == EventDashboardEnums.SCHEDULE
          );
          this.tabList[index].tabName = 'Change Schedule';
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.SCHEDULE,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
            EventDashboardEnums.VIEW_AUCTION
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Closed') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Terminated') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
        else if (this.rfqDetail.eventStatus == 'Extended') {
          raTabs = [
            EventDashboardEnums.SUMMARY,
            EventDashboardEnums.TECHNICAL,
            EventDashboardEnums.TERM_CONDITION,
            EventDashboardEnums.PRICE_BID,
            EventDashboardEnums.COLLABORATION,
            EventDashboardEnums.VIEW_CS,
            EventDashboardEnums.CS_APPROVAL,
            EventDashboardEnums.BUYER_DOCUMENTS,
            EventDashboardEnums.VENDORS,
            EventDashboardEnums.VIEW_AUCTION,
            EventDashboardEnums.Reverse_Auction_Settings,
            EventDashboardEnums.Viewers_And_Administrator,
          ];
        }
      }
      this.setEventDashboardTabData(raTabs);

    }

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
      this.loadData(this.myPrData);
    }
  }
  openChatDrawer() {
    const modelRef = this.activeCanvas.open(ChatComponent, {
      position: 'end',
      ariaLabelledBy: 'offcanvas-basic-title',
    });
    modelRef.componentInstance.eventId = this.eventId;
    modelRef.componentInstance.chatThreadId = this.threadId;
    modelRef.componentInstance.chatForBuyer = false;
    modelRef.componentInstance.isModel = false;
    modelRef.componentInstance.eventName = this.eventName;
    modelRef.componentInstance.writeable = true;
    modelRef.componentInstance.msgSendTo = this.msgSendTo;

  }



  startCountdownTimer() {
    if (this.rfqDetail?.eventStatus == 'Published') {
      // this.subscription.unsubscribe()
      this.targetDate = new Date(this.rfqDetail.bidClosing);
      if (this.targetDate > new Date()) {
        this.isCountdownWorking = true;
        let endTime = moment(this.targetDate)

        this.interval = setInterval(() => {
          const remainingTime = endTime.diff(moment(), 'seconds');
          if (remainingTime == 0) {
            this.closeEvent();
            this.cdr.detectChanges();
            clearInterval(this.interval)

          }
          const duration = moment.duration(remainingTime, 'seconds');
          this.days = duration.days() ? duration.days() : 0;
          this.hours = duration.hours() ? duration.hours() : 0
          this.minutes = duration.minutes() ? duration.minutes() : 0;
          this.seconds = duration.seconds() ? duration.seconds() : 0;
          this.cdr.detectChanges()
        }, 1000)

      }
    }
  }

  getRfqDetailById() {
    this.loading = true;
    this.eventService.getRFQDetailsById(this.eventId).subscribe({
      next: (result: IRfqDataDtoById) => {
        this.loading = false;
        this.rfqDetail = result.data;
        this.eventRoundupdated();
        debugger;
        // to hide or show publish tab
        let index = this.tabList.findIndex((val) => val.tabType == 'PUBLISH');
        if (index != -1) {
          this.tabList[index].isVisible =
            this.rfqDetail.eventStatus == 'Unpublished' ? true : false;
        }

        // once data recived then set tab data
        this.updateCheckList()
        if (this.authData?.userRole == 'Buyer' || this.authData?.userRole == 'Vendor') {
          this.getPublishCheckList();
        }
        this.setTabAccordingToRole();
        if (this.rfqDetail?.eventStatus == 'Published') {
          // this.subscription.unsubscribe()
          if (this.interval) {
            clearInterval(this.interval)
          }

          this.startCountdownTimer();
        }

        this.cdr.detectChanges();
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
    this.myPrData = data;
    // this.gridView = {
    //   data: filterData,
    //   total: data.length,
    // };
    this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
  }

  getVendorWiseEvents() {
    this.vendorWiseLoading = true;
    this.eventService.GetVendorWiseEvents().subscribe({
      next: (result: any) => {
        this.vendorWiseLoading = false;
        this.vendorwisedata = result.data;

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.vendorWiseLoading = false;
      },
    });
  }

  loadDataForVendorWiseEvents(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.vendorWiseList = data;

    this.vendorgGridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
  }

  //single input modal code start from here
  openSingleInputModal() {
    debugger;
    this.commonService.clearToaster();
    const modal: NgbModalRef = this.modalService.open(
      SingleInputModalComponent,
      { centered: true }
    );
    modal.componentInstance.title = 'Update Title';
    modal.componentInstance.placeholderName = 'Enter Title';
    modal.componentInstance.value = this.rfqDetail.eventTitle;
    return modal.result.then(
      (result) => { },
      (reason) => {
        debugger;
        if (reason) {
          if (
            reason != undefined &&
            reason != '' &&
            reason != this.rfqDetail.eventTitle
          ) {
            this.updateEventTitleService(reason);
          } else {
          }
        }
      }
    );
  }

  updateEventTitleService(eventTitle: string) {
    this.vendorWiseLoading = true;
    this.eventService
      .updateEventTitle(this.rfqDetail.eventid, eventTitle)
      .subscribe({
        next: (result: any) => {
          this.commonService.showToaster('Title updated successfully.', true);
          this.rfqDetail.eventTitle = eventTitle;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.vendorWiseLoading = false;
        },
      });
  }

  handleEvent(event: any) {
    console.log(event);
  }

  changeActiveTabFunction(activeTab: any) {
    //alert(activeTab);
    this.activeTab = activeTab;
    this.cdr.detectChanges();
    ScrollTopComponent.goTop();
  }

  setTabTaskCompletedStatus(data: any) {
    const { type, status } = data;
    let index = this.tabList.findIndex((val) => val.tabType == type);
    if (index != -1) {
      this.tabList[index].isChecked = status;
    }
  }


  setTabDisableStatus(data: any) {
    const { type, status } = data;
    let index = this.tabList.findIndex((val) => val.tabType == type);
    if (index != -1) {
      this.tabList[index].isDisabled = status;
    }
  }

  // countDown code

  date: any;
  now: any;
  targetDate: any;
  targetTime: any;
  difference: number;
  months: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  isCountdownWorking: boolean = false;
  // currentTime: any = `${
  //   this.months[this.targetDate.getMonth()]
  // } ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;

  ngAfterViewInit() { }

  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  tickTock() {
    this.date = new Date();
    this.now = this.date.getTime();
    this.days = Math.floor(this.difference);
    this.hours = 23 - this.date.getHours();
    this.minutes = 60 - this.date.getMinutes();
    this.seconds = 60 - this.date.getSeconds();
  }

  showTwoDigits(number: number) {
    if (number == undefined || number == null) {
      return '';
    }
    return number.toString().length == 1 ? `0${number}` : number.toString();
  }

  editOptionCondition() {
    if (
      this.authData?.userRole == 'Buyer' &&
      this.rfqDetail.eventStatus == 'Unpublished'
    ) {
      return true;
    } else {
      return false;
    }
  }

  copyEventCondition(): boolean {
    let status: boolean = false;
    if (
      this.authData?.userRole == 'Buyer' &&
      this.rfqDetail?.eventStatus == 'Unpublished'
    ) {
      status = true;
    }

    return status;
  }

  getPublishCheckList() {
    try {
      this.eventService.getpublishChecklistApi(this.eventId).subscribe({
        next: (result: IDefaultResponseDto<PublishChecklistResponseDto>) => {
          if (result.success) {
            this.publishCheckList = result.data;
if(this.publishCheckList.isAdminSet=="Yes"){
  this.ApproveAndSubmitAuctionButtonEnabled=false;
}
if((this.publishCheckList.isRASetting=="Yes" && this.publishCheckList.scheduled=="Yes") && (this.publishCheckList.vendors=="Yes" && this.publishCheckList.priceBid=="Yes")){
  this.submitforapprovalButtonEnabled=false;
}
            if (this.authData?.userRole == 'Vendor') {

              this.setTabTaskCompletedStatus({
                type: EventDashboardEnums.TECHNICAL,
                status: this.publishCheckList.vendorTechnical == 'Yes' ? true : false,
              });


              this.setTabTaskCompletedStatus({
                type: EventDashboardEnums.TERM_CONDITION,
                status: this.publishCheckList.vendorTNC == 'Yes' ? true : false,
              });


              this.setTabTaskCompletedStatus({
                type: EventDashboardEnums.PRICE_BID,
                status: this.publishCheckList.vendorPriceBid == 'Yes' ? true : false,
              });


              // handle disable for price bid field based on terchnical and terms and condition tab


              this.setTabDisableStatus({
                type: EventDashboardEnums.PRICE_BID,
                status: this.rfqDetail.vendorStatus == 'Participated' && this.publishCheckList.vendorTechnical == 'Yes' && this.publishCheckList.vendorTNC == 'Yes' ? false : true,
              })

              this.setTabDisableStatus({
                type: EventDashboardEnums.GOTO_AUCTION,
                status: this.rfqDetail.vendorStatus == 'Participated' && this.publishCheckList.vendorPriceBid == 'Yes' ? false : true,
              })




              this.setTabAccordingToRole()
            } else {
              if (true) {
                this.setTabTaskCompletedStatus({
                  type: EventDashboardEnums.TECHNICAL,
                  status: this.publishCheckList.technical == 'Yes' ? true : false,
                });
                this.setTabTaskCompletedStatus({
                  type: EventDashboardEnums.Reverse_Auction_Settings,
                  status: this.publishCheckList.isRASetting == 'Yes' ? true : false,
                });
                this.setTabTaskCompletedStatus({
                  type: EventDashboardEnums.Viewers_And_Administrator,
                  status: this.publishCheckList.isAdminSet == 'Yes' ? true : false,
                });
                this.setTabTaskCompletedStatus({
                  type: EventDashboardEnums.TERM_CONDITION,
                  status: this.publishCheckList.tnc == 'Yes' ? true : false,
                });

                this.setTabTaskCompletedStatus({
                  type: EventDashboardEnums.PRICE_BID,
                  status: this.publishCheckList.priceBid == 'Yes' ? true : false,
                });
                this.setTabTaskCompletedStatus({
                  type: EventDashboardEnums.VENDORS,
                  status: this.publishCheckList.vendors == 'Yes' ? true : false,
                });
                this.setTabTaskCompletedStatus({
                  type: EventDashboardEnums.SCHEDULE,
                  status: this.publishCheckList.scheduled == 'Yes' ? true : false,
                });

                this.setTabTaskCompletedStatus({
                  type: EventDashboardEnums.BUYER_DOCUMENTS,
                  status: this.publishCheckList.buyerDocs == 'Yes' ? true : false,
                });
                this.setTabTaskCompletedStatus({
                  type: EventDashboardEnums.COLLABORATION,
                  status: this.publishCheckList.collaborator == 'Yes' ? true : false,
                });

              }
            }
          }

          this.cdr.detectChanges();
        },
        error: (err) => { },
      });
    } catch (error) {
      console.log('error is ', error);
    }
  }

  vendorChatButtonCondition() {
    let eventStatus = this.rfqDetail?.eventStatus;

    switch (this.authData?.userRole) {
      case 'Buyer':
        return false;
        break;
      case 'Admin':
        return false;
        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Unpublished') {
          return false;
        } else if (eventStatus == 'Closed') {
          return true;
        } else if (eventStatus == 'Deleted') {
          return true;
        } else if (eventStatus == 'Terminated') {
          return true;
        } else if (eventStatus == 'Extended') {
          return true;
        }
        return true;

        break;
      case 'Requester/Technical':
        return true;
      default:
        return false;
        break;
    }
  }

  showCountdownFlag() {
    return this.rfqDetail?.eventStatus == 'Published'
      ? this.isCountdownWorking
      : false;
  }

  nextRoundAuctionCondition() {
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (this.rfqDetail.eventStatus == 'Closed' && this.rfqDetail.notAwarded > 0) {
          return true;
        } else {
          return false;
        }
        break;
      case 'Vendor':
        return false;
        break;
      case 'Requester/Technical':
        return false;
      default:
        return false;
        break;
    }
  }


  openSingleDropdown() {



  }

  nextRoundHandler() {


    const modelRef = this.nextRoundModel.open(
      SingleDropdownComponentComponent,
      {
        centered: true,
        fullscreen: false,
        scrollable: false,
      }
    );


    modelRef.componentInstance.title = 'Select Type'
    modelRef.componentInstance.rfqDetail = this.rfqDetail
    modelRef.result.then(res => {
      if (res) {
        this.openSelectVendorModelForNextRound(res)
      }
    }, err => {

    })

    return;
  }

  openSelectVendorModelForNextRound(rfqTypeDetail: INextRoundRfqTypePayload) {
    const nextRoundModelRef = this.nextRoundModel.open(
      NextRoundComponentPopUpComponent,
      {
        centered: true,
        fullscreen: true,
        scrollable: true,
      }
    );
    nextRoundModelRef.componentInstance.rfqDetail = this.rfqDetail;
    nextRoundModelRef.componentInstance.rfqTypeDetail = rfqTypeDetail;
  }


  /**
   * The function allows for horizontal scrolling of an element based on the direction specified.
   * @param {string} type - string (represents the direction of scrolling, either 'left' or 'right')
   */
  scroll(type: string) {

    switch (type) {
      case 'left':
        this.scrollEventRef.nativeElement.scrollTo({
          left: this.scrollEventRef.nativeElement.scrollRight + 200,
          behavior: 'smooth',
        });
        break;

      case 'right':
        this.scrollEventRef.nativeElement.scrollTo({
          left: this.scrollEventRef.nativeElement.scrollLeft + 200,
          behavior: 'smooth',
        });
        break;

      default:
        break;
    }

  }

  updateMailData(event: any) {
    const { type, data } = event
    switch (type) {
      case 'subject':
        this.publishMailData.subject = data;
        break;
      case 'body':
        this.publishMailData.body = data
        break;

      default:
        break;
    }


  }
  onTabChangeHandler(item: TabDataDto) {
    if (!item.isDisabled) {
      this.activeTab = item.tabType;
      this.updateCheckList()
    }
    // this.cdr.detectChanges();
  }

  updateCheckList() {
    if (this.authData?.userRole == 'Buyer' || this.authData?.userRole == 'Vendor') {
      this.getPublishCheckList()
    }
  }


  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.autoRefreshRfqDetial.unsubscribe()
  }



  closeEvent() {
    this.eventService.closeEvent(this.rfqDetail.eventid).subscribe({
      next: (result: IDefaultResponseDto<boolean>) => {
        if (result.success) {
          this.activeTab = EventDashboardEnums.SUMMARY;
          this.isCountdownWorking = false;
          this.getRfqDetailById();
          window.location.reload();
        } else {
          this.commonService.showToaster(result.errorDetail, false)
        }
        this.cdr.detectChanges()
      },
      error: (err) => {
        this.vendorWiseLoading = false;
      },
    });
  }

  syncRfqDetail() {
    this.getRfqDetailById()
  }

  eventRoundupdated() {
    if (this.rfqDetail.eventType == '1') {
      this.eventRound = `RFQ-${this.rfqDetail.eventRound}`
    }
    else if (this.rfqDetail.eventType == '2') {
      this.eventRound = `FwAuc-${this.rfqDetail.eventRound}`
    }
    else if (this.rfqDetail.eventType == '3') {
      this.eventRound = `ReAuc-${this.rfqDetail.eventRound}`
    }
  }




  @HostListener('document:click', ['$event'])
  documentClick(event: Event) {
    if (this.authData?.userRole == 'Vendor' && this.rfqDetail.eventStatus == 'Published' && this.activatedRoute.snapshot.url.join('/').includes('EventDashboard')) {
      this.autoRefreshRfqDetial.next('');
    }
  }

  SubmitForApproval() {

    const modal: NgbModalRef = this.modalService.open(
      SingleInputModalComponent,
      { centered: true }
    );
    modal.componentInstance.title = 'Reason';
    modal.componentInstance.placeholderName = 'Please Enter Remarks';
    modal.componentInstance.value = '';
    return modal.result.then(
      (result) => { },
      (reason) => {
        if (reason) {
          this.submitReverseAuction(reason);
        }
      }
    );

  }
  ApproveAndSubmitAuctionCondition() {
    if (this.isApproveRejectButtonDisabled) {
      return true

    }
    else {
      return false
    }
  }

  ApproveAndSubmitAuction() {
    this.commonService.showAlertForWarning('Are You Sure', 'You want to approve').then((res) => {
      if (res) {
        this.CallApproveApi()
      }
    });


  }

  CallApproveApi() {

    this.approveService.ApproveReverseAuction(this.rfqDetail.eventid)
      .subscribe({
        next: (result: any) => {
          this.commonService.showToaster('Approved successfully.', true);
          this.router.navigate(['/CSApproval/PendingRA']);
        },
        error: (err) => {

        },
      });
  }

  submitReverseAuction(remark: any) {
    this.reverseAuctionSubmitLoading = true;
    this.eventService
      .submitReverseAuctionApi(this.rfqDetail.eventid, remark)
      .subscribe({
        next: (result: any) => {
          this.commonService.showToaster('submit successfull.', true);
          this.router.navigate(['/Event/ReverseAuction']);
          this.reverseAuctionSubmitLoading = false;
        },
        error: (err) => {
          this.reverseAuctionSubmitLoading = false;
        },
      });
  }
  SubmitforApprovalCondition() {
    if (this.authData?.userRole != 'Vendor') {
      if (this.rfqDetail.eventType == '3') {
        if (this.eventService.WFuserRole.userRole == 'Auction Buyer') {
          if (this.rfqDetail.eventStatus == 'Unpublished') {
            return true;
          }
          else {
            return false
          }
        }
        else {
          return false
        }
      }
      else {
        return false
      }
    }
  }


  wfuserrolewisepermissions(){
    console.log("rfqdetail",this.rfqDetail)
    if(this.rfqDetail.eventType=="3"){
    switch (this.eventService.WFuserRole.userRole) {
      case 'Auction Buyer':
        if(this.rfqDetail?.eventStatus=='Unpublished'){
          this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_unpublished_Auction_buyer[this.commonService.getCurrentRouteName()]);
        }
        else if(this.rfqDetail?.eventStatus=='Closed'){
          this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_closed_Auction_buyer[this.commonService.getCurrentRouteName()]);
        }
        else if(this.rfqDetail?.eventStatus=='Extended'){
this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_extended_Auction_buyer[this.commonService.getCurrentRouteName()]);
        }
        else if(this.rfqDetail?.eventStatus=='Terminated'){
          this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_terminated_Auction_buyer[this.commonService.getCurrentRouteName()]);
        }
        break;
        case 'Auction Approver':
          if(this.rfqDetail?.eventStatus=='Unpublished'){
            this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_unpublished_Auction_Approver[this.commonService.getCurrentRouteName()]);
          }
        break;
        case 'Auction Viewer':
          if(this.rfqDetail?.eventStatus=='Unpublished'){
            this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_unpublished_Auction_Viewer[this.commonService.getCurrentRouteName()]);
          }
          else if(this.rfqDetail?.eventStatus=='Published'){
            this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_published_Auction_Viewer[this.commonService.getCurrentRouteName()]);
          }
          else if(this.rfqDetail?.eventStatus=='Closed'){
            this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_closed_Auction_Viewer[this.commonService.getCurrentRouteName()]);
          }
          else if(this.rfqDetail?.eventStatus=='Extended'){
            this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_extended_Auction_Viewer[this.commonService.getCurrentRouteName()]);
          }
          else if(this.rfqDetail?.eventStatus=='Terminated'){
            this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_terminated_Auction_Viewer[this.commonService.getCurrentRouteName()]);
          }
        break;
        case 'Auction Admin':
          if(this.rfqDetail?.eventStatus=='Unpublished'){
            this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_unpublished_Auction_Adminstrator[this.commonService.getCurrentRouteName()]);
          }
          else if(this.rfqDetail?.eventStatus=='Published'){
            this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_published_Auction_Adminstrator[this.commonService.getCurrentRouteName()]);
          }
          else if(this.rfqDetail?.eventStatus=='Closed'){
            this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_closed_Auction_Administrator[this.commonService.getCurrentRouteName()]);
          }
          else if(this.rfqDetail?.eventStatus=='Extended'){
            this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_extended_Auction_Administrator[this.commonService.getCurrentRouteName()]);
          }
          else if(this.rfqDetail?.eventStatus=='Terminated'){
            this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionList_terminated_Auction_Administrator[this.commonService.getCurrentRouteName()]);
          }
        break;
    
      default:
        break;
    }
  }
  else{
    this.permissionService.updateEventDashBoardPermission(this.commonService.getCurrentRouteName(), this.permissionService.permissionListforRFQ[this.commonService.getCurrentRouteName()]);
  }
  }

  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }
}
