import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from '../../../event.service';
import { catchError, forkJoin, map, of } from 'rxjs';
import { FilterDescriptor, SortDescriptor, State, filterBy, orderBy, process } from '@progress/kendo-data-query';
import { AddEvent, CancelEvent, EditEvent, GridComponent, GridDataResult, RemoveEvent, SaveEvent } from '@progress/kendo-angular-grid';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../technical/technical-parameter-action-popup/data';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { TechnicalSelectTemplateComponent } from '../../technical/technical-select-template/technical-select-template.component';
import { SingleInputModalComponent } from '../../single-input-modal/single-input-modal.component';
import { IManPowerItemDataDto, IPriceBidLinesListDataDto, IRfqDetailDataDto, ISubItemsDataDto, TechnicalParametersItems } from '../../../event.interface';
import * as XLSX from 'xlsx';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';


@Component({
  selector: 'app-add-sub-items',
  templateUrl: './add-sub-items.component.html',
  styleUrls: ['./add-sub-items.component.scss']
})


export class AddSubItemsComponent {

  @Input() eventId: number;
  @Input() eventTranId: number;
  @Input() itemId: number;
  @Input() rfqDetail: IRfqDetailDataDto;
  pageSize = 10;
  typeAccess: any = {
    ADD_SUB_ITEM: 'Add Sub Item',
  }

  public view: unknown[];
  public formGroup: FormGroup | undefined;

  public gridView: GridDataResult;

  public gridState: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  subItemsList: ISubItemsDataDto[] = [];
  previousSubItemLists:any[]=[]
  private editedRowIndex: number | undefined;
  private editedProduct: Product | undefined;
  isLoading: boolean = false;
  templateSaveLoader: boolean = false;
  threeDecimalRegex: RegExp;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;

  // public state: State = {
  //   filter: undefined,
  //   skip: 0,
  //   take: 10,
  // };

  deletedList: any = [];

  userType: string | undefined;
  //   private editedProduct: Product;

  constructor(
    private activeModel: NgbActiveModal,
    private templateModel: NgbModal,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private commonService: CommonService
  ) {
    this.allData = this.allData.bind(this);
  }

  public allData(): ExcelExportData {
    // let stateData = this.gridState;
    // stateData.take = this.subItemsList.length;
    let data;

    data = process(this.subItemsList, this.gridState).data;

    let exportData = data.map((val, index) => {
      val.sno = index + 1;
      return val;
    });
    const result: ExcelExportData = {
      data: exportData,
    };

    return result;
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.subItemsList = data;
    this.gridView = process(filterData, this.gridState);
    this.cdr.detectChanges();
  }
  public ngOnInit(): void {
    this.threeDecimalRegex = this.commonService.threeDecimalRegex
    let authData = this.commonService.getAuthData();
    this.userType = authData?.userRole;
    this.getAllSubItemsServiceCall(this.eventTranId);
  }

  public onStateChange(state: any): void {
    this.sort = state.sort;
    this.filter = state.filter;
    this.gridState = state;
    this.loadData(this.subItemsList);
  }

  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);
    this.formGroup = new FormGroup({
      itemCode: new FormControl('', [Validators.required]),
      itemName: new FormControl('', [Validators.required]),
      uom: new FormControl('', [Validators.required]),
      quantity: new FormControl(0, [Validators.required]),
      rate: new FormControl(0, [Validators.required]),
      remarks: new FormControl('', [Validators.required])
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }

  public editHandler(args: EditEvent): void {
    // define all editable fields validators and default values
    const { dataItem } = args;
    this.closeEditor(args.sender);
    this.formGroup = new FormGroup({
      itemCode: new FormControl(dataItem.itemCode),
      itemName: new FormControl(dataItem.itemName),
      uom: new FormControl(dataItem.uom),
      quantity: new FormControl(dataItem.quantity),
      rate: new FormControl(dataItem.rate),
      remarks: new FormControl(dataItem.remarks)
    });

    this.editedRowIndex = args.rowIndex;
    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  public cancelHandler(args: CancelEvent): void {
    const { isNew, rowIndex, dataItem } = args;
    if (!isNew) {
    }
    this.closeEditor(args.sender, args.rowIndex);
  }

  public saveHandler({
    sender,
    rowIndex,
    formGroup,
    isNew,
    dataItem,
  }: SaveEvent): void {
    debugger;
    const subItem: ISubItemsDataDto = dataItem
    if (this.userType == 'Buyer') {

      // if (this.previousSubItemLists.find(val => val.itemCode == subItem.itemCode)) {
      //   console.log("this is val.itemcode and sub.itemcode ",this.previousSubItemLists,subItem.itemCode)
      //   this.commonService.showToaster('Cannot be added as item code contains dublicate data', false)
      //   return
      // }
      console.log("this is subitem list",this.previousSubItemLists);
      for(let i=0;i<this.previousSubItemLists.length;i++){
        if(this.previousSubItemLists[i].itemCode==subItem.itemCode && isNew){
          this.commonService.showToaster('Cannot be added as item code contains dublicate data', false)
          return;
        }
      }
      if (subItem.itemCode == '') {
        //formGroup.controls['itemCode'].setErrors({'error': true});
        this.commonService.showToaster('Enter item code.', false);
        return;
      }
      if (subItem.itemName == '') {
        this.commonService.showToaster('Enter item name.', false);
        return
      }
      if (subItem.uom == '') {
        this.commonService.showToaster('Enter UOM.', false);
        return;
      }
      if (subItem.quantity <= 0) {
        this.commonService.showToaster('Enter quantity.', false);
        return;
      }

      // if (subItem.remarks == '') {
      //   this.commonService.showToaster('Enter remarks.', false);
      //   return;
      // }
    }
    else if (this.userType == 'Vendor') {
      if (subItem.rate <= 0) {
        this.commonService.showToaster('Enter rate.', false);
        return;
      }
    }


    if (isNew) {
      // product.unique = new Date().getUTCMilliseconds();
      debugger;
      let obj = subItem;
      obj.subId = 0;
      //obj.prevParameter = dataItem.prevParameter;
      this.subItemsList.push(obj);
    } else {
      let index = this.subItemsList.findIndex(
        (val: ISubItemsDataDto) => val.itemCode == dataItem.itemCode
      );

      if (index != -1) {
        this.subItemsList[index] = dataItem;
        this.subItemsList[index].isEdited = true;
      }

      // this.technicalPrameterItemList[rowIndex + 1] = dataItem;
    }
    sender.closeRow(rowIndex);
    this.loadData(this.subItemsList);
    this.editedRowIndex = undefined;
    this.editedProduct = undefined;
  }

  public removeHandler(args: RemoveEvent): void {
    // remove the current dataItem from the current data source,
    // `editService` in this example
    // this.editService.remove(args.dataItem);
    let index = args.rowIndex;
    let item = args.dataItem;

    this.commonService
      .showAlertForWarning(
        'Are you sure',
        `you want to delete ${item.itemName}`
      )
      .then((result: any) => {
        //alert(result);
        if (result) {
          if (this.subItemsList[index].subId != 0) {
            this.deletedList.push(this.subItemsList[index]);
          }
          this.subItemsList.splice(args.rowIndex, 1);
          this.cdr.detectChanges();
          this.loadData(this.subItemsList);
        }
      });
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    // close the editor
    grid.closeRow(rowIndex);
    // reset the helpers
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
  closeModel() {
    this.activeModel.close();
  }



  getAllSubItemsServiceCall(eventTransId: number) {
    if (!this.isLoading) {
      this.isLoading = true;
      this.eventService
        .getAllSubItems(eventTransId)
        .subscribe({
          next: (result: any) => {
            if (result.success) {
              let ls = result.data.map((val: ISubItemsDataDto) => {
                return {
                  ...val,
                  isEdited: false,
                  isDeleted: false,
                };
              });
              this.previousSubItemLists=ls
              this.loadData(ls);
              this.isLoading = false;
            }
            else {
              this.commonService.showToaster(result.errorDetail, false);
              this.isLoading = false;
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

  saveParameterHandler() {
    let newData = this.subItemsList.filter(
      (val) => val.subId == 0 && !val.isDeleted
    );
    let editedList = this.subItemsList.filter(
      (val) => val.subId != 0 && val.isEdited && !val.isDeleted
    );
    // newData.forEach((val) => {
    //   this.createTechnicalParamter(
    //     val.Parameter,
    //     val.Required == 'Mandatory' ? true : false
    //   );
    // });
    // editedList.forEach((val) => {
    //   this.updateTechnicalParamter(
    //     val.id,
    //     val.Parameter,
    //     val.Required == 'Mandatory' ? true : false
    //   );
    // });
    // this.deletedList.forEach((val: any) => {
    //   this.deleteTechnicalParamter(val.id);
    // });
    this.activeModel.dismiss();
  }


  //check validation for here

  saveButtonClicked() {
    console.log("this is subitem list",this.subItemsList)
    let isthreedecimalregexvalid=this.subItemsList.every((val:any) => {
      return this.threeDecimalRegex.test(val.quantity);
   });
   if(isthreedecimalregexvalid){
    this.callFunctionForSaveChanges();
   }
   else{
    this.commonService.showToaster("The qty cannot exceed more than three decimal values.",false)
   }
  }

  callFunctionForSaveChanges() {

    debugger;
    let newItems = this.subItemsList.filter((val) => val.subId == 0 && !val.isDeleted);
    let editItems = this.subItemsList.filter((val) => val.subId != 0 && val.isEdited && !val.isDeleted);


    let newSubItems = newItems.map((val: ISubItemsDataDto) => {
      return ({
        "eventId": this.eventId,
        "eventTranId": this.eventTranId,
        "itemCode": val.itemCode.toString(),
        "itemName": val.itemName.toString(),
        "uom": val.uom,
        "quantity": val.quantity,
        "rate": val.rate,
        "remarks": val.remarks.toString()
      })
    })

    let editSubItems = editItems.map((val: ISubItemsDataDto) => {
      return ({
        "subId": val.subId,
        "itemCode": val.itemCode.toString(),
        "itemName": val.itemName.toString(),
        "uom": val.uom,
        "quantity": val.quantity,
        "rate": val.rate,
        "remarks": val.remarks.toString(),
         "eventTranId":this.eventTranId
      })
    })

    let deletedSubItems = this.deletedList.map((val: ISubItemsDataDto) => {
      return (
        val.subId
      )
    })

    this.callApisSubItems(newSubItems, editSubItems, deletedSubItems)
  }

  callApisSubItems(newSubItems: any, editSubItems?: any, deleteSubItems?: any) {
    debugger;
    let source = [];
    if (newSubItems && newSubItems.length != 0) {
      source.push(this.eventService.addSubItems(newSubItems).pipe(
        map((res) => res),
        catchError((e) => of(e))
      ))
    }

    if (editSubItems && editSubItems.length != 0) {
      source.push(this.eventService.updateSubItems(editSubItems).pipe(
        map((res) => res),
        catchError((e) => of(e))
      ))
    }

    if (deleteSubItems && deleteSubItems.length != 0) {
      source.push(this.eventService.deleteSubItems(deleteSubItems).pipe(
        map((res) => res),
        catchError((e) => of(e))
      ))
    }

    if (source.length != 0) {
      const data = document.getElementById('submitbtn');
      data?.setAttribute('data-kt-indicator', 'on');
      forkJoin(source).subscribe({
        next: (response: any) => {
          if (response[0].success) {
            this.commonService.showToaster('Sub item saved successfully.', true);
            data?.removeAttribute('data-kt-indicator');
            this.activeModel.dismiss(true);
          }
          else {
            this.commonService.showToaster(response[0].ErrorDetail, false);
            data?.removeAttribute('data-kt-indicator');
          }
        },
        error: (error: any) => {
          console.log("log error ", error)
          data?.removeAttribute('data-kt-indicator');
          this.commonService.showToaster(error?.error, false);
        },
      });
    }

  }


  checkConditionForAccess(type: string): boolean {
    let eventStatus = this.rfqDetail.eventStatus;

    switch (this.userType) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          switch (type) {
            case this.typeAccess.ADD_SUB_ITEM:
              return false;
          }
        } else if (eventStatus == 'Unpublished') {
          switch (type) {
            case this.typeAccess.ADD_SUB_ITEM:
              return true;
          }
        }

        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          switch (type) {
            case this.typeAccess.ADD_SUB_ITEM:
              return true;

          }
        } else if (eventStatus == 'Unpublished') {
          switch (type) {
            case this.typeAccess.ADD_SUB_ITEM:
              return false;

          }
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
  }


  uploadExcelFile() {
    const _self = this
    let node = document.createElement('input');
    node.type = 'file';
    node.accept = '.xlsx';
    // code to convert excel to json
    node.onchange = (ev: any) => {
      let workBook: any = null;
      let jsonData = null;
      const reader = new FileReader();
      const file = ev.target.files[0];
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});

        let workSheetNames = Object.keys(jsonData);
        let dataval = jsonData[workSheetNames[0]];
        let newList: ISubItemsDataDto[] = []
        let dataKeys = Object.keys(dataval[0]);
        if (dataKeys.includes('Item Code')) {
          let ls: any[] = this.subItemsList.map(val => val.itemCode)
          dataval.forEach((val: any) => {
            if (val['Item Code'] && val['Item Name'] && val['UOM'] && val['Quantity']) {
              let item: ISubItemsDataDto = {
                itemCode: val['Item Code'],
                itemName: val['Item Name'],
                uom: val['UOM'],
                quantity: val['Quantity'],
                remarks: val['Remarks'] || '',
                isEdited: false,
                isDeleted: false,
                subId: 0,
                rate: 0,
                eventId: this.eventId,
                eventTranId: this.eventTranId,
              }

              if (ls.includes(item.itemCode)) {
                this.commonService.showToaster(`Row ${val.__rowNum__} cannot be added as it contains duplicate data`, false)
              } else {
                ls.push(item.itemCode)
                newList.push(item)
              }
            } else {
              this.commonService.showToaster(
                `Row ${val.__rowNum__} cannot be added as it contains invalid data`,
                false
              );
            }
          });
        } else {
          this.commonService.showToaster('Invalid excel format', false);
        }


        this.subItemsList = [...this.subItemsList, ...newList]
        _self.gridState = {
          filter: undefined,
          group: [],
          skip: 0,
          sort: [],
          take: 10,
        };
        _self.loadData(this.subItemsList)

      };
      reader.readAsBinaryString(file);
    };

    node.click();
  }
  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }


}
