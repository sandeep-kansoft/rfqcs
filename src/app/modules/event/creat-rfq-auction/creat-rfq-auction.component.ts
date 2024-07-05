import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { filter } from 'rxjs';
import { PrResponseDto } from '../../purchase-requisition/purchase-requisition';
import { PurchaseRequistionServiceService } from '../../purchase-requisition/purchase-requistion-service.service';
import { EventPrLinesComponent } from '../event-pr-lines/event-pr-lines.component';
import { EventService } from '../event.service';
import { categoryList, prGridDataForRfq } from './data';
import { GridComponent } from '@progress/kendo-angular-grid';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  IPrAndLinesDetailDataDto,
  IPrLineItem,
  IPriceBidLinesListDataDto,
} from '../event.interface';
import { PrModalViewComponent } from '../../purchase-requisition/pr-modal-view/pr-modal-view.component';

@Component({
  selector: 'app-creat-rfq-auction',
  templateUrl: './creat-rfq-auction.component.html',
  styleUrls: ['./creat-rfq-auction.component.scss'],
})
export class CreatRfqAuctionComponent {
  @ViewChildren(GridComponent) private grids: QueryList<GridComponent>;
  formGroup!: FormGroup;
  loading = false;
  saveRfqloading = false;
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  isAuctionModelVisible: boolean = false

  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;
  currentSelectedPage = 'form';
  public gridView: GridDataResult;
  public selectedPRLineGridView: GridDataResult;
  public selectedPRLineList: any;
  public priceBidLinesList: IPriceBidLinesListDataDto[] = [];
  public eventId: number;
  public pageType: string;

  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  overviewdata: any[] = [];
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  isInvalidate: boolean = false;
  isError = false;
  errorFromServer: any;
  errorMessage = '';
  private prData: any;
  serachText: string = '';
  @ViewChild('grid') gridTemplate: ElementRef;

  constructor(
    public fb: FormBuilder,
    private prservice: PurchaseRequistionServiceService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private prLineModal: NgbModal,
    private router: Router,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private prLineViewModel: NgbModal
  ) {
    this.formGroup = this.fb.group({
      typeOfRfq: ['RFQ', [Validators.required]],
      typeOfAuction: ['REVAUC'],
      AuctionMode: ['Both'],
      title: ['', [Validators.required]],
      description: ['', Validators.required],
    });
  }

  public ngOnInit() {
    let data = JSON.parse(history.state.data);
    if (data) {
      this.priceBidLinesList = data.PriceBidLinesList;
      this.eventId = data.EventId;
      this.pageType = data.PageType;
      if (this.pageType == 'PRICE_BID') {
        this.currentSelectedPage = 'mypr';
        this.getPrAndLinesDetailForManualServiceCall();
      }
    }
  }

  eventFormSubmit() {
    if (this.formGroup.valid) {
      this.selectedPRLineList = [];
      //this.loadPrLineData(this.selectedPRLineList);
      this.getPrAndLinesDetailForManualServiceCall();
      this.currentSelectedPage = 'mypr';
    } else {
      this.isInvalidate = true;
    }
  }

  getPrAndLinesDetailForManualServiceCall() {
    this.loading = true;

    let data = {
      startDate: '',
      endDate: '',
      site: '',
      department: '',
    };

    this.prservice.getPrAndLinesDetailForManualRFQList(data).subscribe({
      next: (result: any) => {

        if (result.success) {
          this.loading = false;
          let dataValue: any = null;
          if (this.priceBidLinesList.length != 0) {
            dataValue = result?.data.map((prItem: IPrAndLinesDetailDataDto) => {
              let count: number = 0;
              let prItemFlag = prItem.prLineItems.map(
                (prLineItem: IPrLineItem) => {
                  let item = this.priceBidLinesList.filter(
                    (priceBidItem: IPriceBidLinesListDataDto) =>
                      prLineItem.prtransid == priceBidItem.prtransid
                  );
                  if (item.length != 0) {
                    prLineItem.isEnabled = true;
                    count++;
                  } else {
                    prLineItem.isEnabled = false;
                  }
                  return prLineItem;
                }
              );

              prItem.lineCount = count;
              prItem.prLineItems = prItemFlag;
              return prItem;
            });
          }

          if (dataValue) this.prData = dataValue;
          else this.prData = result.data;

          this.loadData(this.prData);
        }
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      },
    });
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.overviewdata = data;
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
    this.loading = false;
  }

  loadPrLineData(data: any) {
    this.selectedPRLineList = data;
    this.selectedPRLineGridView = {
      data: data,
      total: data.length,
    };
    this.cdr.detectChanges();
  }

  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.prData);
    }
  }

  onItemClick(item: any, index: number) {
    let isEditMode: boolean = false;
    if (item.itemSelected != 0) {
      isEditMode = true;
    }
    this.openPREventLine(item, index, isEditMode);
  }

  openPREventLine(
    item: PrResponseDto,
    index: number,
    isEditMode: boolean = false
  ) {
    const modelRef = this.prLineModal.open(EventPrLinesComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });

    let lineData = [];
    if (isEditMode) {
      lineData = this.selectedPRLineList.filter(
        (val: any) => item.prid == val.prid
      );
    }

    modelRef.componentInstance.isEditMode = isEditMode;
    modelRef.componentInstance.editLineData = lineData;
    modelRef.componentInstance.prId = item?.prid;
    modelRef.componentInstance.prNumber = item?.pR_NUM;
    modelRef.result.then(
      (err) => {
      },
      (data) => {
        if (data) {
          this.overviewdata[index].itemSelected = data.length;

          if (isEditMode) {
            let newList = this.selectedPRLineList.filter(
              (val: any) => val.prid != item.prid
            );
            this.loadPrLineData([...newList, ...data]);
          } else {
            this.loadPrLineData([...this.selectedPRLineList, ...data]);
          }

          this.loadData(this.overviewdata);
        }
      }
    );
    // modelRef.componentInstance.prLinesListEmitter = (test: any) => {
    //   alert('this is called', test);
    // };
  }

  //Validations
  getValidation(controlName: string) {
    let control: AbstractControl<any, any> | null =
      this.formGroup.get(controlName);
    return (
      (this.isInvalidate && control?.invalid) ||
      this.checkErrorMessageFromServerForField(controlName)
    );
  }
  checkErrorMessageFromServerForField(type: any) {
    switch (type) {
      case 'typeOfRfq':
        break;
      case 'title':
        return this.errorFromServer?.invalidValues?.shortCode ? true : false;
      default:
        return false;
    }
    return false;
  }

  backButtonClick() {
    if (this.pageType == 'PRICE_BID') {
      history.back();
    } else {
      switch (this.currentSelectedPage) {
        case 'form':
          this.selectedPRLineList = [];
          history.back();
          break;
        case 'mypr':
          this.currentSelectedPage = 'form';
          break;

        default:
          break;
      }
    }
  }

  createRfqManualHandler() {
    if (!this.saveRfqloading) {
      this.createRfqManually();
    }
  }

  createRfqManually() {
    this.selectedPRLineList = [];
    this.prData.filter((item1: any) => {
      let item: any = {
        ...item1,
        prLineItems: item1.prLineItems.filter(
          (data: any) => data.isEnabled != undefined && data.isEnabled
        ),
      };

      if (item.prLineItems.length != 0) {
        item.prLineItems.forEach((element: any) => {
          this.selectedPRLineList.push(element);
        });
        return item;
      }
    });

    if (this.selectedPRLineList.length == 0) {
      this.commonService.showToaster('Please select pr lines.', false);
      return;
    }

    let prDtoLIst = this.selectedPRLineList.map((val: any) => {
      let item: any = {};
      item.pR_ID = val.prid;
      item.pR_TranId = val.prtransid;
      item.qty = val.enterQty;
      item.line = 0;

      return item;
    });

    if (this.pageType == 'PRICE_BID') {
      this.updateRfqServiceCall(prDtoLIst);
    } else {
      this.createRfqManuallyServiceCall(prDtoLIst);
    }
  }

  eventTypeMappingEnum(type: string): string {
    switch (type) {
      case 'RFQ':
        return '1';
        break;
      case 'FWDAUC':
        return '2';
        break;
      case 'REVAUC':
        return '3';
        break;

      default:
        break;
    }

    return '';
  }

  createRfqManuallyServiceCall(prDtoLIst: any) {
    const data = document.getElementById('sumbitbtn');
    data?.setAttribute('data-kt-indicator', 'on');
    this.saveRfqloading = true;

    let payload = {
      eventtype: this.eventTypeMappingEnum(
        this.formGroup.get('typeOfRfq')?.value == 'RFQ'
          ? this.formGroup.get('typeOfRfq')?.value
          : this.formGroup.get('typeOfAuction')?.value
      ),
      eventName: this.formGroup.get('title')?.value,
      eventDescription: this.formGroup.get('description')?.value
        ? this.formGroup.get('description')?.value
        : '',
      eventColorCode: "Both",
      prDto: prDtoLIst,
    };
    this.eventService.createRFQManually(payload).subscribe({
      next: (result: any) => {
        this.saveRfqloading = false;
        data?.removeAttribute('data-kt-indicator');

        if (result.success) {
          this.commonService.showToaster('RFQ created successfully.', true);
          // this.router.navigate(
          //   ['/Event/EventDashboard', { EventId: result.data }],
          //   { skipLocationChange: true }
          // );
          this.router.navigate(['/Event/EventDashboard'], {
            state: { EventId: result.data },
          });
        } else {
          this.commonService.showToaster(result.errorDetail, false);
        }

        // let dataValue = result?.data;
      },
      error: (err) => {
        this.saveRfqloading = false;
        if (err.errorDetail || err.ErrorDetail) {
          this.commonService.showToaster(err.errorDetail ? err.errorDetail : err.ErrorDetail, false);
        }
        data?.removeAttribute('data-kt-indicator');
        console.log(err);
      },
    });
  }

  updateRfqServiceCall(prDtoLIst: any) {
    const data = document.getElementById('sumbitbtn');
    data?.setAttribute('data-kt-indicator', 'on');
    this.saveRfqloading = true;

    const payload: any = {
      eventid: this.eventId,
      prDto: prDtoLIst,
    };

    this.eventService.UpdateRFQApi(payload).subscribe({
      next: (result: any) => {
        this.saveRfqloading = false;
        data?.removeAttribute('data-kt-indicator');

        if (result.success) {
          this.commonService.showToaster(
            'RFQ/Auction updated successfully.',
            true
          );
          history.back();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
          this.cdr.detectChanges();

        }
      },
      error: (err) => {
        if (err.errorDetail || err.ErrorDetail) {
          this.commonService.showToaster(err.errorDetail ? err.errorDetail : err.ErrorDetail, false);
        }
        this.saveRfqloading = false;
        data?.removeAttribute('data-kt-indicator');
        console.log(err);
      },
    });
  }

  saveList() {
    const filteredList = this.prData.filter((item1: any, index: number) => {
      let item: any = {
        ...item1,
        prLineItems: item1.prLineItems.filter(
          (data: any) => data.isEnabled != undefined && data.isEnabled
        ),
      };

      if (item.prLineItems.length != 0) {
        return item;
      }
    });
  }

  onFilterAllField(event: any) {
    //console.log("Value : ", event.target.value);

    let inputValue: any = '';
    if (event) {
      inputValue = event.target.value;
      this.serachText = inputValue;
    } else {
      inputValue = this.serachText;
    }

    //let filterData = this.getFilteredData(inputValue);
    const filteredList = this.prData.filter((item1: any) => {
      let item: any = {
        ...item1,
        prLineItems: item1.prLineItems.filter(
          (data: any) =>
            data.iteM_DESCRIPTION
              .toLowerCase()
              .includes(inputValue.toLowerCase()) ||
            data.itemcode.toLowerCase().includes(inputValue.toLowerCase())
        ),
      };

      if (item.prLineItems.length != 0) {
        return item;
      } else if (
        item.prDescription.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.prNum.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.project_name.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.siteName.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.department.toLowerCase().includes(inputValue.toLowerCase())
      ) {
        return item;
      }
    });

    this.gridView = process(filteredList, this.state);
  }

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.prData, {
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
      return filterBy(this.prData, this.filter);
    }
  }

  updateUserDetail(prLineData: any, item: any, topGrid: any, index: number) {
    let count: any = prLineData.filter((val: any) => val.isEnabled).length;
    item.lineCount = count;
    item.prLineItems = prLineData;
    topGrid.collapseRow(index);
  }

  public collapseAll(topGrid: any) {
    this.prData.forEach((item: any, idx: any) => {
      topGrid.collapseRow(idx);
    });
  }

  public expandAll(topGrid: any) {
    this.prData.forEach((item: any, idx: any) => {
      topGrid.expandRow(idx);
    });

    setTimeout(() => {
      this.grids.toArray().forEach((grid) => {
        if ((<any[]>grid.data).length) {
          (<any[]>grid.data).forEach((item, idx) => {
            grid.expandRow(idx);
          });
        } else {
          (<GridDataResult>grid.data).data.forEach((item, idx) => {
            grid.expandRow(idx);
          });
        }
      });
    });
  }

  openLinesModel(item?: PrResponseDto, isPrNumberClick: boolean = false) {
    const modelRef = this.prLineViewModel.open(PrModalViewComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });

    modelRef.componentInstance.prId = item?.prid;
    modelRef.componentInstance.prNumber = item?.prNum;
    modelRef.componentInstance.isPrNumberClick = isPrNumberClick;
  }
}
