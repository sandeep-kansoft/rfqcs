import { Component, ChangeDetectorRef, Input } from '@angular/core';
import {
  ComparisonVendorParam,
  IDefaultResponseDto,
  IPriceBidResultDataDto,
  IRfqDetailDataDto,
  IheaderBidComparision,
  ItemBidComparison,
  ItemBidComparisonData,
  IviewCsResponseDto,
} from '../../event.interface';
import { State } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from '../../event.service';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { forkJoin, map } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-line-information',
  templateUrl: './line-information.component.html',
  styleUrls: ['./line-information.component.scss'],
})
export class LineInformationComponent {
  @Input() rfqDetail: IRfqDetailDataDto;
  @Input() csId: number;
  @Input() isExpandAll: boolean = false;
  @Input() hiddenColumns: string[] = []
  dummyDataIterator: any = [1];
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  longColumnWidth = 200;
  loading: boolean = false;
  authData: AuthModel | null | undefined;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  itemBidComparisonsList: ItemBidComparison[] = [];

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private eventService: EventService
  ) {
    this.authData = this.commonService.getAuthData();
  }

  public ngOnInit() {
    this.getBidComparisonServiceCall();
  }

  expandAll() {
    this.itemBidComparisonsList.map((val: any) => (val.isShow = true));
  }

  collapseAll() {
    this.itemBidComparisonsList.map((val: any) => (val.isShow = false));
  }
  getValueFromKey(key: any, params: any) {
    let valueItem = params.filter((val: any) => val.key == key)[0];
    if (valueItem) {
      return valueItem.value;
    } else {
      return '-';
    }
  }

  getBidComparisonServiceCall() {
    let csIdVal = 0;
    if (this.csId) {
      csIdVal = this.csId;
    } //this.loading = true;
    this.itemBidComparisonsList = []
    this.eventService
      .getBidComparison(this.rfqDetail.eventid, csIdVal)
      .subscribe({
        next: (result: any) => {
          this.loading = false;
          this.itemBidComparisonsList = result.data.itemBidComparisons.map((val: ItemBidComparison) => {
            val.subItemBidComparisons = []
            val.subItemParamList = [{ key: 'QTY', value: 'Qty' }, { key: 'REMARKS', value: 'Remarks' }] as ComparisonVendorParam[];
            return val
          }).reverse()
          // console.log.('the details ', this.itemBidComparisonsList);
          if (this.isExpandAll) {
            this.expandAll();
          }

          // if (this.rfqDetail.templateId == 2) {
          // this.getLineSubItemInformation()
          // }

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }




  getVendorList() {

  }

  viewCs() {

  }



  showRoundCondition(roundName: string): boolean {
    return this.hiddenColumns.indexOf(roundName) > -1
  }
  // loadDatacommercialTNC(data: any[]) {
  //   console.log("commerical tnc", data)

  //   this.commercialTNCGrid = process(filterData, this.state);
  // }
}
