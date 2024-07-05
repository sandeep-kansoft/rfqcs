import {
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
  NgbOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import {
  AddEvent,
  CancelEvent,
  EditEvent,
  GridComponent,
  GridDataResult,
  RemoveEvent,
  SaveEvent,
} from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  IDefaultResponseDto,
  IGetAssignnedCollabrativeUserDataDta,
  IRfqDetailDataDto,
  ITechnicalParamterItemDto,
  ITermAndConditionResultDataDto,
  ITermAndConditionsListDataDto,
  IVendorDeviationDataDto,
} from '../../event.interface';
import { EventService } from '../../event.service';
import { SingleInputModalComponent } from '../single-input-modal/single-input-modal.component';
import { TechnicalParameterActionPopupComponent } from '../technical/technical-parameter-action-popup/technical-parameter-action-popup.component';
import * as XLSX from 'xlsx';
import { TechnicalSelectTemplateComponent } from '../technical/technical-select-template/technical-select-template.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClauseDto } from './ClauseDto';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent {
  @Input() rfqDetail: IRfqDetailDataDto;
  // @Output() setTabCompletedStatus$ = new EventEmitter<{
  //   type: string;
  //   status: boolean;
  // }>();
  loading: boolean = false;
  termAndConditionsList: ITermAndConditionsListDataDto[];
  vendorDeviationList: IVendorDeviationDataDto[];
  gridViewTemplate: GridDataResult;
  headerStyle = 'fw-bold';
  ClauseDataList: any = [];
  pageSize = 10;
  authData: AuthModel | null | undefined;
  // ClauseDataList: any = [];

  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  @Output() updateCheckList$ = new EventEmitter();


  serachText: string;
  public formGroup: FormGroup | undefined;
  private editedRowIndex: number | undefined;
  private editedProduct: ClauseDto | undefined;

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  listItems = ['Mandatory', 'Non-Mandatory'];
  templateSaveLoader: boolean = false;

  constructor(
    private commonService: CommonService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
    private modalService: NgbModal,
    private templateModel: NgbModal
  ) {
    this.allData = this.allData.bind(this);
    this.authData = this.commonService.getAuthData();
  }

  public ngOnInit() {
    //this.saveTermsAndConditionServiceCall();
    //this.editTermsAndConditionServiceCall();
    // this.deleteTermsAndConditionServiceCall(5);
    this.getALLTermsAndConditionServiceCall('');

    // this.getAllTemplatesByType();
    // this.getALLTermsAndConditionServiceCall('');
    // this.getTermsAndConditionByIdServiceCall(5);
    //this.getVendorDeviationListServiceCall();
  }

  public onStateChange(state: any) {
    this.sort = state.sort;
    this.filter = state.filter;
    this.state = state;
    this.loadDataTemplate(this.termAndConditionsList);
  }
  //single input modal code start from here
  openSingleInputModal(item: any) {
    this.commonService.clearToaster();
    const modal: NgbModalRef = this.modalService.open(
      SingleInputModalComponent,
      { centered: true }
    );
    modal.componentInstance.title = 'Term';
    modal.componentInstance.placeholderName = 'Enter Term';
    modal.componentInstance.value = item ? item.terms : '';
    return modal.result.then(
      (result: string) => {
        // let data: any = result as string;
        if (result) {
          let data = result;
          // this.ClauseDataList.push({ terms: data });
          // this.loadDataTemplate(this.ClauseDataList);
        }
      },
      (reason) => {
        if (reason) {
          if (item && item.terms != reason) {
            // this.editTermsAndConditionServiceCall(item, reason);
          } else if (item == null) {
          }
          // this.saveTermsAndConditionServiceCall(reason);
        }
      }
    );
  }

  //Save Terms And Condition
  saveTermsAndConditionServiceCall(terms: string) {
    this.loading = true;
    let data = {
      eventid: this.rfqDetail.eventid,
      terms: terms,
      isrequired: true,
    };
    this.eventService.postSaveTermsAndCondition(data).subscribe({
      next: (result: ITermAndConditionResultDataDto) => {
        this.loading = false;
        if (result.success) {
          // this.commonService.showToaster('Term saved successfully.', true);
          this.getALLTermsAndConditionServiceCall('');
          // this.updateCheckList()
        } else {
          this.commonService.showToaster(result.errorDetail, false)
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Edit Terms And Condition
  editTermsAndConditionServiceCall(item: any, term: string) {
    this.loading = true;
    let data = {
      // tncid: item.tncid,
      // eventid: this.rfqDetail.eventid,
      // terms: term,
      // isrequired: true,
      // isdeleted: false,

      tncid: item.tncid,
      eventid: this.rfqDetail.eventid,
      terms: term,
      isrequired: true,
    };
    this.eventService.postEditTermsAndCondition(data).subscribe({
      next: (result: ITermAndConditionResultDataDto) => {
        this.loading = false;
        if (result.success) {
          this.commonService.showToaster('Term updated successfully.', true);
          this.getALLTermsAndConditionServiceCall('');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //open modal for delete
  deleteTermModal(item: any) {
    this.commonService
      .showAlertForWarning(
        'Delete',
        'Are you sure, you want to delete this term?'
      )
      .then((result: any) => {
        //alert(result);
        if (result) {
          // this.deleteTermsAndConditionServiceCall(item.tncid);
        } else {
        }
        this.cdr.detectChanges();
      });
  }

  //delete Terms And Condition
  deleteTermsAndConditionServiceCall(tncid: number) {
    this.loading = true;
    this.eventService.deleteTermsAndCondition(tncid).subscribe({
      next: (result: ITermAndConditionResultDataDto) => {
        this.loading = false;
        if (result.success) {
          this.commonService.showToaster('Term deleted successfully.', true);
          this.getALLTermsAndConditionServiceCall('');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  // setTabCompleteStatus(status: boolean) {
  //   this.setTabCompletedStatus$.emit({
  //     type: 'TERM_CONDITION',
  //     status: status,
  //   });
  // }

  //ALL Terms And Condition
  getALLTermsAndConditionServiceCall(searchBy: string) {
    this.loading = true;
    this.eventService
      .getALLTermsAndCondition(this.rfqDetail.eventid, searchBy)
      .subscribe({
        next: (result: ITermAndConditionResultDataDto) => {
          this.loading = false;
          if (result.success) {
            const resultsList = result.data.filter(
              (val: ITermAndConditionsListDataDto) => !val.isdeleted
            );
            // setting status of terms and condition page
            // this.setTabCompleteStatus(resultsList.length != 0 ? true : false);
            this.state = {
              filter: undefined,
              group: [],
              skip: 0,
              sort: [],
              take: 10,
            }
            this.updateCheckList();
            this.loadDataTemplate(resultsList);
            // console.log("get all terms and condation", this.termAndConditionsList)
            // this.loadDataTemplate(this.termAndConditionsList);
          } else {
            this.commonService.showToaster(result.errorDetail, false)
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }

  loadDataTemplate(data: any) {
    this.termAndConditionsList = data;
    this.gridViewTemplate = process(data, this.state);
    this.loading = false;
    this.cdr.detectChanges();
  }

  //Get Terms And Condition by id
  getTermsAndConditionByIdServiceCall(tncid: number) {
    this.loading = true;
    this.eventService.getTermsAndConditionById(tncid).subscribe({
      next: (result: ITermAndConditionResultDataDto) => {
        this.loading = false;
        if (result.success) {
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Vendor Deviation List
  getVendorDeviationListServiceCall() {
    this.loading = true;
    this.eventService.getVendorDeviationList(this.rfqDetail.eventid).subscribe({
      next: (result: ITermAndConditionResultDataDto) => {
        this.loading = false;
        if (result.success) {
          this.vendorDeviationList = result.data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Accept Vendor Deviation
  acceptVendorDeviationServiceCall() {
    this.loading = true;
    let data = {
      tncid: 5,
      eventid: 41,
      terms: 'terms1',
      deviation: 'deviation1',
      isrequired: true,
      isdeleted: true,
      deviatioN_MSTID: 0,
      isDeviated: true,
      isUpdated: true,
      isAccepted: true,
      createddate: '2023-03-17T13:27:51.313Z',
      checkDuplicate: 0,
    };
    this.eventService.postAcceptVendorDeviation(data).subscribe({
      next: (result: ITermAndConditionResultDataDto) => {
        this.loading = false;
        if (result.success) {
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Deviate Vendor Deviation
  deviateVendorDeviationServiceCall() {
    this.loading = true;
    let data = {
      tncid: 0,
      eventid: 0,
      userid: 0,
      vendorid: 0,
      terms: 'string',
      deviation: 'string',
      isrequired: true,
      isdeleted: true,
      deviatioN_MSTID: 0,
      isDeviated: true,
      isUpdated: true,
      isAccepted: true,
      createddate: '2023-03-17T13:32:52.457Z',
      checkDuplicate: 0,
    };
    this.eventService.postDeviateVendorDeviation(data).subscribe({
      next: (result: ITermAndConditionResultDataDto) => {
        this.loading = false;
        if (result.success) {
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Update Vendor Deviation
  updateVendorDeviationServiceCall() {
    this.loading = true;
    let data = {
      tncid: 0,
      eventid: 0,
      userid: 0,
      vendorid: 0,
      terms: 'string',
      deviation: 'string',
      isrequired: true,
      isdeleted: true,
      deviatioN_MSTID: 0,
      isDeviated: true,
      isUpdated: true,
      isAccepted: true,
      createddate: '2023-03-17T13:33:30.082Z',
      checkDuplicate: 0,
    };
    this.eventService.postUpdateVendorDeviation(data).subscribe({
      next: (result: ITermAndConditionResultDataDto) => {
        this.loading = false;
        if (result.success) {
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
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
    this.gridViewTemplate = process(filterData, this.state);
  }

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.termAndConditionsList, {
        filters: [
          {
            filters: [
              {
                field: 'terms',
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
      return filterBy(this.termAndConditionsList, this.filter);
    }
  }

  openTechnicalParameterActionPopUp() {
    const modelRef = this.modalService.open(
      TechnicalParameterActionPopupComponent,
      {
        centered: true,
        fullscreen: true,
        scrollable: true,
      }
    );

    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    //modelRef.componentInstance.eventTranId = item.eventTranId;
  }

  getAllTemplatesByType() {
    // this.loading = true;
    this.eventService.GetTemplateByTypeApi('TermsAndCondations', 0).subscribe({
      next: (result: IDefaultResponseDto<any>) => {
        // this.loading = false;

        // this.loadData(result.data);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        // this.loading = false;
      },
    });
  }
  // excel export Data
  public allData(): ExcelExportData {
    let stateData = this.state;
    stateData.take = this.termAndConditionsList.length;
    let data;
    if (this.serachText != '') {
      // let filterData = this.getFilteredData(this.serachText);
      data = process(this.termAndConditionsList, stateData).data;
    } else {
      data = process(this.termAndConditionsList, stateData).data;
    }
    let exportData = data.map((val, index) => {
      val.sno = index + 1;
      return val;
    });
    const result: ExcelExportData = {
      data: exportData,
    };

    return result;
  }

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
        let dataval = jsonData[workSheetNames[0]];

        let dataKeys = Object.keys(dataval[0]);
        if (dataKeys.includes('Clause Name')) {
          dataval.forEach((val: any) => {
            if (val['Clause Name']) {
              this.saveTermsAndConditionServiceCall(val['Clause Name']);
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

        // dataval.forEach((val: any) => {
        //   console.log('val here is ', val);
        //   if (val['Clause Name']) {
        //   }
        //   // return {
        //   //   terms: val.terms,
        //   // };
        // });

        // this.loadData(dataval);
      };
      reader.readAsBinaryString(file);
    };

    node.click();
  }

  openTemplateListModel() {
    const modelRef = this.templateModel.open(TechnicalSelectTemplateComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });
    modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.componentInstance.itemId = 0;
    modelRef.componentInstance.type = 'Terms & Condation';

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
                      terms: val.terms,
                    };
                    ls.push(obj);
                  })
                  : [];
            });

            ls.forEach((val) => {
              this.saveTermsAndConditionServiceCall(val.terms);
            });

            // debugger;
            // this.technicalPrameterItemList.concat(ls);
            // this.loadData([...this.technicalPrameterItemList, ...ls]);
          }
        },
        () => { }
      )
      .catch((err) => console.log(err));
  }

  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);
    this.formGroup = new FormGroup({
      terms: new FormControl('', [Validators.required]),
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }

  public editHandler(args: EditEvent): void {
    // define all editable fields validators and default values
    const { dataItem } = args;
    this.closeEditor(args.sender);
    this.formGroup = new FormGroup({
      terms: new FormControl(),
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
    if (product.terms == '') {
      return;
    }

    if (isNew) {
      // product.unique = new Date().getUTCMilliseconds();

      // let obj = product;
      // obj.id = 0;
      // obj.prevParameter = dataItem.prevParameter;
      this.saveTermsAndConditionServiceCall(dataItem.terms);

      // this.termAndConditionsList.push(obj);
    } else {
      this.editTermsAndConditionServiceCall(dataItem, dataItem.terms);

      // let index = this.termAndConditionsList.findIndex(
      //   (val: any) => val == dataItem
      // );

      // if (index != -1) {
      //   this.termAndConditionsList[index] = dataItem;
      //   // this.termAndConditionsList[index].isEdited = true;
      // }

      // this.termAndConditionsList[rowIndex + 1] = dataItem;
    }
    sender.closeRow(rowIndex);
    this.loadDataTemplate(this.termAndConditionsList);
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
      .showAlertForWarning('Are you sure', `you want to delete ${item.terms}`)
      .then((result: any) => {
        //alert(result);
        if (result) {
          this.deleteTermsAndConditionServiceCall(item.tncid);
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

  saveTemplateModel() {
    if (this.termAndConditionsList.length != 0) {
      const modelRef = this.templateModel.open(SingleInputModalComponent, {
        centered: true,
        fullscreen: false,
        scrollable: true,
      });

      modelRef.componentInstance.title = 'Terms And Condition';
      modelRef.componentInstance.placeholderName = 'Name';
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
      this.commonService.showToaster('Please add clause', false);
    }
  }

  saveTemplateApi(name: string) {
    if (!this.templateSaveLoader) {
      let teamplatesList = this.termAndConditionsList.map((val: any) => {
        let obj: any = {};
        obj.terms = val.terms;
        return obj;
      });

      const payload: any = {
        templateType: 'TNC',
        templateName: name,
        templateValue: JSON.stringify(teamplatesList),
        // itemId: this.itemId,
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

  gridCommandCondition() {
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

  showVendorDeviation() {
    return this.authData?.userRole == 'Vendor' &&
      this.rfqDetail.eventStatus == 'Published'
      ? true
      : false;
  }

  isVendorContent(): boolean {
    // let eventStatus = this.rfqDetail.eventStatus;
    // switch (this.authData?.userRole) {
    //   case 'Buyer':
    //     false;
    //     break;
    //   case 'Vendor':
    //     return true;
    //     break;
    //   case 'Requester/Technical':
    //     return false;
    //     break;
    // }

    return this.authData?.userRole == 'Vendor' ? true : false;
  }


  isBuyerContent() {

  }

  vendorDeviationTabCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Unpublished') {
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

  updateCheckList() {
    this.updateCheckList$.emit();
  }
  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }
}
