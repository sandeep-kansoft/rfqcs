import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuyerDocumentUploadComponent } from './buyer-document-upload/buyer-document-upload.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { IDefaultResponseDto, IGetAllBuyerAttachmentResponseDto, IGetAllTechnicalAttachMentResponseDto, IRfqDetailDataDto } from '../../event.interface';
import { EventService } from '../../event.service';
import { FilterDescriptor, SortDescriptor, State, filterBy, orderBy, process } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-buyer-documents',
  templateUrl: './buyer-documents.component.html',
  styleUrls: ['./buyer-documents.component.scss']
})
export class BuyerDocumentsComponent {
  @Input() rfqDetail: IRfqDetailDataDto;
  downloadAllBuyerAttachmentLoading: boolean = false;
  deleteBuyerAttachmentLoader: boolean = false;
  headerStyle = 'fw-bold';
  public gridView: GridDataResult;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  buyerDocuments: any
  loading: boolean = false;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  constructor(
    private uploadDocumentModel: NgbModal,
    private commonService: CommonService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,) { }



  public ngOnInit() {
    this.getAllBuyerAttachment();
  }
  downloadAllBuyerAttachment() {
    if (!this.downloadAllBuyerAttachmentLoading) {
      this.downloadAllBuyerAttachmentLoading = true;
      this.eventService
        .downloadAllBuyerAttachmentApi(this.rfqDetail.eventid)
        .subscribe({
          next: (result: IDefaultResponseDto<any>) => {
            if (result.success) {
              this.downloadAttachment(result.data);
            } else {
              this.commonService.showToaster(result.errorDetail, false);
            }
            this.downloadAllBuyerAttachmentLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.downloadAllBuyerAttachmentLoading = false;
            this.cdr.detectChanges();
          },
        });
    }
  }
  uploadNewBuyerDocument() {
    const modelRef = this.uploadDocumentModel.open(
      BuyerDocumentUploadComponent,
      {
        centered: true,
        fullscreen: false,
        scrollable: true,
      }
    );

    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.result.then(
      (result) => {
        if (result.success) {
          this.commonService.showToaster('file uploaded successfully', true);
          this.getAllBuyerAttachment();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
        }
      },
      (err) => { }
    );
  }
  downloadAttachment(url: string) {
    this.commonService.downloadFile(url);
  }
  deleteHandlerConfirm(attachmentid: number) {
    // deleteAttachment
    this.commonService
      .showAlertForWarning('Are you sure', `You want to delete`)
      .then((result) => {
        if (result) {
          this.deleteBuyerAttachmentApi(attachmentid);
        }
      });
  }
  deleteBuyerAttachmentApi(attachmentid: number) {
    if (!this.deleteBuyerAttachmentLoader) {
      this.deleteBuyerAttachmentLoader = true;
      this.eventService
        .deleteBuyerAttachmentApi(this.rfqDetail.eventid, attachmentid)
        .subscribe({
          next: (result: any) => {
            if (result.success || result.Success) {
              this.commonService.showToaster(
                'Technical attachment deleted successfully',
                true
              );
              this.getAllBuyerAttachment();
            } else {
              this.commonService.showToaster(result.errorDetail, false);
            }
            this.deleteBuyerAttachmentLoader = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.log('error is', err);
            this.deleteBuyerAttachmentLoader = false;
            this.cdr.detectChanges();
          },
        });
    }
  }
  getAllBuyerAttachment() {
    this.loading = true;
    this.eventService.getAllBuyerAttachment(this.rfqDetail.eventid).subscribe({
      next: (
        result: IDefaultResponseDto<IGetAllBuyerAttachmentResponseDto[]>
      ) => {
        this.loading = false;
        this.loadData(result.data)

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.buyerDocuments);
    }
  }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.buyerDocuments = data;
    // this.gridView = {
    //   data: filterData,
    //   total: data.length,
    // };
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
  }

  uploadButtonConition() {
    let eventStatus = this.rfqDetail.eventStatus;
    let userData = this.eventService.authData
    switch (userData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Extended') {
          return false;
        }
        else if (eventStatus == 'Closed') {
          return false;
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
  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }
}
