import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { BehaviorSubject, map } from 'rxjs';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { PrGridDataDto } from 'src/app/modules/purchase-requisition/pr-grid-view';
import { PrHistoryDetailComponent } from 'src/app/modules/purchase-requisition/pr-history-detail/pr-history-detail.component';
import { PrModalViewComponent } from 'src/app/modules/purchase-requisition/pr-modal-view/pr-modal-view.component';
import { PrResponseDto } from 'src/app/modules/purchase-requisition/purchase-requisition';
import { PurchaseRequistionServiceService } from 'src/app/modules/purchase-requisition/purchase-requistion-service.service';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  IBuyer,
  IDefaultResponseDto,
  IGetAllTechnicalAttachMentResponseDto,
  IRfqDetailDataDto,
  ISaveTechnicalAttachMentResponseDto,
  ITechnicalAttachmentResponseDto,
  ITechnicalParamterItemDto,
  IVendor,
} from '../../event.interface';
import { EventService } from '../../event.service';
import { TechnicalParameterActionPopupComponent } from './technical-parameter-action-popup/technical-parameter-action-popup.component';
import {
  ExcelExportData,
  Workbook,
} from '@progress/kendo-angular-excel-export';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';
import { TechnicalUploadDocumentComponent } from './technical-upload-document/technical-upload-document.component';
import { TechnicalParameterVendorActionComponentComponent } from './technical-parameter-vendor-action-component/technical-parameter-vendor-action-component.component';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-technical',
  templateUrl: './technical.component.html',
  styleUrls: ['./technical.component.scss'],
})
export class TechnicalComponent {
  @Input() rfqDetail: IRfqDetailDataDto;
  // @Output() setTabCompletedStatus$ = new EventEmitter<{
  //   type: string;
  //   status: boolean;
  // }>();

  @Output() updateCheckList$ = new EventEmitter();
  isDownloadButtonVisible = false;
  public gridView: GridDataResult;
  public parameterGridView: GridDataResult;
  public toasterList$ = new BehaviorSubject([]);
  public currentToasterList$ = this.toasterList$.asObservable();
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;

  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  technicalParameterLineloading: boolean = false;
  downloadAllAttachmentloading: boolean = false;
  myPrData: PrResponseDto[];

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
  technicalAttachmentResponse: IGetAllTechnicalAttachMentResponseDto;
  technicalAttachmentTab: string[] = ['General Document'];
  currentTabSelected: string = this.technicalAttachmentTab[0];
  selectedTechnicalAttachementItem: IVendor | IBuyer;
  technicalAttachementList: IVendor[] = [];
  technicalParameterLineList: ITechnicalParamterItemDto[] = [];
  createRfqLoading: boolean = false;
  toasts: any = [];
  newColumns: any = [];
  serachText: string = '';
  deleteTechnicalAttachmentLoader: boolean = false;
  downloadTechnicalAttachmentLoader: boolean = false;
  saveTechnicalRemarksLoader: boolean = false;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;

  public technicalParameterLineSort: SortDescriptor[] = [];
  public technicalParameterLineFilter: FilterDescriptor;
  authData: AuthModel | null | undefined;
  currentSelectedVendor: number | null | undefined

  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  public technicalParameterLineState: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  @Input() eventId: number;

  constructor(
    private commonService: CommonService,
    private prDetailModel: NgbModal,
    private prLineViewModel: NgbModal,
    private prHistoryModel: NgbModal,
    private auctionDrawer: NgbOffcanvas,
    private prservice: PurchaseRequistionServiceService,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private offcanvasService: NgbOffcanvas,
    private datePipe: DatePipe,
    private router: Router,
    private uploadDocumentModel: NgbModal
  ) {
    this.allData = this.allData.bind(this);
  }

  public ngOnInit() {
    this.setDefaultFilter();
    this.getAllTechnicalAttachment();
    this.getAllTechnicalParameterLinesByEventId();
    this.authData = this.commonService.getAuthData();
  }

  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.selectedTechnicalAttachementItem);
    }
  }

  public StatechangeofItemtechnicalParameter(state: any) {
    if (!this.technicalParameterLineloading) {
      this.technicalParameterLineSort= state.sort;
      this.technicalParameterLineFilter = state.filter;
      this.technicalParameterLineState = state;
      this.technicalParameterLoadData(this.technicalParameterLineList);
    }
  }

  openTechnicalParameterActionPopUp(item: ITechnicalParamterItemDto) {
    const modelRef = this.prLineViewModel.open(
      this.authData?.userRole == 'Vendor'
        ? TechnicalParameterVendorActionComponentComponent
        : TechnicalParameterActionPopupComponent,
      // ,
      {
        centered: true,
        fullscreen: true,
        scrollable: true,
      }
    );

    modelRef.componentInstance.eventId = this.eventId;
    modelRef.componentInstance.eventTranId = item.eventTranId;
    modelRef.componentInstance.itemId = item.itemId;
    modelRef.componentInstance.rfqDetail = this.rfqDetail;


    modelRef.result.then((success) => {
      this.updateCheckList()
    }, (reject) => {

    })

  }

  public allData(): ExcelExportData {
    let stateData = this.state;
    stateData.take = this.myPrData.length;
    let data;
    if (this.serachText != '') {
      let filterData = this.getFilteredData(this.serachText);
      data = process(filterData, stateData).data;
    } else {
      data = process(this.myPrData, stateData).data;
    }
    data = data.map((val, index) => {
      val.sno = index + 1;
      val.enterdate = this.datePipe.transform(Date.now(), 'dd-MMM-yyyy  H:mm');
      val.approvedDate = this.datePipe.transform(
        Date.now(),
        'dd-MMM-yyyy  H:mm'
      );
      return val;
    });
    const result: ExcelExportData = {
      data: data,
    };

    return result;
  }

  loadData(item: any) {
    this.selectedTechnicalAttachementItem = item;
    let data: any = this.selectedTechnicalAttachementItem.attachments;
    this.isDownloadButtonVisible =
      this.selectedTechnicalAttachementItem.attachments.length != 0
        ? true
        : false;
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
    else {
      this.gridView = process(filterData, this.state);
    }
    this.cdr.detectChanges();
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

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.selectedTechnicalAttachementItem.attachments, {
        filters: [
          {
            filters: [
              {
                field: 'documentName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'remarks',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'userRole',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'siteName',
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
      return filterBy(
        this.selectedTechnicalAttachementItem.attachments,
        this.filter
      );
    }
  }

  closeFilter() {
    if (this.customFilter.dateRangeSelected?.rangeType == 'LAST_30_Days') {
      //show alert here
    } else {
      this.setDefaultFilter();
    }
  }

  setDefaultFilter() {
    let dateRange = this.commonService.getDefaultDateRange();
    this.customFilter = {
      dateRangeSelected: dateRange,
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

  getAllTechnicalAttachment() {
    this.loading = true;
    this.eventService.getAllTechnicalAttachmentApi(this.eventId).subscribe({
      next: (
        result: IDefaultResponseDto<IGetAllTechnicalAttachMentResponseDto>
      ) => {
        this.loading = false;
        // setting initial state
        this.isDownloadButtonVisible = false;
        this.technicalAttachmentTab = ['General Document'];
        this.technicalAttachmentResponse = result.data;
        result.data.vendor.forEach((val: IVendor) => {
          this.technicalAttachmentTab.push(val.vendorName);
          this.technicalAttachementList.push(val);
        });

        // this.setTabCompleteStatus(
        //   result?.data.buyer.attachments.length != 0 ? true : false
        // );

        if (this.authData?.userRole == 'Vendor') {
          this.currentTabSelected = result?.data.vendor[0].vendorName
          this.loadData(result?.data.vendor[0]);
        } else {
          this.loadData(result?.data.buyer);
        }
        this.updateCheckList();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }


  setCurrentSelectedTab(type: string) {
    this.currentTabSelected = type;
    // technicalAttachementList
    if (type == 'General Document') {
      this.currentSelectedVendor = null
      this.loadData(this.technicalAttachmentResponse.buyer);
    } else {
      let item = this.technicalAttachementList.find(
        (val: IVendor) => val.vendorName == this.currentTabSelected
      );
      if (item) {
        this.currentSelectedVendor = item.vendorId
        this.loadData(item);
      }
    }
  }

  getAllTechnicalParameterLinesByEventId() {
    this.technicalParameterLineloading = true;

    this.eventService
      .getAllTechnicalParameterLinesByEventId(this.eventId)
      .pipe(
        map((items: any) =>
          items.data.map((o: any) => {
            o.isEditedMode = false;
            o.old_remarks = o.tech_Remark ? o.tech_Remark : '';
            return o;
          })
        )
      )
      .subscribe({
        next: (result: any) => {
          // console.log('result parameter ', result);
          this.technicalParameterLineloading = false;
          this.technicalParameterLineList = result;
          this.technicalParameterLoadData(result);
        },
        error: (err) => {
          console.log('error is', err);
          this.technicalParameterLineloading = false;
        },
      });
  }

  technicalParameterLoadData(data: any) {
    this.technicalParameterLineList = data;
    let sortedData = orderBy(data, this.technicalParameterLineSort);
    let filterData = filterBy(sortedData, this.technicalParameterLineFilter);
    this.parameterGridView = process(filterData, this.technicalParameterLineState);
  }

  uploadNewDocumentModel() {
    const modelRef = this.uploadDocumentModel.open(
      TechnicalUploadDocumentComponent,
      {
        centered: true,
        fullscreen: false,
        scrollable: true,
      }
    );

    modelRef.componentInstance.eventId = this.eventId;
    modelRef.result.then(
      (result) => {
        if (result.success) {
          this.commonService.showToaster('file uploaded successfully', true);
          this.updateCheckList()
          this.getAllTechnicalAttachment();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
        }
      },
      (err) => { }
    );
  }

  downloadAllTechnicalAttachment(item: any) {
    if (!this.downloadAllAttachmentloading) {
      this.downloadAllAttachmentloading = true;
      let vendorId = null;
      if (this.currentTabSelected != 'General Document') {
        vendorId = this.currentSelectedVendor
      }
      this.eventService
        .downloadAllTechnicalAttachmentApi(this.eventId, vendorId)
        .subscribe({
          next: (result: IDefaultResponseDto<any>) => {
            if (result.success) {
              this.downloadAttachment(result.data);
            } else {
              this.commonService.showToaster(result.errorDetail, false);
            }
            this.downloadAllAttachmentloading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.downloadAllAttachmentloading = false;
            this.cdr.detectChanges();
          },
        });
    }
  }

  downloadAttachmentApi(attachmentid: number) {
    if (!this.downloadTechnicalAttachmentLoader) {
      this.downloadTechnicalAttachmentLoader = true;
      this.eventService
        .downlaodTechnicalAttachementApi(this.eventId, attachmentid)
        .subscribe({
          next: (result: IDefaultResponseDto<any>) => {
            this.downloadTechnicalAttachmentLoader = false;
          },
          error: (err) => {
            this.downloadTechnicalAttachmentLoader = false;
            console.log('error is', err);
            // this.downloadAllAttachmentloading = false;
            this.cdr.detectChanges();
          },
        });
    }
  }

  deleteHandlerConfirm(attachmentid: number) {
    // deleteAttachment
    this.commonService
      .showAlertForWarning('Are you sure', `You want to delete`)
      .then((result) => {
        if (result) {
          this.deleteAttachmentApi(attachmentid);
        }
      });
  }

  deleteAttachmentApi(attachmentid: number) {
    if (!this.deleteTechnicalAttachmentLoader) {
      this.deleteTechnicalAttachmentLoader = true;
      this.eventService
        .deleteTechnicalAttachmentApi(this.eventId, attachmentid)
        .subscribe({
          next: (result: any) => {
            if (result.success || result.Success) {
              this.commonService.showToaster(
                'Technical attachment deleted successfully',
                true
              );
              this.getAllTechnicalAttachment();
            } else {
              this.commonService.showToaster(result.errorDetail, false);
            }
            this.deleteTechnicalAttachmentLoader = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.log('error is', err);
            this.deleteTechnicalAttachmentLoader = false;
            this.cdr.detectChanges();
          },
        });
    }
  }

  downloadAttachment(url: string) {
    this.commonService.downloadFile(url);
  }

  parameterCancelButton(index: number, type: string) {
    switch (type) {
      case 'Edit':
        this.technicalParameterLineList[index].isEditedMode = true;
        this.technicalParameterLoadData(this.technicalParameterLineList);
        break;
      case 'Save':
        let remark = this.technicalParameterLineList[index]
          .tech_Remark as string;
        if (remark?.length > 500) {
          this.commonService.showToaster(
            'Remarks cannot exceed more than 500 characters.',
            false
          );
        } else {
          this.technicalParameterLineList[index].isEditedMode = false;
          this.technicalParameterLoadData(this.technicalParameterLineList);
          if (
            this.technicalParameterLineList[index].tech_Remark != null &&
            this.technicalParameterLineList[index].tech_Remark !=
            this.technicalParameterLineList[index].old_remarks
          ) {
            this.saveTechnicalRemarksApi(
              this.technicalParameterLineList[index]
            );
          }
        }

        break;
      case 'Cancel':
        this.technicalParameterLineList[index].isEditedMode = false;
        this.technicalParameterLineList[index].tech_Remark =
          this.technicalParameterLineList[index].old_remarks;
        this.technicalParameterLoadData(this.technicalParameterLineList);
        break;

      default:
        break;
    }
  }

  saveTechnicalRemarksApi(technicalParameterItem: ITechnicalParamterItemDto) {
    if (!this.saveTechnicalRemarksLoader) {
      this.saveTechnicalRemarksLoader = true;
      this.eventService
        .saveTechnicalRemarksApi(
          this.eventId,
          technicalParameterItem.eventTranId,
          technicalParameterItem.tech_Remark as string
        )
        .subscribe({
          next: (result: IDefaultResponseDto<any>) => {


            if (result.success) {
              this.saveTechnicalRemarksLoader = false;
              technicalParameterItem.old_remarks =
                technicalParameterItem.tech_Remark;
              if (result.success) {
                this.commonService.showToaster(
                  'Technical remarks updated successfully',
                  true
                );
              }
            } else {
              this.saveTechnicalRemarksLoader = false;
              this.commonService.showToaster(result.errorDetail, false)
            }

            this.updateCheckList()
          },
          error: (err) => {
            this.saveTechnicalRemarksLoader = false;
            console.log('error is', err);
            // this.downloadAllAttachmentloading = false;
            this.cdr.detectChanges();
          },
        });
    }
  }

  uploadButtonCondition(): boolean {
    let eventStatus = this.rfqDetail.eventStatus;

    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          if (this.currentTabSelected == 'General Document') {
            return true;
          } else {
            return false;
          }
        }

        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          if (this.currentTabSelected != 'General Document') {
            return this.rfqDetail.vendorStatus == 'Participated' ? true : false;
          } else {
            return false;
          }
        } else if (eventStatus == 'Unpublished') {
          return false;
        } else if (eventStatus == 'Closed') {
          return false;
        } else if (eventStatus == 'Terminated') {
          return false;
        }
        break;
      case 'Requester/Technical':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return false;
        }
        break;

      default:
        return false;
        break;
    }

    return false;

    // if (this.authData?.userRole == 'Buyer') {
    //   if (this.currentTabSelected == 'General Document') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // } else {
    //   return false;
    // }
  }

  // setTabCompleteStatus(status: boolean) {
  //   this.setTabCompletedStatus$.emit({
  //     type: 'TECHNICAL',
  //     status: status,
  //   });
  // }

  showRemarkCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return true;
        }

        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return false;
        }
        break;
      case 'Requester/Technical':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return false;
        }
        break;

      default:
        return false;
        break;
    }
  }

checkActionButton(){
  switch (this.authData?.userRole) {
    case 'Buyer':
return true;
    break;
    case 'Vendor':
      return false;
    break;
    case 'Requester/Technical':
      return true;
    break;
    default:
      return false;
      break;
  }
}

  editButtonCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return true;
        }

        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return false;
        }
        break;
      case 'Requester/Technical':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return false;
        }
        break;

      default:
        return false;
        break;
    }
  }

  addColumnCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Unpublished') {
          return true;
        }
        else if (eventStatus == 'Closed') {
          return true;
        }
        else if (eventStatus == 'Extended') {
          return true;
        }

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
        break;
      case 'Requester/Technical':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Unpublished') {
          return true;
        }

        return true;
        break;

      default:
        return false;
        break;
    }
  }


  updateCheckList() {
    this.updateCheckList$.emit();
  }
  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }
}
