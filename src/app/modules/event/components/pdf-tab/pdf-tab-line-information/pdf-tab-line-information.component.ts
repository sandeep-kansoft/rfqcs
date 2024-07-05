import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ComparisonVendorParam, IRfqDetailDataDto, ItemBidComparison } from '../../../event.interface';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { State } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from '../../../event.service';
import { Observable, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-pdf-tab-line-information',
  templateUrl: './pdf-tab-line-information.component.html',
  styleUrls: ['./pdf-tab-line-information.component.scss']
})
export class PdfTabLineInformationComponent {
  @Input() rfqDetail: IRfqDetailDataDto;
  @Input() csId: number;
  @Input() isExpandAll: boolean = false;
  @Input() hiddenColumns: string[] = []
  dummyDataIterator: any = [1];
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  longColumnWidth = 200;
  roundWidth = 70;
  comparisionWidth = 100;
  loading: boolean = false;
  authData: AuthModel | null | undefined;
  isPoAndPrPriceVisible: boolean = true
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 100000,
  };
  itemBidComparisonsList: ItemBidComparison[] = [];

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private eventService: EventService
  ) {
    this.authData = this.commonService.getAuthData();
  }

  public ngOnInit() {
    this.getBidComparisonServiceCall();
    if (this.authData?.userRole != 'Buyer') {
      this.isPoAndPrPriceVisible = false
    }
  }

  expandAll() {
    this.itemBidComparisonsList.map((val: any) => (val.isShow = true));
  }

  collapseAll() {
    this.itemBidComparisonsList.map((val: any) => (val.isShow = false));
  }
  getValueFromKey(key: any, params: any) {
    let valueItem = params.filter((val: any) => val.key == key)[0];
    if (valueItem) {
      return valueItem.value;
    } else {
      return '-';
    }
  }

  getBidComparisonServiceCall() {
    let csIdVal = 0;

    if (this.csId) {
      csIdVal = this.csId;
    } //this.loading = true;

    this.eventService
      .getBidComparison(this.rfqDetail.eventid, csIdVal)
      .subscribe({
        next: (result: any) => {
          this.loading = false;
          this.itemBidComparisonsList = result.data.itemBidComparisons.map((val: ItemBidComparison) => {
            val.subItemBidComparisons = []
            val.subItemParamList = [{ key: 'QTY', value: 'Qty' }, { key: 'REMARKS', value: 'Remarks' }] as ComparisonVendorParam[];
            return val
          }).reverse()
          // console.log('the details ', this.itemBidComparisonsList);
          if (this.isExpandAll) {
            this.expandAll();
          }

          // if (this.rfqDetail.templateId == 2) {
          // this.getLineSubItemInformation()
          // }

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }




  getLineSubItemInformation() {
    let payload = {
      userId: this.authData?.userId,
      eventcode: this.rfqDetail.eventNo,
      eventname: '',
      currentstatus: '',
      projectName: '',
      eventType: '',
      userName: '',
      startDate: '',
      endDate: '',
    };

    payload.startDate = this.commonService
      .getLastDateFromRange(360)
      .toISOString()
      .slice(0, 10);
    payload.endDate = new Date().toISOString().slice(0, 10);

    forkJoin([
      this.eventService.getRFQListApi(payload),
    ]).subscribe({
      next: (result) => {
        let isAllSuccess = result.every(data => data.success)
        if (isAllSuccess) {

          let source = [] as Observable<any>[];
          // getting list of all the vendors
          result[0].data.forEach(val => {
            source.push(this.eventService.ViewCsApi(val.evenT_ID).pipe(
              map((response: any) =>
                response.data.map((singelVsItem: any) => {
                  singelVsItem.eventNo = val.evenT_NO
                  singelVsItem.eventId = val.evenT_ID
                  return singelVsItem
                })
              )
            )
            )
          })

          // grouping the vendor based on vendor id
          forkJoin(source).subscribe({
            next: (viewCsResult) => {
              let vendorList: any[] = []
              viewCsResult.forEach(viewCsItem => {
                vendorList = [...vendorList, ...viewCsItem]
              })
              let participatedVendorList: any[] = vendorList.filter(vendorItem => vendorItem.participatestatus == 'Participated')
                .map(val => {
                  val.bidRounds = []
                  return val
                })
                .reduce((prev, current) => {
                  let index = prev.findIndex((o: any) => o.vendorid == current.vendorid)
                  if (index != -1) {
                    // if element found then updating the bid round
                    let item = result[0].data.filter(rfqItem => (prev[index]).eventId == rfqItem.evenT_ID).map(bidItem => {
                      return {
                        eventRoundNumber: bidItem.evenT_ROUND,
                        roundName: `Round ${bidItem.evenT_ROUND}`
                      }
                    })
                    prev[index].bidRounds.push(item[0])
                  } else {
                    // getting the round and apending the vendor object
                    current.bidRounds = result[0].data.filter(rfqItem => current.eventId == rfqItem.evenT_ID).map(bidItem => {
                      return {
                        eventRoundNumber: bidItem.evenT_ROUND,
                        roundName: `Round ${bidItem.evenT_ROUND}`
                      }
                    })
                    prev.push(current)
                  }

                  return prev
                }, [])

              // console.log('participated list is ', participatedVendorList)

              // getting round information
              let itemListSource = [] as Observable<any>[];
              this.itemBidComparisonsList.forEach(val => {
                participatedVendorList.forEach(vendorItem => {
                  itemListSource.push(this.eventService.getAllSubItemsForVendor(val.eventTranId, vendorItem.vendorid).pipe(map(res =>
                    res.data.map(val => {
                      return val
                    })

                  )))
                })
              })

              forkJoin(itemListSource).subscribe({
                next: (res) => {
                  let output: any[] = []
                  res.forEach(val => {
                    output = [...output, ...val]
                  })
                  this.itemBidComparisonsList = this.itemBidComparisonsList.map(val => {
                    val.subItemList = output.filter(item => item.eventTranId == val.eventTranId)

                    val.subItemList.forEach(val => {
                      val.bidRound = participatedVendorList
                    })

                    // subItemList
                    return val
                  })
                }, error: (err) => {
                  console.log("err", err)
                }
              })








              //



            }, error: () => { }
          })



        }

        this.cdr.detectChanges()
      }, error: (err) => {
        console.log("error is ", err)
      }
    })
  }

  getVendorList() {

  }

  viewCs() {

  }



  showRoundCondition(roundName: string): boolean {
    return this.hiddenColumns.indexOf(roundName) > -1
  }
  // loadDatacommercialTNC(data: any[]) {
  //   console.log("commerical tnc", data)

  //   this.commercialTNCGrid = process(filterData, this.state);
  // }
}
