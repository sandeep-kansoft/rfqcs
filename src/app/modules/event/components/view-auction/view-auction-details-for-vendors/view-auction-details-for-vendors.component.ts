import { Component } from '@angular/core';
import { ChangeDetectorRef, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  State,
} from '@progress/kendo-data-query';
import { ExcelExportEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { EventService } from 'src/app/modules/event/event.service';
import { IDefaultResponseDto, IGetCSReviewDto } from 'src/app/modules/event/event.interface';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
  selector: 'app-view-auction-details-for-vendors',
  templateUrl: './view-auction-details-for-vendors.component.html',
  styleUrls: ['./view-auction-details-for-vendors.component.scss']
})
export class ViewAuctionDetailsForVendorsComponent {

  @Input() EventId: number;
  @Input() VendorId: number
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
  auctionDetailForVendor: any = []

  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  authData: any;

  serachText: string = '';
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  constructor(
    private popupModel: NgbActiveModal,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private commonServices: CommonService
  ) {

  }


  ngOnInit() {
    this.getAuctionDetailsForVendors()
  }
  closeModel() {
    // alert("test");
    this.popupModel.dismiss();
  }

  getAuctionDetailsForVendors() {
    this.loading = true;
    this.eventService.getAuctionDetailsForVendors(this.EventId, this.VendorId).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.loading = false;
          this.loadData(result.data)

        } else {
          this.loading = false;
          this.commonServices.showToaster(result.errorDetail, false)
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }


  getTimeFormat(date: string): string {
    return date ? this.commonServices.getDateFormatString(date, 'DD-MMM-YYYY') : ''
  }


  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.auctionDetailForVendor = data;
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges()
  }


  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.auctionDetailForVendor);
    }
  }

}
