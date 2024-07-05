import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { IReverseAuctionViewerList, IRfqDetailDataDto } from '../../../event.interface';

import { FilterDescriptor, SortDescriptor, State, filterBy, orderBy, process } from '@progress/kendo-data-query';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from '../../../event.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';


@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent {
  serachText: string = '';
  isLoading: boolean = false;
  loading: boolean = false;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  public gridView: GridDataResult;
  reverseAuctionViewerList: IReverseAuctionViewerList[] = []
  @Input() rfqDetail: IRfqDetailDataDto;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  constructor(
    private popupModel: NgbModal,
    private commonService: CommonService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private addVendorModel: NgbModal,
    private popupCtrl: NgbModal,
    private modalctrl: NgbModal
  ) { }



  ngOnInit() {
    this.getReverseAuctionViewersList()
  }

  onFilterAllField(event: any) {
    //console.log("Value : ", event.target.value);

    let inputValue;
    if (event) {
      this.state.skip = 0
      inputValue = event.target.value;
      this.serachText = inputValue;
    } else {
      inputValue = this.serachText;
    }

    let filterData = this.getFilteredData(inputValue);
    this.gridView = process(filterData, this.state);
  }

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.reverseAuctionViewerList, {
        filters: [
          {
            field: 'userId',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'userName',
            operator: 'contains',
            value: inputValue,
          },
        ],
        logic: 'or',
      });
    } else {
      return filterBy(this.reverseAuctionViewerList, this.filter);
    }
  }

  getReverseAuctionViewersList() {
    this.isLoading = true;
    this.eventService.getReverseAuctionViewersList(this.rfqDetail.eventid).subscribe({
      next: (result: any) => {

        this.reverseAuctionViewerList = result.data.sort(
          (a: any, b: any) =>   {
            return (a.isSelected   === b.isSelected)? 0 : a.isSelected? -1 : 1;
          });

        this.isLoading = false;
        this.loadData(this.reverseAuctionViewerList);

      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.reverseAuctionViewerList = data;
    // this.loading = false;
    if (this.serachText != '') {
      this.onFilterAllField(null);
    } else {
      this.gridView = process(filterData, this.state);
    }
    // this.gridView = process(filterData, this.state);
    this.cdr.detectChanges();
  }

  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      this.loadData(this.reverseAuctionViewerList);
    }
  }
  checkBoxSelectedHandler(event:any,item: any, index: number) {
    let selectedList = this.reverseAuctionViewerList.filter(val => val.isSelected);
    if (selectedList.length > 5) {
      this.commonService.showToaster("Can not select more than 5", false);
      this.reverseAuctionViewerList[index].isSelected = false
      event.target.checked=false;
      return
    }

  }
  saveViewersbutton() {
    let payload = this.reverseAuctionViewerList.filter(val => val.isSelected).map(val => {
      return {
        "userId": val.userId,
        "userName": val.userName,
        "isSelected": val.isSelected
      }
    }) 
    this.eventService.saveReverseAuctionViewers(this.rfqDetail.eventid,payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonService.showToaster('Viewers saved Succesfully', true);
          this.getReverseAuctionViewersList()
        //  this.savingloader=false;
         this.cdr.detectChanges();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
          // this.savingloader=false;
        }
      },
      error: () => {
        // this.savingloader=false;
      },
    });
    
  }
  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }
}
