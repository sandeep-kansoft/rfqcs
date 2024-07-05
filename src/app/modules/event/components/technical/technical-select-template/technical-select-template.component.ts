import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  IDefaultResponseDto,
  IGetTemplateByTypeResponseDto,
} from '../../../event.interface';
import { EventService } from '../../../event.service';

@Component({
  selector: 'app-technical-select-template',
  templateUrl: './technical-select-template.component.html',
  styleUrls: ['./technical-select-template.component.scss'],
})
export class TechnicalSelectTemplateComponent {
  loading: boolean = false;
  public gridView: GridDataResult;
  @Input() eventId: number;
  @Input() itemId: number;
  @Input() type: string;
  serachText: string = '';
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;

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

  longColumnWidth = 200;
  pageSize = 5;
  pageNumber = 1;
  errorMessage = '';
  isError = false;

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  templatesList: IGetTemplateByTypeResponseDto[] = [];
  alltemplatelist: any;

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
    private activeModel: NgbActiveModal,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    // this.loadData(dummyData);
    this.setDefaultFilter();
    this.getAllTemplatesByType();
  }

  getAllTemplatesByType() {
    this.loading = true;

    this.eventService
      .GetTemplateByTypeApi(
        this.type == 'Technical' ? 'Technical' : 'TNC',
        this.itemId
      )
      .subscribe({
        next: (result: IDefaultResponseDto<any>) => {
          this.loading = false;
          // console.log('result here is', result);
          this.templatesList = [];
          this.alltemplatelist = result;
          this.loadData(result.data);

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
    this.templatesList = data;
    // console.log('data', typeof data[0].enterdate);
    // this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
    else {
      this.gridView = process(filterData, this.state);
    }
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
      return filterBy(this.templatesList, {
        filters: [
          {
            filters: [
              {
                field: 'templateName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'templateValue',
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
      return filterBy(this.templatesList, this.filter);
    }
  }

  closeModel() {
    this.activeModel.dismiss();
  }

  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.templatesList);
    }
  }

  closeFilter() {
    if (this.customFilter.dateRangeSelected?.rangeType == 'LAST_30_Days') {
      //show alert here
    } else {
      this.setDefaultFilter();
      this.getAllTemplatesByType();
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

  saveButtonHandler() {
    let dataChecked = this.templatesList
      .filter((val) => val.isChecked)
      .map((val) => {
        delete val.isChecked;
        return val;
      });

    if (dataChecked.length == 0) {
      this.showErrorMessage(true, 'Please some templates');
      // this.activeModel.dismiss();
    } else {
      this.activeModel.close(dataChecked);
    }
  }

  showErrorMessage(status: boolean, errMessage: string = '') {
    this.commonService.showToaster(errMessage, false);
  }

  showTemplateValue(value: string): string {
    if (!value) {
      return '';
    }

    let result: any = '';
    {
      let data = JSON.parse(value);
      data.forEach((val: any) => {
        if (this.type == 'Technical') {
          result +=
            val.Parameter +
            ' (' +
            (val.Mandatory ? 'Mandatory' : 'Non-Mandatory') +
            '), ';
        } else {
          result += val.terms + ', ';
        }
      });
    }

    return result;
  }
}

let dummyData = [
  { templateName: 'test', templateValue: 'dummy data', isChecked: false },
  { templateName: 'test', templateValue: 'dummy data', isChecked: false },
  { templateName: 'test', templateValue: 'dummy data', isChecked: false },
];
