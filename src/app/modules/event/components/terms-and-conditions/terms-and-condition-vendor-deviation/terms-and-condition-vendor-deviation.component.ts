import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  FilterDescriptor,
  SortDescriptor,
  State,
  process,
} from '@progress/kendo-data-query';
import { EventService } from '../../../event.service';
import {
  IRfqDetailDataDto,
  ITNCVendorDeviationdDto,
} from '../../../event.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsAndConditionDeviateReasonComponent } from '../terms-and-condition-deviate-reason/terms-and-condition-deviate-reason.component';

@Component({
  selector: 'app-terms-and-condition-vendor-deviation',
  templateUrl: './terms-and-condition-vendor-deviation.component.html',
  styleUrls: ['./terms-and-condition-vendor-deviation.component.scss'],
})
export class TermsAndConditionVendorDeviationComponent {
  @Input() eventId: number;
  @Input() contentFor: string;
  @Input() eventStatus: string;
  @Input() rfqDetail: IRfqDetailDataDto;
  @Output() updateCheckList$ = new EventEmitter();
  gridView: GridDataResult;
  vendorDeviationList: ITNCVendorDeviationdDto[] = [];
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };
  headerStyle = 'fw-bold';
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  loading: boolean = false;
  acceptVendorDevLoading: boolean = false;
  vendorListNames: any[] = [];
  allDeviationData: any = {};
  currentTabSelected: string = '';
  constructor(
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private commonService: CommonService,
    private modelComp: NgbModal
  ) { }

  ngOnInit() {
    this.getVendorDeviationList();
  }

  public onStateChange(state: any) {
    this.sort = state.sort;
    this.filter = state.filter;
    this.state = state;
    this.loadData(this.vendorDeviationList);
  }

  loadData(data: any) {
    this.vendorDeviationList = data;
    this.gridView = process(data, this.state);
    this.cdr.detectChanges();
  }

  getVendorDeviationList() {
    this.loading = true;
    this.eventService.getVendorDeviationList(this.eventId).subscribe({
      next: (result: any) => {
        if (result.success) {
          // console.log("get all terms and condation", this.termAndConditionsList)
          // this.loadDataTemplate(this.termAndConditionsList);
          if (this.contentFor == 'Buyer') {
            this.allDeviationData = result.data.reduce(
              // categorizing the vendor data
              (prev: any, curr: ITNCVendorDeviationdDto) => {
                if (curr?.isdeviated) {
                  if (prev[curr?.vendorid] == undefined) {
                    prev[curr?.vendorid] = [curr];
                    this.vendorListNames.push({
                      vendorid: curr.vendorid,
                      vendorname: curr.vendorname,
                    });
                  } else {
                    prev[curr.vendorid].push(curr);
                  }
                }

                return prev;
              },
              {}
            );
            if (this.vendorListNames.length != 0) {
              this.currentTabSelected = this.vendorListNames[0]?.vendorid;
              this.loadData(this.allDeviationData[this?.currentTabSelected]);
            }
            this.loading = false;
          } else {
            if (this.eventStatus == 'Published') {
              this.loadData(result.data);
            } else {
              // if data is not published then show only status
              // let data = result.data.filter(
              //   (val: any) => val.isdeviated || val.isaccepted
              // );
              this.loadData(result.data);
            }

            this.loading = false;
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      },
    });
  }

async saveConditionCheckForAccept(item: ITNCVendorDeviationdDto){
  let isValid =await this.commonService.eventPublishedChecker(this.eventId)
  if(isValid){
this.acceptDeviationHandler(item)
  }
  else{
    this.commonService.showToaster('Event Already Closed',false);
  }
}


async saveConditionCheckForDevaite(item: ITNCVendorDeviationdDto){
  let isValid =await this.commonService.eventPublishedChecker(this.eventId)
  if(isValid){
this.openDeviateResonModel(item)
  }
  else{
    this.commonService.showToaster('Event Already Closed',false);
  }
}

  acceptDeviationHandler(item: ITNCVendorDeviationdDto) {
    if (this.rfqDetail.vendorStatus == 'Participated' && this.rfqDetail.eventStatus == 'Published') {
      this.commonService
        .showAlertForWarning('Accept Contract', 'Are you sure')
        .then((res) => {
          if (res) {
            this.acceptVendorDeviationListApi(item);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.commonService.showToaster('Permission is not allowed.', false);
    }
  }

  acceptVendorDeviationListApi(item: ITNCVendorDeviationdDto) {
    if (!this.acceptVendorDevLoading) {
      this.acceptVendorDevLoading = false;
      let payload = {
        tncid: item.tncid,
        eventid: this.eventId,
        vendorid: item.vendorid,
      };

      this.eventService.postAcceptVendorDeviation(payload).subscribe({
        next: (result: any) => {
          if (result.success) {
            this.commonService.showToaster('Clause Accepted', true);
            this.updateCheckList()
          } else {
            this.commonService.showToaster(result.errorDetail, false);
          }
          this.acceptVendorDevLoading = false;
          this.cdr.detectChanges();
          this.getVendorDeviationList();
        },
        error: (err) => {
          this.acceptVendorDevLoading = false;
          console.log(err);
        },
      });
    }
  }

  openDeviateResonModel(item: ITNCVendorDeviationdDto) {
    if (this.rfqDetail.vendorStatus == 'Participated' && this.rfqDetail.eventStatus == 'Published') {
      const modelRef = this.modelComp.open(
        TermsAndConditionDeviateReasonComponent,
        {
          centered: true,
          fullscreen: true,
          scrollable: true,
        }
      );
      modelRef.componentInstance.rfqDetail = this.rfqDetail
      modelRef.result.then((res) => {
        if (res) {
          this.updateCheckList()
          this.getVendorDeviationList();
        }
      });

      modelRef.componentInstance.item = item;
      modelRef.componentInstance.eventId = this.eventId;
    } else {
      this.commonService.showToaster('permission not allowed', false);
    }
  }

  tabChangeHandler(obj: any) {
    this.currentTabSelected = obj.vendorid;
    let data: ITNCVendorDeviationdDto[] =
      this.allDeviationData[`${obj.vendorid}`];
    this.loadData(data);
  }

  updateCheckList() {
    this.updateCheckList$.emit();
  }
}
