import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterDescriptor, SortDescriptor, State, filterBy, orderBy, process } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/shared/services/common.service';
import { IManPowerItemDataDto, IPriceBidLinesListDataDto, IPriceBidResultDataDto } from '../../../event.interface';
import { EventService } from '../../../event.service';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-add-man-power-item',
  templateUrl: './add-man-power-item.component.html',
  styleUrls: ['./add-man-power-item.component.scss']
})
export class AddManPowerItemComponent {
  @Input() title: string;
  @Input() placeholderName: string;
  @Input() value: string;
  @Input() priceBidLinesList: IPriceBidLinesListDataDto[]
  inValidate: boolean = false;
  threeDecimalRegex: RegExp;
  public manPowerItemGridView: GridDataResult;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;

  public state: State = {};
  pageSize: number = 1;
  columnWidth = 150;
  headerStyle = 'fw-bold';
  longColumnWidth = 200;
  extraSmallColumnWidth = 50;
  smallColumnWidth = 100;
  mediumColumnWidth = 120;
  largeColumnWidth = 170;
  xtraLargeColumnWidth = 190;
  xtraXtraLargeColumnWidth = 280;

  loading: boolean = true;
  manPowerItemList: IManPowerItemDataDto[] = [];
  @Input() eventId: number;

  serachText: string;

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private activeModel: NgbActiveModal,
    private eventService: EventService
  ) {

  }


  public ngOnInit() {
    this.threeDecimalRegex = this.commonService.threeDecimalRegex
    this.getAllManpowerItemsServiceCall();
  }

  close() {
    this.activeModel.dismiss();
  }

  //All man power items
  getAllManpowerItemsServiceCall() {
    this.loading = true;
    this.eventService.getAllManpowerItems().subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        result.data.map((manPowerItem: IManPowerItemDataDto) => {
          let item = this.priceBidLinesList.filter((val: IPriceBidLinesListDataDto) => val.itemMasterId == manPowerItem.itemMasterID)
          if (item.length == 0) {
            manPowerItem.quantity = 0 ;
            this.manPowerItemList.push(manPowerItem);
          }
        })

        this.manPowerItemLoadData(this.manPowerItemList);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  save() {
    if (this.value && this.value != '') {
      this.activeModel.close(this.value);
    } else {
      this.inValidate = true;
      this.cdr.detectChanges();
    }
  }

  public onStateChange(state: any) {
    if (!this.loading) {
      // this.sort = state.sort;
      // this.filter = state.filter;
      // this.state = state;
      // let pageSize = state.skip / state.take + 1;
      // if (pageSize != this.pageNumber) {
      //   this.pageNumber = pageSize;
      //   this.getMyPrList();
      // } else {
      //   this.loadData(this.myPrData);
      // }
    }
  }

  manPowerItemLoadData(data: any) {
    this.manPowerItemList = data;
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.manPowerItemGridView = process(filterData, this.state);
  }

  checkBoxSelectedHandler(item: any, index: number) {

  }


  saveManpowerItemHandler() {
    let selectedList: any = this.manPowerItemList.filter(
      (val: any) => val.isEnabled
    );

    if (selectedList.length == 0) {
      // handle if no list is selected
      this.commonService.showToaster("Please Add Man Power Items",false);
    } else {
      // validate qty is not  0
  
      let isValid = selectedList.every((val: any) => {
        return val.quantity >= 1;
      });

     let isthreedecimalregexvalid=selectedList.every((val:any) => {
      console.log("this is entered qty",val.quantity)
        return this.threeDecimalRegex.test(val.quantity);
     });
     console.log("isThreeDecimal",isthreedecimalregexvalid);

      if (isValid &&isthreedecimalregexvalid) {
        let manPowerItemDtoList = selectedList.map((val: any) => {
          let obj = {
            itemMasterID: val.itemMasterID,
            quantity: val.quantity,
          };
          return obj;
        });


        this.saveManpowerItemServiceCall(manPowerItemDtoList);
      } else if(!isValid) {
        this.commonService.showToaster(
          'Order qty should be greater than 0.',
          false
        );
      }
      else if(!isthreedecimalregexvalid){
        this.commonService.showToaster('The qty cannot exceed more than three decimal values.',false)
      }
    }
  }

  // create rfq by ppo
  saveManpowerItemServiceCall(payload: any) {
    let node = document.getElementById('save-man-power');
    // loader on
    node?.setAttribute('data-kt-indicator', 'on');
    this.eventService.addManpowerItems(payload, this.eventId).subscribe({
      next: (result: any) => {
        // loader off
        node?.removeAttribute('data-kt-indicator');
        if (result.success) {
          this.commonService.showToaster('Man power item save successfully', true);
          this.activeModel.dismiss(true);
        } else {
          this.commonService.showToaster(result.errorDetail, false);
        }
      },
      error: (err) => {
        node?.removeAttribute('data-kt-indicator');

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
    this.manPowerItemGridView = process(filterData, this.state);
  }

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.manPowerItemList, {
        filters: [
          {
            filters: [
              {
                field: 'productNumber',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'productName',
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
      return filterBy(this.manPowerItemList, this.filter);
    }
  }


}
