import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../event.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { IDefaultResponseDto, getCsLinesDto } from '../../event.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import { ShortCloseModelComponent } from '../../components/price-bid/short-close-model/short-close-model.component';

@Component({
  selector: 'app-cs-lines',
  templateUrl: './cs-lines.component.html',
  styleUrls: ['./cs-lines.component.scss']
})
export class CsLinesComponent {
  public gridView: GridDataResult;
  loading: boolean = false;
  cslinelist: getCsLinesDto
  @Input() awardId: number;
  pageSize = 10;
  headerStyle = 'fw-bold';
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  columnWidth = 150;
  smallColumnWidth = 120;
  longColumnWidth = 200;
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  middleColumnWidth = 100;
  MediumColumnWidth = 130;
  LargeColumnWidth = 170;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  shortCodeLoader: boolean = false
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  constructor(
    private csLineModal: NgbModal,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private commonServices: CommonService,
    private activeModel: NgbActiveModal,
    private ngbModel: NgbModal


  ) { }
  ngOnInit() {
    this.getCsLine();
  }

  loadData(data: any) {


    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.cslinelist = data;
    this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
  }

  getCsLine() {
    this.loading = true;
    this.eventService.GetCsLines(this.awardId).subscribe({
      next: (result: IDefaultResponseDto<getCsLinesDto>) => {

        this.cslinelist = result.data
        this.loadData(this.cslinelist);
        this.loading = false;

      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // CreatePo(item:any){

  // }
  confirmationModal(item: any) {
    if (!item.isCreatePO) {
      this.commonServices.showToaster("PO Already Created", false);
    }
    else {
      this.commonServices
        .showAlertForWarning(`Do you want To Create PO for Item Id ${item.itemCode} ?`, ``)
        .then((result) => {
          if (result) {
            this.CreatePO(item.awardTranId);
          } else {

            this.cdr.detectChanges();
          }
        });
    }
  }

  CreatePO(AwardTranId: number) {

    this.loading = true;

    this.eventService.createPoFromLine(AwardTranId, this.awardId).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.loading = false;
          this.commonServices.showToaster('PO Created Successfully', true);
          this.activeModel.close('success');
          // this.getCsLine();


          this.cdr.detectChanges();
        } else {
          this.commonServices.showToaster(result.errorDetail, false);

          this.loading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.commonServices.showToaster(err.title, false);
        this.cdr.detectChanges();
      },
    });

  }

  openShortCloseApproval() {





  }

  openShortcloseModel(item: getCsLinesDto) {
    const modelRef = this.ngbModel.open(ShortCloseModelComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });

    modelRef.componentInstance.itemCode = item.itemCode
    modelRef.componentInstance.shortcloseqty = item.shortCloseQty
    modelRef.componentInstance.eventTranId = item.awardTranId
    modelRef.result
      .then(
        (result) => {
          if (result) {
            this.shortCloseCsApproval(result.eventTranId, result.reason)
          }
        },
        () => {

        }
      )
      .catch((e) => {
        console.log('Error occured', e);
      });
  }


  shortCloseCsApproval(awardTransId: number, reason: string) {
    if (this.shortCodeLoader) return
    this.eventService.shortCloseCsApproval(awardTransId, reason).subscribe({
      next: (result) => {
        if (result.success) {
          this.shortCodeLoader = false
          this.commonServices.showToaster('Item short closed successfully', true);
          this.activeModel.close('success');

          // this.getCsLine();
        } else {
          this.shortCodeLoader = false
          this.commonServices.showToaster(result.errorDetail, false);
        }
        this.cdr.detectChanges();
      }, error: () => { }
    })
  }

  CloseModel() {
    // alert("test");
    this.csLineModal.dismissAll();
  }
  public onStateChange(state: any) {
    this.sort = state.sort;
    this.filter = state.filter;
    this.state = state;
    this.loadData(this.cslinelist);
  }

}
