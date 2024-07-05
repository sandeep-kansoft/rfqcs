import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../../event.service';
import {
  IRfqDetailDataDto,
  ISubItemsDataDto,
  ISubItemsForVendorsDataDto,
} from 'src/app/modules/event/event.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormGroup } from '@angular/forms';
import {
  AddEvent,
  CancelEvent,
  EditEvent,
  GridComponent,
  GridDataResult,
  RemoveEvent,
  SaveEvent,
} from '@progress/kendo-angular-grid';
import { FormControl, Validators } from '@angular/forms';
import {
  FilterDescriptor,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { filterBy, orderBy, process } from '@progress/kendo-data-query';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';

@Component({
  selector: 'app-vendor-add-sub-items',
  templateUrl: './vendor-add-sub-items.component.html',
  styleUrls: ['./vendor-add-sub-items.component.scss'],
})
export class VendorAddSubItemsComponent {
  isLoading: boolean = false;
  @Input() eventTranId: number;
  @Input() rfqDetail: IRfqDetailDataDto;
  subItemsList: ISubItemsForVendorsDataDto[] = [];
  private editedRowIndex: number | undefined;
  public formGroup: FormGroup | undefined;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  public gridView: GridDataResult;
  authData: AuthModel | null | undefined;
  validatordata: boolean = true;
  saveLoader: boolean = false;
  // public state: State = {
  //   filter: undefined,
  //   skip: 0,
  //   take: 10,
  // };
  public gridState: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  constructor(
    private activeModel: NgbActiveModal,
    private eventService: EventService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {
    this.authData = this.commonService.getAuthData();
  }

  public ngOnInit(): void {
    this.getAllSubItemsForVendorsServiceCall(this.eventTranId);
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    // close the editor
    grid.closeRow(rowIndex);
    // reset the helpers
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  closeModel() {
    this.activeModel.dismiss();
  }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.gridView = process(filterData, this.gridState);
    this.cdr.detectChanges();
  }

  public saveHandler({
    sender,
    rowIndex,
    formGroup,
    isNew,
    dataItem,
  }: SaveEvent): void {

    if (!this.commonService.twoDecimalRegex.test(dataItem.rate)) {
      this.commonService.showToaster("Rate cannot exceed more than two decimal values.", false)
      return
    }

    const subItem: ISubItemsDataDto = dataItem;
    if (isNew) {
      let obj = subItem;
      obj.subId = 0;
    } else {
    }
    sender.closeRow(rowIndex);
  }
  public editHandler(args: EditEvent): void {
    // define all editable fields validators and default values
    console.log("edit button is clicked")
    const { dataItem } = args;
    this.closeEditor(args.sender);
    this.formGroup = new FormGroup({
      // itemCode: new FormControl(dataItem.itemCode),
      // itemName: new FormControl(dataItem.itemName),
      // uom: new FormControl(dataItem.uom),
      // quantity: new FormControl(dataItem.quantity),
      rate: new FormControl(dataItem.rate),
      remarks: new FormControl(dataItem.vendorRemark),
    });

    this.editedRowIndex = args.rowIndex;
    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  public addHandler(args: AddEvent): void {
    console.log("add button is clicked")
    this.closeEditor(args.sender);
    this.formGroup = new FormGroup({
      itemCode: new FormControl('', [Validators.required]),
      itemName: new FormControl('', [Validators.required]),
      uom: new FormControl('', [Validators.required]),
      quantity: new FormControl(0, [Validators.required]),
      rate: new FormControl(0, [Validators.required]),
      remarks: new FormControl('', [Validators.required]),
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }
  public onStateChange(state: any): void {
    this.sort = state.sort;
    this.filter = state.filter;
    this.gridState = state;
    this.loadData(this.subItemsList);
  }
  public cancelHandler(args: CancelEvent): void {
    const { isNew, rowIndex, dataItem } = args;
    // console.log('old data', this.subItemsList[rowIndex])
    if (!isNew) {
    }
    this.closeEditor(args.sender, args.rowIndex);
  }

  getAllSubItemsForVendorsServiceCall(eventTransId: number) {
    if (!this.isLoading) {
      this.isLoading = true;

      this.eventService.getAllSubItemsForVendor(eventTransId, this.authData?.userId as number).subscribe({
        next: (result: any) => {
          if (result.success) {
            this.subItemsList = result.data;
            this.loadData(this.subItemsList);
            this.isLoading = false;
          } else {
            this.commonService.showToaster(result.ErrorDetail, false);
          }
        },
        error: (err) => {
          console.log('error is', err);
          // this.downloadAllAttachmentloading = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }
  completelyvalid:boolean | undefined=true
  saveButtonClicked() {

   let isValid= this.subItemsList.map((val: ISubItemsForVendorsDataDto) => {
      if(this.commonService.twoDecimalRegex.test(val.rate.toString())){
return true
      }
    })
    console.log("is Valid",isValid)
   let EverySubItemValid=isValid.every(val =>val)
    // for(let i=0;i<isValid.length;i++){
    //   this.completelyvalid=this.completelyvalid && isValid[i]
    // }
if(EverySubItemValid){
    if (!this.saveLoader) {
      this.saveLoader = true;
      let payload = this.subItemsList.map(
        (val: ISubItemsForVendorsDataDto) => {
          return {
            eventTranId: val.eventTranId,
            subId: val.subId,
            subVId: val.subVId,
            rate: val.rate,
            remarks: val.vendorRemark ? val.vendorRemark : '',
            Quantity:val.quantity,
            EventId:val.eventid,
          };
        }
      );

      this.eventService.setSubItemsForVendor(payload).subscribe({
        next: (result: any) => {
          if (result.success) {
            this.commonService.showToaster(
              'Sub item saved successfully.',
              true
            );
            this.activeModel.close(this.validatordata);
          } else {
            this.commonService.showToaster(result.errorDetail, false);
          }
          this.saveLoader = false;
        },
        error: (err) => {
          this.saveLoader = false;
          console.log('err', err);
          this.commonService.showToaster(err.ErrorDetail, false);
        },
      });
    }
  }
    else{
      this.commonService.showToaster("Rate cannot exceed more than two decimal places",false)
    }// console.log('this is our payload', payload);
  }

  actionCondition() {

    let eventStatus = this.rfqDetail.eventStatus;
    switch (eventStatus) {
      case 'Published':
        return this.rfqDetail.vendorStatus == 'Participated' ? true : false
        break;

      default:
        return false
        break;
    }


  }

  checkValidationCondition(){
    if(this.rfqDetail.eventType=='3'){
return true
    }
    else{
      return false
    }
  }
}
