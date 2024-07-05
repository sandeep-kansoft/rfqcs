import { ChangeDetectorRef, Component, Input } from '@angular/core';
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
  selector: 'app-review-pending-cs-popup',
  templateUrl: './review-pending-cs-popup.component.html',
  styleUrls: ['./review-pending-cs-popup.component.scss']
})
export class ReviewPendingCsPopupComponent {

  @Input() awardId: number
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
  awardNumber: number
  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  authData: any;
  vendorDetail : string;


  serachText: string = '';
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
    this.getCSReviewApi()
  }
  closeModel() {
    // alert("test");
    this.popupModel.dismiss();
  }

  getCSReviewApi() {
    this.loading = true;
    this.eventService.getCSReview(this.awardId).subscribe({
      next: (result: IDefaultResponseDto<IGetCSReviewDto[]>) => {
        if (result.success && result.data.length) {

          this.awardNumber = result.data[0].awardNo
          this.vendorDetail = result.data[0].vendor
          this.loading = false;
          this.gridView = process(result.data, this.state);

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
    return date ? this.commonServices.getDateFormatString(date, 'DD-MMM-YYYY HH:mm') : ''
  }
}
