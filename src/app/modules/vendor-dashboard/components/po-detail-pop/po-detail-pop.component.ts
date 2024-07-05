import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SortDescriptor } from '@progress/kendo-data-query';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-po-detail-pop',
  templateUrl: './po-detail-pop.component.html',
  styleUrls: ['./po-detail-pop.component.scss']
})
export class PoDetailPopComponent {

  columnWidth = 150;
  public gridView: GridDataResult;
  headerStyle = 'fw-bold';
  smallColumnWidth = 120;
  longColumnWidth = 200;
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  middleColumnWidth = 100;
  MediumColumnWidth = 130;
  LargeColumnWidth = 170;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;

  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  authData: any;
  tempdata:any= [
    {
      "itemId":"1021312321",
      "productName":"Clicker (Cement Grade)",
      "quantity":"2",
      "unit":"NOS",
      "unitPrice":"20.00",
      "otherCharges":"20.00",
      "extraCharges":"",
      "netAmount":"",
      "action":""

    }
  ]
  serachText: string = '';
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  constructor(
    private popupModel: NgbModal
  ) {
    this.gridView = process(this.tempdata,this.state);
  }

  CloseModel(){
    // alert("test");
    this.popupModel.dismissAll();
  }
}
