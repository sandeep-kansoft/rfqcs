import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { IAllVendorsList, IAllVendorsResponse } from '../../event.interface';
import { EventService } from '../../event.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  searchText: string = '';
  initalVendorList: IAllVendorsList[] = [];

  selectedVendorsList: IAllVendorsList[] = [];
  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,


    private commonService: CommonService
  ) {}
  ngOnInit() {
    this.getGetAllVendorsServiceCall(true);

  }
  openChatPopUp() {
    // debugger;
    // const modelRef = this.modalService.open(ChatComponent, {
    //   centered: true,
    //   fullscreen: true,
    //   scrollable: true,
    // });

    // modelRef.componentInstance.otherChargesParameterList = JSON.stringify(this.otherChargesParameterList);
    // modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    // modelRef.result.then(
    //   (err) => {
    //     console.log('Detail', err);
    //   },
    //   (data) => {
    //     if (data) {
    //       // this.getPriceBidColumnsServiceCall();
    //       this.cdr.detectChanges();
    //     }
    //   }
    // );
  }
  searchChangeHandler(event: any) {
    // let value = event.target.value;
    if (this.searchText != '' && this.searchText.length >= 3) {
      // this.getGetAllVendorsServiceCall(false);
      // this.isAllDataLoaded = false;
      // this.selectedVendorsList = this.initalVendorList.filter((val) => {
      //   return (
      //     val.vendorName.toLowerCase().includes(this.searchText) ||
      //     val.vendorCode.toLowerCase().includes(this.searchText)
      //   );
      // });
    } else {
      // this.selectedVendorsList = this.initalVendorList;
      // if (!this.isAllDataLoaded) {
      //   this.getGetAllVendorsServiceCall(true);
      // }
    }
  }
  getGetAllVendorsServiceCall(isAllData: boolean = false) {

    // alert(this.eventId);

    let data = {
      eventId: 174,
      searchText: isAllData ? '' : this.searchText,
      pageSize: 10,
      pageIndex: 1,
      sorting: 1,
    };

    this.eventService.getAllVendors(data).subscribe({
      next: (result: IAllVendorsResponse) => {

        let data = result.data.sort(((a :any,b:any)=> b.vendorName-a.vendorName))
        this.initalVendorList = data;
        this.selectedVendorsList = data;

        this.cdr.detectChanges();
        let x: any = true;
      },
      error: (err) => {
        console.log(err);

      },
    });
  }

}
