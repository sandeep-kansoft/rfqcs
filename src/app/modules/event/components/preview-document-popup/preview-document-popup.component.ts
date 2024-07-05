import { Component } from '@angular/core';
import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-preview-document-popup',
  templateUrl: './preview-document-popup.component.html',
  styleUrls: ['./preview-document-popup.component.scss']
})
export class PreviewDocumentPopupComponent {
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
      "documentName":"The-API-is-created-in-the-CommonFunctionAppService.docx",
      

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
