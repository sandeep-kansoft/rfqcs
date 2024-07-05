import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {
  IDefaultResponseDto,
  IRfqDetailDataDto,
  ITechnicalTermForVendor,
  TechnicalParametersItems,
} from '../../../event.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../technical-parameter-action-popup/data';
import {
  FilterDescriptor,
  SortDescriptor,
  State,
  filterBy,
  orderBy,
  process,
} from '@progress/kendo-data-query';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import * as XLSX from 'xlsx';
import { SingleInputModalComponent } from '../../single-input-modal/single-input-modal.component';
import { TechnicalSelectTemplateComponent } from '../technical-select-template/technical-select-template.component';
import {
  AddEvent,
  CancelEvent,
  EditEvent,
  GridComponent,
  GridDataResult,
  RemoveEvent,
  SaveEvent,
} from '@progress/kendo-angular-grid';
import { EventService } from '../../../event.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-technical-parameter-vendor-action-component',
  templateUrl: './technical-parameter-vendor-action-component.component.html',
  styleUrls: ['./technical-parameter-vendor-action-component.component.scss'],
})
export class TechnicalParameterVendorActionComponentComponent {
  @Input() rfqDetail: IRfqDetailDataDto;
  public view: unknown[];
  public formGroup: FormGroup | undefined;
  @Input() eventId: number;
  @Input() eventTranId: number;
  @Input() itemId: number;

  public gridView: GridDataResult;
  authData: AuthModel | null | undefined;
  inValidate: boolean = false;

  public gridState: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  technicalParameterItemList: ITechnicalTermForVendor[] = [];
  // @Input() itemCode: string;
  // @Input() itemName: string;
  isLoading: boolean = false;
  templateSaveLoader: boolean = false;

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;

  listItems = ['Mandatory', 'Non-Mandatory'];

  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  deletedList: any = [];

  //   private editedProduct: Product;

  constructor(
    private activeModel: NgbActiveModal,
    private templateModel: NgbModal,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private commonService: CommonService
  ) { }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.technicalParameterItemList = data;
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
  }
  public ngOnInit(): void {
    // this.loadData(this.technicalPrameterItemList);
    this.getTechnicalParameterTermsFromVendorSide();
  }
  public onStateChange(state: any): void {
    this.sort = state.sort;
    this.filter = state.filter;
    this.state = state;
    this.loadData(this.technicalParameterItemList);
  }
  closeModel() {
    this.activeModel.dismiss();
  }

  getTechnicalParameterTermsFromVendorSide() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.eventService
        .getTechnicalParameterTermsFromVendorSide(this.eventTranId)

        .subscribe({
          next: (result: IDefaultResponseDto<ITechnicalTermForVendor[]>) => {
            // TechnicalParametersItems
            this.isLoading = false;

            let ls = result.data.map((val) => {
              val.old_remark = val?.vendor_Remark;
              val.isNew = val?.v_ParameterID == 0 ? true : false;
              val.vendorInitialRemark = val?.vendor_Remark;
              return val;
            });

            if (ls.length != 0) {
              // this.itemCode = ls[0].itemCode;
              // this.itemName = ls[0].itemName;
              this.loadData(ls);
            }
          },
          error: (err: any) => {
            console.log('error is', err);
            // this.downloadAllAttachmentloading = false;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
    }
  }

  saveTechnicalParameterTermsFromVendorSide(payload: any) {
    return this.eventService
      .saveTechnicalParameterTermsFromVendorSide(payload)

  }

  updateTechnicalParameterTermsFromVendorSide(payload: any) {
    return this.eventService
      .updateTechnicalParameterTermsFromVendorSide(payload)

  }
 async saveConditionCheck(){
    let isValid =await this.commonService.eventPublishedChecker(this.eventId) 
    if(isValid){
      this.saveParameterHandler();
    }
    else{
      this.commonService.showToaster('Event Already Closed',false);
      this.activeModel.dismiss();
    }
    
  }

  saveParameterHandler() {
    this.inValidate = true;
    let isValid = this.validateData();
    if (isValid) {
      let ds = this.technicalParameterItemList.filter((val) => val.isEdited);
      // list of obserable of
      let obserableList = [] as Observable<any>[];
      let createPayloadList: any = [];
      ds.filter((val) => val.isNew).forEach((val) => {
        let obj = {
          parameterId: val.parameterid,
          vendor_Remark: val.vendor_Remark,
        };
        createPayloadList.push(obj);
      });

      ds.filter((val) => !val.isNew).forEach((val: any) => {
        let obj = {
          v_ParameterID: val.v_ParameterID,
          eventId: this.eventId,
          eventTransId: this.eventTranId,
          vendor_Remark: val.vendor_Remark,
        };
        obserableList.push(this.updateTechnicalParameterTermsFromVendorSide(obj));
      });

      if (createPayloadList.length != 0) {
        let payload = {
          eventId: this.eventId,
          eventTransId: this.eventTranId,
          vendor: createPayloadList,
        };
        obserableList.push(this.saveTechnicalParameterTermsFromVendorSide(payload));
      }

      if (obserableList.length != 0) {

        forkJoin(obserableList).subscribe({
          next: (result) => {
            this.commonService.showToaster("Changes updated", true)
            this.activeModel.close();

          }, error: (err) => {
            this.commonService.showToaster("Something went wrong", false)
            this.activeModel.close();
            console.log("result is", err)

          }
        })
      }


    } else {
      this.inValidate = true
      this.commonService.showToaster(
        'Please fill out all the mandatory fields.',
        false
      );
      // this.activeModel.close();
    }
  }

  validateData(): boolean {
    let result = this.technicalParameterItemList.filter(
      (val) => val.isrequired
    );

    let isValid = result.every(
      (val) =>
        val.vendor_Remark != '' &&
        val.vendor_Remark != null &&
        val.vendor_Remark != undefined
    );
    return isValid;
  }

  remarkActionHandler(index: number, type: string) {
    switch (type) {
      case 'Save':
        this.technicalParameterItemList[index].isEditMode = false;
        this.technicalParameterItemList[index].isEdited = true;
        this.technicalParameterItemList[index].old_remark =
          this.technicalParameterItemList[index].vendor_Remark;
        this.loadData(this.technicalParameterItemList);
        break;
      case 'Cancel':
        this.technicalParameterItemList[index].isEditMode = false;
        this.technicalParameterItemList[index].vendor_Remark =
          this.technicalParameterItemList[index].old_remark;
        this.loadData(this.technicalParameterItemList);
        break;
      case 'Edit':
        this.technicalParameterItemList[index].isEditMode = true;
        this.loadData(this.technicalParameterItemList);
        break;

      default:
        break;
    }
  }

  editButtonCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    return eventStatus == 'Published' &&
      this.rfqDetail.vendorStatus == 'Participated'
      ? true
      : false;
  }

  submitConditionHandler() {
    let eventStatus = this.rfqDetail.eventStatus;
    return eventStatus == 'Published' &&
      this.rfqDetail.vendorStatus == 'Participated'
      ? true
      : false;
  }
}
