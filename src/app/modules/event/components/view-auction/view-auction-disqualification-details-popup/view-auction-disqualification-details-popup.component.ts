import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../event.service';
import { IDefaultResponseDto, getDisqualificationDataDto, getDisqualificationDetailsDto } from '../../../event.interface';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FilterDescriptor, SortDescriptor, State, filterBy, orderBy,process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-view-auction-disqualification-details-popup',
  templateUrl: './view-auction-disqualification-details-popup.component.html',
  styleUrls: ['./view-auction-disqualification-details-popup.component.scss']
})
export class ViewAuctionDisqualificationDetailsPopupComponent {
  @Input() item: any;
  disqualificationDetailsHistory:any;
  loading: boolean = false;
  public gridView: GridDataResult;
  public filter: FilterDescriptor;
  pageSize = 10;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  public sort: SortDescriptor[] = [];
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  constructor(
    private ngbModal: NgbModal,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
  ) { }

  public ngOnInit() {
  console.log("this is item",this.item);
  this.disqualificationdetailsApiCall();
  }

  CloseModel() {
    // alert("test");
    this.ngbModal.dismissAll();
  }

  disqualificationdetailsApiCall(){
      this.eventService.GetdisqualificationDetails(this.item.eventId,this.item.vendorid).subscribe({
        next: (result: getDisqualificationDataDto) => {
  
          this.disqualificationDetailsHistory = result.data;
          this.loadData(this.disqualificationDetailsHistory);
         
  
        },
        error: (err) => {
          
          
        },
      });
    
  }

  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.disqualificationDetailsHistory);
    }
  }


  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.disqualificationDetailsHistory = data;

    this.gridView = process(filterData, this.state);
  
    this.cdr.detectChanges();
  }
}
