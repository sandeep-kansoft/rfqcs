import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FilterDescriptor, SortDescriptor, State, filterBy, orderBy, process } from '@progress/kendo-data-query';
import { IItemAmountInfo, ITaxesDataDto } from 'src/app/modules/event/event.interface';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-tax-pop-up',
  templateUrl: './tax-pop-up.component.html',
  styleUrls: ['./tax-pop-up.component.scss']
})
export class TaxPopUpComponent {

  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  twoDecimalRegex: RegExp;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };


  serachText: string = '';
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;

  @Input() taxChargesList: ITaxesDataDto[] = []
  @Input() itemAmountInfo: IItemAmountInfo;
  gridViewTaxCharge: GridDataResult;
  headerStyle = 'fw-bold';

  showButton: boolean = false;
  otherCode: string = '';
  otherTax: number = 0;

  constructor(private modal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService
  ) {

  }

  public ngOnInit() {
this.twoDecimalRegex=this.commonService.twoDecimalRegex;
    this.taxChargesList.map((val: ITaxesDataDto) => {
      if (val.code == this.itemAmountInfo.taxCode) {
        val.isEnabled = true;
      }
      else {
        val.isEnabled = false;
      }
    })

    let isEnabledList = this.taxChargesList.filter((val: ITaxesDataDto) => val.isEnabled);
    if (isEnabledList.length == 0) {
      this.otherCode = this.itemAmountInfo.taxCode;
      this.otherTax = this.itemAmountInfo.gsT_VAT;
      this.showButton = true;
      this.cdr.detectChanges();
    }

    this.loadData(this.taxChargesList);
  }

  close() {
    this.modal.dismiss();
  }
  // otherTaxChangeHandler(){

  // }

  saveOtherTaxData() {
    if (this.otherCode == undefined || this.otherCode == '') {
      this.commonService.showToaster('Please enter HSN code.', false);
      return;
    }

    if (this.otherTax == undefined || this.otherTax == 0) {
      this.commonService.showToaster('Please enter tax.', false);
      return;
    }
    if(!this.commonService.twoDecimalRegex.test(this.otherTax.toString())){
           this.commonService.showToaster("Tax cannot exceed more than two decimal places",false);
              return;
          }


    let otherItem: ITaxesDataDto = {
      code: this.otherCode,
      tax: 0,
      cgst: 0,
      sgst: 0,
      igst: 0
    }

    if (this.itemAmountInfo.taxType == 'GST')
      otherItem.igst = this.otherTax;
    else
      otherItem.tax = this.otherTax;

    this.modal.dismiss(otherItem);

  }


  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.taxChargesList);
    }
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.taxChargesList = data;

    this.gridViewTaxCharge = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
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

    this.otherCode = inputValue;

    let filterData = this.getFilteredData(inputValue);
    this.showButton = filterData.length == 0 ? true : false;
    this.gridViewTaxCharge = process(filterData, this.state);
  }

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.taxChargesList, {
        filters: [
          {
            filters: [
              {
                field: 'code',
                operator: 'contains',
                value: inputValue,
              }
            ],
            logic: 'or',
          },
        ],
        logic: 'or',
      });
    } else {
      return filterBy(this.taxChargesList, this.filter);
    }
  }


  checkBoxSelectedHandler(item: any, index: number) {
    if (item.isEnabled) {
      this.modal.dismiss(item);
    } else {
      let otherItem: ITaxesDataDto = {
        code: this.otherCode,
        tax: 0,
        cgst: 0,
        sgst: 0,
        igst: 0
      }
      this.modal.dismiss(otherItem);

    }
  }
  previousOtherTax:any
  taxChangeHandler(event:any){
    console.log("this is other tax",event.target.value)
    if(event.target.value==''){
      return;
    }
if(this.twoDecimalRegex.test(event.target.value)){
  this.otherTax=event.target.value;
  this.previousOtherTax=this.otherTax;

}
else{
  event.target.value=this.previousOtherTax;
  event.preventDefault();
  this.commonService.showToaster("The other tax cannot exceed more than two decimal values.",false)
}
  }
}
