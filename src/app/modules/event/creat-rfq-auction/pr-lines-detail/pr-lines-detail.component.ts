import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { filterBy, FilterDescriptor, orderBy, process, SortDescriptor, State } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/shared/services/common.service';
import { categoryDetail } from '../data';

@Component({
  selector: 'app-pr-lines-detail',
  templateUrl: './pr-lines-detail.component.html',
  styleUrls: ['./pr-lines-detail.component.scss']
})
export class PrLinesDetailComponent implements OnInit {


  linesDataLoading: boolean = false;

  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    // take: 10,
  };

  loading: boolean = true;
  @Input() prLineData: any[];
  prLineDataHere: any[];
  threeDecimalRegex: RegExp;


  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;

  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  public gridView: GridDataResult;
  @Input() public category: any;
  @Output() updateCountEmitter = new EventEmitter<object>();

  isInvalidate: boolean = false;
  isError = false;
  errorFromServer: any;
  errorMessage = '';

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {
    this.loading = true;
    //this.loadData(categoryDetail)

  }

  public ngOnInit(): void {
    this.prLineDataHere = JSON.parse(JSON.stringify(this.prLineData));
    this.loadData(this.prLineDataHere);
    this.threeDecimalRegex = this.commonService.threeDecimalRegex
  }


  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
    this.loading = false;
  }

  // getValidation(controlName: string) {
  //   let control: AbstractControl<any, any> | null =
  //     this.formGroup.get(controlName);
  //   return (
  //     (this.isInvalidate && control?.invalid) ||
  //     this.checkErrorMessageFromServerForField(controlName)
  //   );
  // }

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

  checkValueCheckbox(rowIndex:number) {
    let count: any = this.prLineData.filter((val: any) => val.isEnabled).length;
    if(this.prLineDataHere[rowIndex].isEnabled){
      this.prLineDataHere[rowIndex].enterQty=this.prLineDataHere[rowIndex].remqty;
    }
else{
  this.prLineDataHere[rowIndex].enterQty='';
}
    //this.updateCountEmitter.emit(count);
  }



  getValidation(item: any) {
    return (
      this.isInvalidate &&
      item.isEnabled &&
      (item.enterQty === undefined || item.enterQty === 0 ||
        item.enterQty > item.remqty ||
        item.enterQty < item.remqty) && !this.threeDecimalRegex.test(item.enterQty)
    );
  }


  submitPrLine() {
    let data = this.prLineDataHere.filter((val) => val.isEnabled);


    let isValid = data.every((val) => {
      let qtyValid = val.enterQty > 0 && val.enterQty <= val.remqty;
      console.log("this is quantity",qtyValid)
      if(!qtyValid){
        this.isInvalidate = true;
        this.commonService.showToaster('Enter Qty can not be greater than remaining Qty',false)
        this.cdr.detectChanges();
        return;
      }
      if (qtyValid && !this.threeDecimalRegex.test(val.enterQty)) {
        this.commonService.showToaster('The value cannot exceed more than three decimal values.', false)
      }
      return qtyValid && this.threeDecimalRegex.test(val.enterQty)
    });


 if( isValid) {
      this.commonService.showToaster('PR Line saved successfully.', true)
      this.updateCountEmitter.emit(this.prLineDataHere);
    }
  }



}
