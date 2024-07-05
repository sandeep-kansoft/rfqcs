import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FilterDescriptor, SortDescriptor, State, filterBy, orderBy, process } from '@progress/kendo-data-query';
import { IDefaultResponseDto, IPoHistoryDto } from '../../../event.interface';
import { EventService } from '../../../event.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-price-bid-po-history',
  templateUrl: './price-bid-po-history.component.html',
  styleUrls: ['./price-bid-po-history.component.scss']
})
export class PriceBidPoHistoryComponent {
  @Input() itemCode: string;
  isLoading: boolean = false
  public gridView: GridDataResult;
  poHistoryData: IPoHistoryDto[] = []
  updatedPoHistoryList:IPoHistoryDto[]
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  noDataFound: boolean = false

  constructor(private activeModel: NgbActiveModal, private cdr: ChangeDetectorRef, private eventService: EventService, private commonService: CommonService) {

  }

  ngOnInit() {
    this.getPOHistory()
  }

  closeModel() {
    this.activeModel.dismiss()
  }


  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };


  public onStateChange(state: any) {
    if (!this.isLoading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.poHistoryData);
    }
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.poHistoryData = data;
    this.gridView = process(filterData, this.state);

    this.cdr.detectChanges()
  }

  getPOHistory() {
    this.isLoading = true
    this.eventService.getPOHistory(this.itemCode).subscribe({
      next: (result: IDefaultResponseDto<IPoHistoryDto[]>) => {
        if (result.success) {

          if (result.data.length != 0) {
            this.isLoading = false
            // let data = result.data.map(val => {
            //   new Date(
            //     new Date((val.podate as any).split('T')[0]).setHours(0, 0, 0)
            //   );
            //   val.podate = new Date(val.podate)
            //   return val
            // })
            this.updatedPoHistoryList=result.data;

            for(let i=0;i<this.updatedPoHistoryList.length;i++){
              if(this.updatedPoHistoryList[i].poqty!=0){
              this.updatedPoHistoryList[i].unitprice=this.commonService.getFixedDecimalValue((this.updatedPoHistoryList[i].porate - (this.updatedPoHistoryList[i].porate * (this.updatedPoHistoryList[i].discPercent/100)))*this.updatedPoHistoryList[i].poqty);

            }
            else{
              this.updatedPoHistoryList[i].unitprice=this.updatedPoHistoryList[i].porate;
            }

          }
            this.loadData(this.updatedPoHistoryList);
          } else {
            this.noDataFound = true;
            this.isLoading = false
            this.cdr.detectChanges()
          }

        } else {
          this.noDataFound = true;
          this.isLoading = false
          this.cdr.detectChanges()
        }

      },
      error: (err) => {
        this.isLoading = false
      },
    });
  }



}
