import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  FilterDescriptor,
  SortDescriptor,
  State,
  filterBy,
  orderBy,
  process,
} from '@progress/kendo-data-query';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from '../../event.service';
import {
  ComparisonVendorParam,
  IDefaultResponseDto,
  IRfqDetailDataDto,
  IVendorBidComparison,
  IheaderBidComparision,
} from '../../event.interface';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';

@Component({
  selector: 'app-header-information',
  templateUrl: './header-information.component.html',
  styleUrls: ['./header-information.component.scss'],
})
export class HeaderInformationComponent {
  @Input() rfqDetail: IRfqDetailDataDto;
  @Input() csId: number;
  @Input() isExpandAlls: boolean;
  permission: boolean = true;
  @Input() hiddenColumns: string[] = [];
  loading: boolean = false;
  public gridView: GridDataResult;
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  longColumnWidth = 200;
  chargesAndTermsData: IVendorBidComparison[] = [];
  commercialTNCData: IVendorBidComparison[] = [];
  otherChargesData: IVendorBidComparison[] = [];
  public sortChargesAndTerms: SortDescriptor[] = [];
  public filterChargesAndTerms: FilterDescriptor;
  changesComParamList: ComparisonVendorParam[] = [];
  otherChargesParamList: ComparisonVendorParam[] = [];
  public changesComParamGrid: GridDataResult;
  public otherChargesParamGrid: GridDataResult;
  public sortcommercialTNC: SortDescriptor[] = [];
  public filtercommercialTNC: FilterDescriptor;
  commercialTNCParamList: ComparisonVendorParam[] = [];
  authData: AuthModel | null | undefined;

  public commercialTNCGrid: GridDataResult;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  constructor(
    private commonServices: CommonService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {
    this.authData = this.commonServices.getAuthData();
  }

  ngOnInit() {
    this.getHeaderBidComparisonServiceCall();
    // this.collaboraterHeaderPermission(this.authData?.userRole);
  }

  // collaboraterHeaderPermission(UserRole: any) {
  //   console.log(this.authData?.userRole);
  //   if (UserRole == '') {
  //     this.permission = false;
  //   }
  // }

  getHeaderBidComparisonServiceCall() {
    let csIdVal = 0;
    if (this.csId) {
      csIdVal = this.csId;
    }
    this.eventService.getHeaderBidComparison(this.rfqDetail.eventid, csIdVal).subscribe({
      next: (result: IDefaultResponseDto<IheaderBidComparision>) => {
        if (result.success) {
          this.chargesAndTermsData =
            result.data.pricingAndTerms.vendorBidComparisons;
          this.commercialTNCData =
            result.data.commercialTNC.vendorBidComparisons;
          this.otherChargesData = result.data.otherCharges.vendorBidComparisons;
          this.loadDatachargesAndTerms(
            result.data.pricingAndTerms.comparisonParamList
          );
          this.loadDatacommercialTNC(
            result.data.commercialTNC.comparisonParamList
          );
          this.loadDataOtherCharges(
            result.data.otherCharges.comparisonParamList
          );
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }

      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  loadDatacommercialTNC(data: any[]) {

    let sortedData = orderBy(data, this.sortcommercialTNC);
    let filterData = filterBy(sortedData, this.filtercommercialTNC);
    this.commercialTNCParamList = data;
    this.commercialTNCGrid = process(filterData, this.state);
    this.cdr.detectChanges();
  }

  loadDatachargesAndTerms(data: any[]) {
    let sortedData = orderBy(data, this.sortChargesAndTerms);
    let filterData = filterBy(sortedData, this.filterChargesAndTerms);
    this.changesComParamList = data;
    this.changesComParamGrid = process(filterData, this.state);
    this.cdr.detectChanges();
  }

  loadDataOtherCharges(data: any[]) {
    let sortedData = orderBy(data, this.sortChargesAndTerms);
    let filterData = filterBy(sortedData, this.filterChargesAndTerms);
    this.otherChargesParamList = data;
    this.otherChargesParamGrid = process(filterData, this.state);
    this.cdr.detectChanges();
  }

  getComparisionVendorParam(
    comparisonParams: any,
    comparisonVendorParams: any
  ) {
    let valueItem = comparisonVendorParams.filter(
      (val: any) => val.key == comparisonParams.key
    )[0];
    if (valueItem) {
      return valueItem.value;
    } else {
      return '-';
    }
  }

  addColumnCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    if (this.csId) {
      return true
    }

    switch (this.authData?.userRole) {
      case 'Buyer':
        return true;
        break;
      case 'Vendor':
        return false;
        break;
      case 'Requester/Technical':
        return false;


    }
  }
}
