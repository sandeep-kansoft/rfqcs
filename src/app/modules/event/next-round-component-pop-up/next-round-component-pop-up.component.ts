import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import {
  IAllSuggestedVendor,
  IAllVendorsList,
  IAllVendorsResponse,
  IDefaultResponseDto,
  INextRoundRfqTypePayload,
  IRfqDetailDataDto,
  ISuggestedVendorList,
} from '../event.interface';
import { EventService } from '../event.service';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  FilterDescriptor,
  SortDescriptor,
  State,
  filterBy,
  orderBy,
  process,
} from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-next-round-component-pop-up',
  templateUrl: './next-round-component-pop-up.component.html',
  styleUrls: ['./next-round-component-pop-up.component.scss'],
})
export class NextRoundComponentPopUpComponent {
  @Input() type: string = '';
  @Input() rfqDetail: IRfqDetailDataDto;
  @Input() rfqTypeDetail: INextRoundRfqTypePayload;
  SelectAllenabled:boolean=false;
  vendorList: any = [];
  public gridView: GridDataResult;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  loading: boolean = true;
  saveEventLoader: boolean = false;
  selectedVendorsList: IAllVendorsList[] = [];
  @Input() eventId: number;
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  x: any = false;
  searchText: string = '';
  initalVendorList: IAllVendorsList[] = [];
  initialSuggestedVendorList: ISuggestedVendorList[] = [];
  SuggestedVendorListFinal: ISuggestedVendorList[] = [];
  isAllDataLoaded: boolean = true;

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    public modal: NgbActiveModal,
    private activeModel: NgbActiveModal,
    private commonService: CommonService,
    private router: Router
  ) { }

  closeModel() {
    this.modal.dismiss();
  }

  selectAllChangeHandler(){
    for(let i=0;i<this.selectedVendorsList.length;i++){
      this.selectedVendorsList[i].enabled=this.SelectAllenabled;
    }
  }

  nextEventHandler() {
    if (!this.saveEventLoader) {
      this.saveEventLoader = true;
      let ls = this.selectedVendorsList
        .filter((val) => val.enabled)
        .map((val) => val.vendorId);

      if (ls.length != 0) {
        let payload = {
          eventId: this.rfqDetail.eventid,
          vendorId: ls,
          eventtype: this.eventTypeMappingEnum(this.rfqTypeDetail.eventtype),
          eventColorCode: this.rfqTypeDetail.eventColorCode
        };

        this.eventService.RFQNextRoundApi(payload).subscribe({
          next: (result: IDefaultResponseDto<any[]>) => {
            this.saveEventLoader = false;

            if (result.success) {
              this.router.navigate(['/Event/RFQList'], {
              });
              setTimeout(() => {
                this.router.navigate(['/Event/EventDashboard'], {
                  state: { EventId: result.data },
                });
                this.cdr.detectChanges()
              }, 500);

              this.commonService.showToaster(
                'next round created successfully',
                true
              );
            } else {
              this.commonService.showToaster(result.errorDetail, false);
            }
            this.closeModel();
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.saveEventLoader = false;
            console.log(err);
          },
        });
      } else {
        this.commonService.showToaster('Please select vendors', false);
      }
    }
  }

  ngOnInit() {
    this.getAllEventVendor();
    console.log("this is rfq detail",this.rfqDetail)
  }

  getAllEventVendor() {
    this.loading = true;
    this.eventService.GetAllEventVendor(this.rfqDetail.eventid).subscribe({
      next: (result: any) => {
        this.loading = false;

        this.selectedVendorsList = result.data.map((val: any) => {
          val.enabled = false;
          return val;
        });
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  close() {
    this.activeModel.dismiss();
  }

  // infinite scroll work

  modalScrollDistance = 1;
  modalScrollThrottle = 50;

  onScroll(event: any) {
    console.log('scrolled!!', event);
  }

  eventTypeMappingEnum(type: string): string {
    switch (type) {
      case 'RFQ':
        return '1';
        break;
      case 'FWDAUC':
        return '2';
        break;
      case 'REVAUC':
        return '3';
        break;

      default:
        break;
    }

    return '';
  }
}
