import { ChangeDetectorRef, Component } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';
import {
  AddEvent,
  CancelEvent,
  DataStateChangeEvent,
  EditEvent,
  GridComponent,
  GridDataResult,
  RemoveEvent,
  SaveEvent,
} from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Category, currencyRaw, data2, dummyUserData, LanguageListRaw, TimeZoneListRaw } from './product';
import { ProfileService } from '../profile.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { Select2UpdateEvent } from 'ng-select2-component';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
})
export class CampaignsComponent {
  public gridView: GridDataResult;
  public userdata: any[] = dummyUserData;
  public pageSize = 10;
  columnWidth = 150;
  id: number = 1001;
  isFromOpen: boolean = false;
  isEditMode: boolean = false;
  model: NgbDateStruct;
  isDisabled = (date: NgbDate, current: any) => date.month !== current.month;
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  tableContentLoading: boolean = false;

  constructor(
    private profileInfo: ProfileService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }
  private editedRowIndex: number | undefined;
  public formGroup: FormGroup | undefined;
  public state: State = {
    group: [{ field: 'gender' }],
    sort: [
      {
        field: 'ProductName',
        dir: 'asc',
      },
    ],
    filter: {
      logic: 'and',
      filters: [],
    },
    skip: 0,
    take: 10,
  };

  public ngOnInit(): void {
    this.tableContentLoading = true;
    setTimeout(() => {
      this.loadProducts();
      this.tableContentLoading = false;
      this.ref.detectChanges();
    }, 2000);

    // this.ngxLoader.start();
    // setTimeout(() => {
    //   this.ngxLoader.stop();
    // }, 3000);

    // console.log("Here in child the data is ", this.userDetailInfo)
    this.userForm = this.formBuilder.group({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl(1, Validators.required),
      // CategoryID: new FormControl(1),
      contact_name: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      country: new FormControl(''),
      timezone: new FormControl(''),
      company: new FormControl(''),
      language: new FormControl(''),
      currency: new FormControl(''),
    });

    this.commonService.sendData.subscribe(() => {
      this.isFromOpen = true;
      this.isEditMode = false;

      this.userForm?.get('first_name')?.setValue('');
      this.userForm?.get('last_name')?.setValue('');
      this.userForm?.get('contact_name')?.setValue('');
      this.userForm?.get('gender')?.setValue('');
      this.userForm?.get('country')?.setValue('');
      this.userForm?.get('timezone')?.setValue('');
      this.userForm?.get('company')?.setValue('');
      this.userForm?.get('language')?.setValue('');
      this.userForm?.get('currency')?.setValue('');
    });
  }
  checkMobileBrowser() {

    return this.commonService.isMobileBrowser;
  }
  public onStateChange(state: any) {
    this.state = state;

    const newState: any = Object.assign({}, state);

    const sortDescriptor = state.sort.find(
      (s: any) => s.field === 'ProductName'
    );
    const newSortDescriptor: SortDescriptor = { field: '', dir: 'asc' };
    if (sortDescriptor && sortDescriptor.field === 'ProductName') {
      newSortDescriptor.field = 'Unit Price';
      newSortDescriptor.dir = sortDescriptor.dir;
    }
    newState.sort = newState.sort.filter((s: any) => s.field !== 'ProductName');
    newState.sort.push(newSortDescriptor);
    this.loadProducts();
  }

  private loadProducts(): void {
    this.gridView = process(dummyUserData, this.state);
  }

  // public removeItemFormTable(item: any) {
  //   this.userdata = userdata.filter((val) => val.ProductID != item.ProductID);
  //   console.log(this.userdata);
  // }

  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);
    // define all editable fields validators and default values
    this.formGroup = new FormGroup({
      ProductID: new FormControl(''),
      ProductName: new FormControl('', Validators.required),

      SupplierID: new FormControl('', Validators.required),
      CategoryID: new FormControl('', Validators.required),
      QuantityPerUnit: new FormControl('', Validators.required),
      UnitPrice: new FormControl('', Validators.required),
      UnitsInStock: new FormControl(''),
      UnitsOnOrder: new FormControl(''),
      ReorderLevel: new FormControl('', Validators.required),
      CategoryName: new FormControl('', Validators.required),
      Discontinued: new FormControl(''),
      CategoryDescription: new FormControl(''),
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }

  public editHandler(dataItem: any): void {
    this.isFromOpen = true;
    this.isEditMode = true;
    this.userForm?.get('first_name')?.setValue(dataItem.first_name);
    this.userForm?.get('last_name')?.setValue(dataItem.last_name);
    this.userForm?.get('contact_name')?.setValue(dataItem.contact_name);
    this.userForm?.get('gender')?.setValue(dataItem.gender);
    this.userForm?.get('country')?.setValue(dataItem.country);
    this.userForm?.get('timezone')?.setValue(dataItem.timezone);
    this.userForm?.get('company')?.setValue(dataItem.company);
    this.userForm?.get('language')?.setValue(dataItem.language);
    this.userForm?.get('currency')?.setValue(dataItem.currency);

    return;
  }

  public cancelHandler(args: CancelEvent): void {
    // close the editor for the given row
    this.closeEditor(args.sender, args.rowIndex);
  }

  public saveHandler(): void {
    const singleUser = this.userForm?.value;

    try {
      let payload = {
        id: singleUser?.id ? singleUser?.id : this.id + 1,
        first_name: singleUser?.first_name,
        last_name: singleUser?.last_name,
        contact_name: singleUser?.contact_name,
        gender: singleUser?.gender,
        country: singleUser?.country,
        timezone: singleUser?.timezone,
        company: singleUser?.company,
        language: singleUser?.language,
        currency: singleUser?.currency,
      };

      if (this.isEditMode) {
        let index = this.userdata.findIndex((val) => val.id == payload.id);
        if (index != -1) {
          this.userdata[index] = payload;
        }
      } else {
        this.userdata.push(payload);
      }

      this.isFromOpen = false;
      this.gridView = process(this.userdata, this.state);
    } catch (ex) {
      console.log('Error occured while saving ', ex);
    }
  }

  public removeHandler(dataItem: any): void {
    // remove the current dataItem from the current data source,
    // `editService` in this example
    //this.editService.remove();
    console.log(dataItem);
    this.isFromOpen = false;
    this.openAlert('TableItem', dataItem);
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    // close the editor
    grid.closeRow(rowIndex);
    // reset the helpers
    this.editedRowIndex = undefined;
  }

  // for edit and update form

  ProductForm!: FormGroup;
  userForm!: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  CategoryList: any = Category;

  formSubmitHandler() {
    if (this.ProductForm.valid) {
      let payload = {
        ProductID: 2,
        ProductName: this.ProductForm.controls['ProductName'].value,
        SupplierID: this.ProductForm.controls['SupplierID'].value,
        CategoryID: this.ProductForm.controls['Category'].value,
        QuantityPerUnit: this.ProductForm.controls['QuantityPerUnit'].value,
        UnitPrice: this.ProductForm.controls['UnitPrice'].value,
        UnitsInStock: this.ProductForm.controls['UnitsInStock'].value,
        UnitsOnOrder: this.ProductForm.controls['UnitsOnOrder'].value,
        ReorderLevel: this.ProductForm.controls['ReorderLevel'].value,
        Discontinued: this.ProductForm.controls['Discontinued'].value,
        Category: {
          CategoryID: this.ProductForm.controls['Category'].value,
          CategoryName: this.CategoryList.find(
            (val: any) =>
              val.CategoryID == this.ProductForm.controls['Category'].value
          ).CategoryName,
          Description: this.CategoryList.find(
            (val: any) =>
              val.CategoryID == this.ProductForm.controls['Category'].value
          ).Description,
        },
        FirstOrderedOn: this.ProductForm.controls['ProductName'].value,
      };

    }
  }

  openAlert(type: string, dataItem: any) {
    this.commonService.confirmationInfoModal().then((result: any) => {
      //alert(result);
      switch (result) {
        case 'DELETE':
          if (type == 'TableItem') {
            let pd: any[] = JSON.parse(JSON.stringify(this.userdata));
            this.userdata = pd.filter((val) => val.id != dataItem.id);
            this.gridView = process(this.userdata, this.state);
            this.ref.detectChanges();
          }
          break;
        default:
          break;
      }
    });
  }
  openPopup(event: any) {
    console.log('opening popup');
  }
  showToast() {
    this.commonService.showToaster('Data has been deleted', true);
  }
  overlay = false;
  selectItem = 'CA';
  dataList = data2;
  languageList = LanguageListRaw
  timeZonelist = TimeZoneListRaw
  currencyList = currencyRaw
  open(key: string, event: any) {
    console.log(key, event);
  }

  close(key: string, event: any) {
    console.log(key, event);
  }

  focus(key: string, event: any) {
    console.log(key, event);
  }

  blur(key: string, event: any) {
    console.log(key, event);
  }

  change(key: string, event: any) {
    console.log(key, event);
  }

  search(key: string, event: any) {
    console.log(key, event);
  }
  update(event: Select2UpdateEvent<any>) {
    console.log(event);
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
}
