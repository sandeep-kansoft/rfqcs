import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { IAllSuggestedVendor, IAllVendorsList, IAllVendorsResponse, ISuggestedVendorList } from '../../../event.interface';
import { EventService } from '../../../event.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-add-vendors',
  templateUrl: './add-vendors.component.html',
  styleUrls: ['./add-vendors.component.scss'],
})
export class AddVendorsComponent {
  @Input() type: string = '';
  @Input() eventId: number;
  allVendorList: IAllVendorsList[] = [];
  checkedList: (IAllVendorsList | IAllVendorsList)[] = [];
  searchText: string = '';
  suggestedVendorList: ISuggestedVendorList[] = [];
  isAllDataLoaded: boolean = true;
  saveEventLoader: boolean = false;
  modalScrollDistance = 1;
  modalScrollThrottle = 50;
  pageNumber: number = 1
  loadMoreData: boolean = true
  isLoading: boolean = false;
  private searchSubject = new Subject<string>();

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    public modal: NgbActiveModal,
    private activeModel: NgbActiveModal,
    private commonService: CommonService
  ) {

    this.searchSubject.pipe(
      debounceTime(1200),
    ).subscribe(() => {
      if (this.searchText.trim() != '') {
        this.initialLoadData(true)
      } else {
        this.initialLoadData(false)
      }
    });
  }

  closeModel() {
    this.modal.dismiss();
  }


  /**
   * This function saves selected vendors for an event and displays a success or error message.
   */
  saveEventVendors() {
    if (!this.saveEventLoader) {
      this.saveEventLoader = true;
      if (this.checkedList.length != 0) {
        let vendorIds: any = [];
        this.checkedList.forEach((element: any) => {
          let item = { id: element.vendorId, };
          vendorIds.push(item);
        });
        const payload: any = { eventId: this.eventId, vendorIds: vendorIds, };
        this.eventService.SaveEventVendors(payload).subscribe({
          next: (result: any) => {
            if (result.success) {
              this.commonService.showToaster('Vendors data saved Succesfully', true);
              this.activeModel.close('success');
              this.saveEventLoader = false;
            } else {
              this.commonService.showToaster(result.errorDetail, false);
              this.saveEventLoader = false;
            }
          },
          error: () => {
            this.saveEventLoader = false;
          },
        });
      } else {
        this.saveEventLoader=false;
        this.commonService.showToaster('Please select vendors.', false);
      }
    }
  }

  ngOnInit() {
    this.initialLoadData(false);
  }
  getGetAllVendorsServiceCall(isSearch: boolean = false) {
    if (!this.isLoading) {
      this.isLoading = true
      let data = {
        eventId: this.eventId,
        searchText: isSearch ? this.searchText.trim() : '',
        pageSize: 10,
        pageIndex: this.pageNumber,
        sorting: 1,
      };

      this.eventService.getAllVendors(data).subscribe({
        next: (result: IAllVendorsResponse) => {
          if (result.success) {
            if (result.data.length != 0) {
              // let data = result.data.sort((a: any, b: any) => b.vendorName - a.vendorName);
              let data = result.data.map((val) => {
                let index = this.checkedList.findIndex((vd) => val.vendorCode == vd.vendorCode);
                val.enabled = index != -1 ? true : false;
                return val;
              });
              this.allVendorList = [...this.allVendorList, ...data];
            } else {
              this.loadMoreData = false
            }
          } else {
            this.commonService.showToaster(result.errorDetail, false)
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    }


  }

  /**
   * This function checks if there is no data found based on certain conditions.
   * @returns A boolean value is being returned.
   */
  validateNoDataFound(): boolean {
    return !this.isLoading && !this.loadMoreData && this.pageNumber == 1 && (this.type == 'Vendors' ? this.allVendorList.length == 0 : this.suggestedVendorList.length == 0) ? true : false
  }

  /**
   * This function makes a service call to retrieve suggested vendors for an event and updates the
   * component's suggestedVendorList property with the retrieved data.
   * @param {boolean} [isSearch=false] - A boolean flag indicating whether the search functionality is
   * being used or not. If it is true, then the search text will be included in the API call, otherwise
   * it will be excluded.
   */
  getGetAllSuggestedVendorServiceCall(isSearch: boolean = false) {
    if (!this.isLoading) {
      this.isLoading = true
      let data = {
        eventId: this.eventId,
        searchText: isSearch ? this.searchText.trim() : '',
        pageSize: 10,
        pageIndex: this.pageNumber,
        sorting: 1,
      };

      this.eventService.getSuggestedvendor(data).subscribe({
        next: (result: IAllSuggestedVendor) => {

          if (result.success) {
            if (result.data.length != 0) {
              let dataSuggested = result.data.map(val => {
                let index = this.checkedList.findIndex((vd) => val.vendorCode == vd.vendorCode);
                val.enabled = index != -1 ? true : false;
                return val
              })
              this.suggestedVendorList = [...this.suggestedVendorList, ...dataSuggested,];
            } else {
              this.loadMoreData = false
            }

          } else {
            this.commonService.showToaster(result.errorDetail, false)
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false
        },
      });
    }

  }

  searchChangeHandler() {
    this.searchSubject.next('');
  }
  /**
   * This function initializes data for a vendor list and calls a service to retrieve vendor information.
   * @param {boolean} [isSearching=false] - A boolean value indicating whether the user is currently
   * searching for a specific vendor or not. It is used to determine which API call to make.
   */
  initialLoadData(isSearching: boolean = false) {
    this.isLoading = false
    this.loadMoreData = true
    this.pageNumber = 1
    this.allVendorList = []
    this.suggestedVendorList = []
    if (this.type == 'Vendors') {
      this.getGetAllVendorsServiceCall(isSearching);
    } else {
      this.getGetAllSuggestedVendorServiceCall(isSearching);
    }
  }

  /**
   * This function increases the page number and calls a service to retrieve more data when the user
   * scrolls down on a modal.
   */
  onModalScrollDown() {
    if (this.loadMoreData) {
      this.pageNumber = this.pageNumber + 1
      if (this.type == 'Vendors') {
        this.getGetAllVendorsServiceCall(this.searchText.trim() ? true : false);
      } else {
        this.getGetAllSuggestedVendorServiceCall(this.searchText.trim() ? true : false);
      }
    }
  }

  checkboxChnageHandler(vendorItem: ISuggestedVendorList | IAllVendorsList) {
    if (vendorItem.enabled) { this.checkedList.push(vendorItem as any); }
    else {
      let index: any = this.checkedList.find((val) => val.vendorCode == vendorItem.vendorCode);
      if (index != -1) { this.checkedList.splice(index, 1); }
    }
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe()
  }

}
