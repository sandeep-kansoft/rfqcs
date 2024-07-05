import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CancelEvent,
  CellClickEvent,
  EditEvent,
  GridDataResult,
  RemoveEvent,
  SaveEvent,
} from '@progress/kendo-angular-grid';
import { OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { RfqAuctionListComponent } from '../../../rfq-auction-list/rfq-auction-list.component';
import {
  filterBy,
  orderBy,
  State,
  process,
  SortDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import {
  IGetAllVendors,
  IRfqDetailDataDto,
  TechnicalParametersItems,
} from '../../../event.interface';
import { Product } from './data';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { TechnicalSelectTemplateComponent } from '../technical-select-template/technical-select-template.component';
import * as XLSX from 'xlsx';
import { EventService } from '../../../event.service';
import { Observable, combineLatest, combineLatestAll, concat, concatMap, delay, forkJoin, map, of, switchMap } from 'rxjs';
import { SingleInputModalComponent } from '../../single-input-modal/single-input-modal.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';
@Component({
  selector: 'app-technical-parameter-action-popup',
  templateUrl: './technical-parameter-action-popup.component.html',
  styleUrls: ['./technical-parameter-action-popup.component.scss'],
})
export class TechnicalParameterActionPopupComponent {
  @Input() rfqDetail: IRfqDetailDataDto;
  public view: unknown[];
  public formGroup: FormGroup | undefined;
  @Input() eventId: number;
  @Input() eventTranId: number;
  @Input() itemId: number;
  saveChangesLoader: boolean = false


  public gridView: GridDataResult;
  authData: AuthModel | null | undefined;

  public gridState: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  technicalPrameterItemList: Product[] = [];
  private editedRowIndex: number | undefined;
  private editedProduct: Product | undefined;
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
  ) {
    this.allData = this.allData.bind(this);
  }

  public allData(): ExcelExportData {
    let stateData = this.state;
    stateData.take = this.technicalPrameterItemList.length;
    let data = process(this.technicalPrameterItemList, stateData).data;
    const result: ExcelExportData = {
      data: data,
    };

    return result;
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.technicalPrameterItemList = data;
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
  }
  public ngOnInit(): void {
    this.getParameterOfEventsApi(this.eventTranId);
    this.authData = this.commonService.getAuthData();
    // this.loadData(this.technicalPrameterItemList);
  }

  // public onStateChange(state: State): void {
  //   this.gridState = state;
  //   this.loadData(this.technicalPrameterItemList);
  // }

  // public addHandler(args: AddEvent): void {
  //   // this.closeEditor(args.sender);
  //   // args.sender.addRow(new Product());
  //   this.formGroup = new FormGroup({
  //     parameter: new FormControl(''),
  //     required: new FormControl(''),
  //   });
  //   args.sender.addRow(this.formGroup);
  // }

  // public editHandler(args: EditEvent): void {
  //   // close the previously edited item
  //   this.closeEditor(args.sender);
  //   this.editedRowIndex = args.rowIndex;
  //   this.editedProduct = Object.assign({}, args.dataItem);

  //   this.formGroup = new FormGroup({
  //     parameter: new FormControl(''),
  //     required: new FormControl(''),
  //   });

  //   this.editedRowIndex = args.rowIndex;
  //   args.sender.editRow(args.rowIndex, this.formGroup);
  // }

  // public cancelHandler(args: CancelEvent): void {
  //   this.closeEditor(args.sender, args.rowIndex);
  // }

  // public saveHandler(args: SaveEvent): void {
  //   const product: any = args.formGroup.value;
  //   if (args.isNew) {
  //     this.technicalPrameterItemList.push(product);
  //   } else {
  //     this.technicalPrameterItemList[args.rowIndex + 1] = args.dataItem;
  //   }
  //   console.log(
  //     'technicalPrameterItemList',
  //     this.technicalPrameterItemList,
  //     args.isNew
  //   );
  //   args.sender.closeRow(args.rowIndex);
  //   this.loadData(this.technicalPrameterItemList);
  //   this.editedRowIndex = undefined;
  //   this.editedProduct = undefined;
  // }

  // public removeHandler(args: RemoveEvent): void {
  //   this.technicalPrameterItemList.splice(args.rowIndex, 1);
  //   this.loadData(this.technicalPrameterItemList);
  // }

  // private closeEditor(
  //   grid: GridComponent,
  //   rowIndex = this.editedRowIndex
  // ): void {
  //   // close the editor
  //   grid.closeRow(rowIndex);
  //   this.technicalPrameterItemList.slice(rowIndex, 1);
  //   this.editedRowIndex = undefined;
  //   this.editedProduct = undefined;
  //   this.formGroup = undefined;
  // }

  public onStateChange(state: any): void {
    this.sort = state.sort;
    this.filter = state.filter;
    this.state = state;
    this.loadData(this.technicalPrameterItemList);
  }

  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);
    this.formGroup = new FormGroup({
      Parameter: new FormControl('', [Validators.required]),
      Required: new FormControl('Mandatory', [Validators.required]),
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }

  public editHandler(args: EditEvent): void {
    // define all editable fields validators and default values
    const { dataItem } = args;
    this.closeEditor(args.sender);
    this.formGroup = new FormGroup({
      Parameter: new FormControl(),
      Required: new FormControl(),
    });

    this.editedRowIndex = args.rowIndex;
    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  public cancelHandler(args: CancelEvent): void {
    const { isNew } = args;

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
    const product: any = formGroup.value;
    if (product.Parameter == '') {
      return;
    }

    if (isNew) {
      // product.unique = new Date().getUTCMilliseconds();
      debugger;
      let obj = product;
      obj.id = 0;
      obj.prevParameter = dataItem.prevParameter;
      this.technicalPrameterItemList.push(obj);
    } else {
      let index = this.technicalPrameterItemList.findIndex(
        (val: any) => val == dataItem
      );

      if (index != -1) {
        this.technicalPrameterItemList[index] = dataItem;
        this.technicalPrameterItemList[index].isEdited = true;
      }

      // this.technicalPrameterItemList[rowIndex + 1] = dataItem;
    }
    sender.closeRow(rowIndex);
    this.loadData(this.technicalPrameterItemList);
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
        `you want to delete ${item.Parameter}`
      )
      .then((result: any) => {
        //alert(result);
        if (result) {
          if (this.technicalPrameterItemList[index].id != 0) {
            this.deletedList.push(this.technicalPrameterItemList[index]);
          }
          this.technicalPrameterItemList.splice(args.rowIndex, 1);
          this.cdr.detectChanges();
          this.loadData(this.technicalPrameterItemList);
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
    this.activeModel.dismiss();
  }

  openTemplateListModel() {
    const modelRef = this.templateModel.open(TechnicalSelectTemplateComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });
    modelRef.componentInstance.eventId = this.eventId;
    modelRef.componentInstance.itemId = this.itemId;
    modelRef.componentInstance.type = 'Technical';

    modelRef.result
      .then(
        (result) => {
          if (result && result.length != 0) {
            let ls: any[] = [];
            result.forEach((val: any) => {
              let tempValue = JSON.parse(val.templateValue);
              let list =
                tempValue.length != 0
                  ? tempValue.forEach((val: any) => {
                    let obj = {
                      Parameter: val.Parameter,
                      Required: val.Mandatory ? 'Mandatory' : 'Non-Mandatory',
                      id: 0,
                      isDeleted: false,
                    };
                    ls.push(obj);
                  })
                  : [];
            });
            // debugger;

            // this.technicalPrameterItemList.concat(ls);
            this.loadData([...this.technicalPrameterItemList, ...ls]);
          }
        },
        () => { }
      )
      .catch((err) => console.log(err));
  }

  saveTemplateModel() {
    if (this.technicalPrameterItemList.length != 0) {
      const modelRef = this.templateModel.open(SingleInputModalComponent, {
        centered: true,
        fullscreen: false,
        scrollable: true,
      });

      modelRef.componentInstance.title = 'Technical Parameters';
      modelRef.componentInstance.placeholderName = 'name';
      modelRef.result.then(
        (result) => {
          // if (result) {
          //   this.saveTemplateApi(result);
          // }
        },
        (result) => {
          if (result) {
            this.saveTemplateApi(result);
          }
        }
      );
    } else {
      this.commonService.showToaster('Please add technical parameters', false);
    }
  }

  saveTemplateApi(name: string) {
    if (!this.templateSaveLoader) {
      let teamplatesList = this.technicalPrameterItemList.map((val: any) => {
        let obj: any = {};
        obj.Mandatory = val.Required == 'Mandatory' ? true : false;
        obj.Parameter = val.Parameter;
        return obj;
      });

      const payload: any = {
        templateType: 'Technical',
        templateName: name,
        templateValue: JSON.stringify(teamplatesList),
        itemId: this.itemId,
      };

      this.templateSaveLoader = true;
      this.eventService.saveTemplateApi(payload).subscribe({
        next: (result: any) => {
          if (result.success) {
            this.commonService.showToaster(
              'Template created successfully',
              true
            );
          } else {
            this.commonService.showToaster(result.errorDetail, false);
          }

          this.templateSaveLoader = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.templateSaveLoader = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  // onFileChange(ev: any) {
  //   let workBook: any = null;
  //   let jsonData = null;
  //   const reader = new FileReader();
  //   const file = ev.target.files[0];
  //   reader.onload = (event) => {
  //     const data = reader.result;
  //     workBook = XLSX.read(data, { type: 'binary' });
  //     jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
  //       const sheet = workBook.Sheets[name];
  //       initial[name] = XLSX.utils.sheet_to_json(sheet);
  //       return initial;
  //     }, {});

  //     let keys = Object.keys(jsonData);
  //     let dataval = jsonData[keys[0]];

  //     let filteredList = dataval.map((val: any) => {
  //       return {
  //         Parameter: val.Parameter,
  //         Required: val.Required,
  //         id: 0,
  //         isDeleted: false,
  //       };
  //     });
  //     // console.log('uploaded excel is', dataval)
  //     this.loadData([...this.technicalPrameterItemList, ...filteredList]);
  //   };
  //   reader.readAsBinaryString(file);
  // }

  uploadExcelFile() {
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
        let dataval: any[] = jsonData[workSheetNames[0]];

        let dataKeys = Object.keys(dataval[0]);

        if (dataKeys.includes('Parameter') && dataKeys.includes('Required')) {
          let parameterList: any[] = [];

          dataval.forEach((val: any) => {
            if (val.Parameter && val.Required) {
              parameterList.push({
                Parameter: val.Parameter,
                Required: val.Required,
                id: 0,
                isDeleted: false,
              });
            } else {
              this.commonService.showToaster(
                `Row ${val.__rowNum__} cannot be added as it contains invalid data`,
                false
              );
            }
          });
          this.state =  {
            filter: undefined,
            group: [],
            skip: 0,
            sort: [],
            take: 10,
          };
          this.loadData([...this.technicalPrameterItemList, ...parameterList]);
        } else {
          this.commonService.showToaster('Invalid excel format', false);
        }
      };
      reader.readAsBinaryString(file);
    };

    node.click();
  }

  getParameterOfEventsApi(eventTransId: number) {
    if (!this.isLoading) {
      this.isLoading = true;
      this.eventService
        .getTechnicalParametersOfEventsApi(this.eventId, eventTransId)

        .subscribe({
          next: (result: any) => {
            let ls = result.data.map((val: TechnicalParametersItems) => {
              return {
                Parameter: val.parameter,
                Required: val.isrequired ? 'Mandatory' : 'Non-Mandatory',
                id: val.parameterid,
                isEdited: false,
                isDeleted: false,
              };
            });
            this.loadData(ls);
            this.isLoading = false;
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


  getSaveTemplatePayload(parameter: string, isRequired: boolean) {
    return {
      eventid: this.eventId,
      evenT_TRANSID: this.eventTranId,
      technicalParams: [
        {
          parameter: parameter.toString(),
          isrequired: isRequired,
        },
      ],
    }
  }

  saveParameterHandler() {

    // if loader is open then save button will be disabled
    if (this.saveChangesLoader) return


    let obserableList = [] as Observable<any>[];

    // filter out newly creaded data and pushed on obserable list
    const requests = this.technicalPrameterItemList.filter((val) => val.id == 0 && !val.isDeleted)
      .map(val => ({ parameter: val.Parameter.toString(), isRequired: (val.Required == 'Mandatory' ? true : false) }));

    if (requests.length != 0) {
      const requests$ = of(...requests);

      obserableList.push(requests$
        .pipe(concatMap(request =>
          this.eventService.saveTechnicalParameterApi(this.getSaveTemplatePayload(request.parameter, request.isRequired)))))
    }


    // filtering out edited data and pushed in obserable list
    this.technicalPrameterItemList.filter(
      (val) => val.id != 0 && val.isEdited && !val.isDeleted
    ).forEach((val) => {
      obserableList.push(this.updateTechnicalParamter(
        val.id,
        val.Parameter.toString(),
        val.Required == 'Mandatory' ? true : false
      ))
    });

    // filtering out the data which need to be deleted
    this.deletedList.forEach((val: any) => {
      obserableList.push(this.deleteTechnicalParamter(val.id))
    });

    // combining api calls and show complete status toast
    if (obserableList.length != 0) {
      this.saveChangesLoader = true
      forkJoin(obserableList)
        .subscribe({
          next: (result) => {
            this.commonService.showToaster("Changes updated", true)
            this.saveChangesLoader = false
            this.activeModel.close();

          }, error: (err) => {
            this.commonService.showToaster("Something went wrong", false)
            this.activeModel.close();
            this.saveChangesLoader = false
            console.log("result is", err)

          }
        })
    }
  }

  createTechnicalParamter(parameter: string, required: boolean) {
    let payload = {
      eventid: this.eventId,
      evenT_TRANSID: this.eventTranId,
      technicalParams: [
        {
          parameter: parameter.toString(),
          isrequired: required,
        },
      ],
    };
    return
  }

  updateTechnicalParamter(id: number, parameter: string, require: boolean) {
    let payload = {
      parameterid: id,
      isrequired: require,
      parameter: parameter,
      // technicalParams: [
      //   {
      //     parameter: parameter,
      //     isrequired: require,
      //   },
      // ],
    };
    return this.eventService.updateTechnicalParamterApi(payload)
  }
  deleteTechnicalParamter(id: number) {
    return this.eventService.deleteTechnicalParamterApi(id)
  }

  addAndUpdateCondition() {
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
  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }
}
