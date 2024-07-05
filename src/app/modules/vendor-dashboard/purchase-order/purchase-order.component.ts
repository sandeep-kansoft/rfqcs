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
import { PoDetailPopComponent } from '../components/po-detail-pop/po-detail-pop.component';
@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent {
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
      "poNo":"102PO2308749",
      "createdBy":"DHARMENDRA SONI",
      "poValue":"23424",
      "createdDate":"06/02/2023 16:08:48",
      "deliveryDate":"31/03/2023 00:00:00	",
      "prNo":"23421434",
      "site":"Nimbahera-Cement Plant",
      "projectName":"rfqcs",
      "projectStatus":"Open Order",
      "Action":""
    }
  ]
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;

  dropdownListdata = ['Buyer Remarks', 'Approve', 'Reject', 'Export', 'Review'];
  refreshComponent: boolean = true;
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
    isSiteVisible: false,
  };
  serachText: string = '';
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  constructor(private addVendorModel: NgbModal,
    private commonService:CommonService) {
      this.gridView = process(this.tempdata,this.state);
  }
  actionOptions() {
    return this.dropdownListdata
  }
  onModelClicked(item:any, value:string) {
    switch(value) {
      case "PONO":
      this.addVendorModel.open(PoDetailPopComponent,{
        centered: true,
        size: 'lg',
        scrollable: true});
      break;
      default:
        break;
    }
    // switch(value) {
    //   case "Buyer Remarks":
    //     this.addVendorModel.open(RemarkSubmitPopupComponent,{
    //       centered: true,
    //       size: 'lg',
    //       scrollable: true});
    //     break;
    //   case "Approve":
    //       this.Aproove(item);
    //       break;
    //   case "Reject":
    //       this.Reject(item);
    //   break;
    //   case "Review" :
    //       this.addVendorModel.open(ReviewPendingCsPopupComponent,{
    //         centered: true,
    //       size: 'lg',
    //       scrollable: true
    //       })
    //   break;
    //   default:
    //     break;

    // }
  }
}
