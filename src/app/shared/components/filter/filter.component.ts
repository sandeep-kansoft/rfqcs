import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import {
  ICustomFilterDataDto,
  IDateRangeDataDto,
} from '../../services/common.interface';
import { CommonService } from '../../services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Input() prNo: string;
  @Input() department: string;
  public range: any = { start: new Date(), end: new Date() };

  @Input() customFilter: any;
  customFilterHere: ICustomFilterDataDto;

  dateRangeList: IDateRangeDataDto[] = [];

  public disabledDates = (date: Date): boolean => {
    // if (moment(date) < moment(moment().subtract(1, 'year'))) {
    //   return true;
    // }
    return false;
  };
  //dateRangeSelectedHere :IDateRangeDataDto;
  rangeType: string;
  constructor(
    public activeOffcanvas: NgbActiveOffcanvas,
    private commonService: CommonService
  ) {}

  public ngOnInit() {
    this.dateRangeList = this.commonService.dateRangeList;
    this.customFilterHere = JSON.parse(this.customFilter);
    this.rangeType = this.customFilterHere?.dateRangeSelected?.rangeType;
    this.setSelectionRange();
  }

  filterButton(isReset: boolean = false) {
    debugger;
    if (isReset) {
      this.customFilterHere.dateRangeSelected =
        this.commonService.getDefaultDateRange();
      this.customFilterHere.prNo = '';
      this.customFilterHere.department = '';
      this.customFilterHere.ppoNumber = '';
      this.customFilterHere.ItemNumber = '';
      this.customFilterHere.site = '';
      this.setSelectionRange();
    } else {
      if (
        (this.customFilterHere.dateRangeSelected?.endDate -
          this.customFilterHere.dateRangeSelected?.startDate) /
          86400000 >
        366
      ) {
        this.commonService.showToaster(
          'custom date range cannot be greater than 366 days',
          false
        );
      } else {
        this.activeOffcanvas.dismiss(this.customFilterHere);
      }
      // console.log("this is date range",(((this.customFilterHere.dateRangeSelected?.endDate)-(this.customFilterHere.dateRangeSelected?.startDate))/86400000))
    }
    // this.getALLMyPrList();
  }

  // setFilter() {
  //   switch (this.customFilterHere.rangeType) {
  //     case 'LAST_30_DAYS':
  //       this.customFilterHere.rangeName = 'Last 30 Days';
  //       this.customFilterHere.days = 30;
  //       break;
  //     case 'LAST_3_MONTHS':
  //       this.customFilterHere.rangeName = 'Last 3 Months';
  //       this.customFilterHere.days = 90;
  //       break;
  //     case 'LAST_YEAR':
  //       this.customFilterHere.rangeName = 'Last Year';
  //       this.customFilterHere.days = 365;
  //       break;
  //     case 'CUSTOM_RANGE':
  //       this.customFilterHere.rangeName = 'Custom Range';
  //       this.customFilterHere.days = 0;
  //       return '';
  //     default:
  //       return '';
  //   }
  // }

  setSelectionRange() {
    setTimeout(() => {
      this.range.start = this.customFilterHere.dateRangeSelected?.startDate
        ? new Date(this.customFilterHere.dateRangeSelected?.startDate)
        : null;
      this.range.end = this.customFilterHere.dateRangeSelected?.endDate
        ? new Date(this.customFilterHere.dateRangeSelected?.endDate)
        : null;
    }, 10);
  }

  close() {
    this.activeOffcanvas.dismiss();
  }

  onChange(e: any) {
    debugger;
    this.range = e;
    this.customFilterHere.dateRangeSelected.startDate = this.range.start;
    this.customFilterHere.dateRangeSelected.endDate = this.range.end;
  }

  getCustomDateRange(type: string) {
    return type === 'CUSTOM_RANGE'
      ? ` (${
          this.customFilterHere.dateRangeSelected?.startDate != undefined
            ? this.commonService.getDateFormatString(
                this.customFilterHere.dateRangeSelected?.startDate,
                'DD/MM/YYYY'
              )
            : ''
        } - ${
          this.customFilterHere.dateRangeSelected?.endDate != undefined
            ? this.commonService.getDateFormatString(
                this.customFilterHere.dateRangeSelected?.endDate,
                'DD/MM/YYYY'
              )
            : ''
        })`
      : '';
  }

  dateRangeTypeChange(event: any) {
    debugger;
    this.rangeType = event.target.value;
    this.customFilterHere.dateRangeSelected = this.dateRangeList.filter(
      (val: any) => val.rangeType == this.rangeType
    )[0];
  }
}
