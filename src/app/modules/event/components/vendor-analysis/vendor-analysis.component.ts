import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  FilterDescriptor,
  SortDescriptor,
  State,
  filterBy,
  orderBy,
  process,
} from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { PrResponseDto } from 'src/app/modules/purchase-requisition/purchase-requisition';
import { PurchaseRequistionServiceService } from 'src/app/modules/purchase-requisition/purchase-requistion-service.service';
import { ICustomFilterDataDto } from 'src/app/shared/services/common.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  IAllVendorsList,
  IDefaultResponseDto,
  IGetAssignnedCollabrativeUserDataDta,
  IPriceBidResultDataDto,
  IRfqDetailDataDto,
  IRfqcsListDataDto,
  IVendorListdataDto,
  IroundlistDto,
  ItemBidComparison,
  ItemBidComparisonData,
  IviewCsResponseDto,
} from '../../event.interface';
import { EventService } from '../../event.service';
import { SingleInputModalComponent } from '../single-input-modal/single-input-modal.component';

@Component({
  selector: 'app-vendor-analysis',
  templateUrl: './vendor-analysis.component.html',
  styleUrls: ['./vendor-analysis.component.scss'],
})
export class VendorAnalysisComponent {
  @Input() rfqDetail: IRfqDetailDataDto;
  @Input() currentCollaboratorPermission: IGetAssignnedCollabrativeUserDataDta;
  inValidate: boolean = false;
  ScoringByCollaboratordata: any;
  public gridView: GridDataResult;
  public gridViewvendoranalysis: GridDataResult;
  dropdownListdata = ['Preview', 'RFQ', 'Auction', 'Lines', 'History'];
  dropdownListWithoutrfq = ['Preview', 'Lines', 'History'];
  public toasterList$ = new BehaviorSubject([]);
  public currentToasterList$ = this.toasterList$.asObservable();
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  selectedVendorsList: IAllVendorsList[];
  selectAllvendor: boolean;
  longColumnWidth = 200;
  vendorslistdata: IVendorListdataDto[] = [];
  authnewdata: any;
  file: any;
  pageSize = 10;
  pageNumber = 1;
  loading: boolean = false;
  viewCsData: IviewCsResponseDto[] = [];
  customFilter: ICustomFilterDataDto = {
    dateRangeSelected: null,
    prNo: '',
    department: '',
    isPrFieldVisible: false,
    isDepartmentVisible: true,
    ppoNumber: '',
    isSearchByPPONumber: false,
    isSearchItemNumber: false,
    ItemNumber: '',
    site: '',
    isSiteVisible: true,
  };

  refreshComponent: boolean = true;
  createRfqLoader: boolean = false;
  roundlist: IroundlistDto[] = [];
  authData: AuthModel | null | undefined;
  createRfqLoading: boolean = false;
  toasts: any = [];
  newColumns: any = [];
  serachText: string = '';
  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;
  dummyDataIterator: any = [1];
  itemBidComparisonsData: ItemBidComparisonData;
  itemBidComparisonsList: ItemBidComparison[] = [];
  selectAllrounds: boolean;
  public state: State = {
    filter: undefined,
    group: [],
    skip: 0,
    sort: [],
    take: 10,
  };

  constructor(
    private commonService: CommonService,
    private prDetailModel: NgbModal,
    private prLineViewModel: NgbModal,
    private prHistoryModel: NgbModal,
    private auctionDrawer: NgbOffcanvas,
    private prservice: PurchaseRequistionServiceService,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private offcanvasService: NgbOffcanvas,
    private activeModel: NgbModal,

    private router: Router
  ) {
    this.allData = this.allData.bind(this);
    this.authData = this.commonService.getAuthData();
    this.authnewdata = this.commonService.getAuthData();
  }

  public ngOnInit() {
    this.viewCs();
    this.cssheetcs();
    this.getBidComparisonServiceCall();
    if(this.rfqDetail.eventType == "3"){
      // this.getRAPrList();
      this.getRfqPrList();
    }
    else{
    this.getRfqPrList();
    }
  }

  getBidComparisonServiceCall() {
    //this.loading = true;

    this.eventService.getBidComparison(this.rfqDetail.eventid).subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        debugger;
        this.itemBidComparisonsData = result.data;
        this.itemBidComparisonsList =
          this.itemBidComparisonsData.itemBidComparisons;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      // let pageSize = state.skip / state.take + 1;
      // if (pageSize != this.pageNumber) {
      //   this.pageNumber = pageSize;
      //   this.getMyPrList();
      // } else {
      // }
      this.loadData(this.viewCsData);
    }
  }
  viewCs() {
    this.loading = true;
    this.eventService.ViewCsApi(this.rfqDetail.eventid).subscribe({
      next: (result: IDefaultResponseDto<IviewCsResponseDto[]>) => {
        this.loading = false;

        let data = result.data.map((val) => {
          val.oldTechnicalScore = val.technicalScore;
          val.oldTechnicalApprove = val.technicalApprove;
          val.fileDetail = null;
          return val;
        });
        this.loadData(data);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  public allData(): ExcelExportData {
    let stateData = this.state;
    stateData.take = this.viewCsData.length;
    let data;
    if (this.serachText != '') {
      let filterData = this.getFilteredData(this.serachText);
      data = process(filterData, stateData).data;
    } else {
      data = process(this.viewCsData, stateData).data;
    }
    data = data.map((val, index) => {
      val.sno = index + 1;
      val.enterdateFormat = val.enterdateFormat
        ? this.commonService.getTimeFormatString(
          val.enterdate,
          'DD-MMM-YYYY HH:MM'
        )
        : '';
      val.approvedDateFormat = val.approvedDateFormat
        ? this.commonService.getTimeFormatString(
          val.approvedDate,
          'DD-MMM-YYYY HH:MM'
        )
        : '';
      return val;
    });
    const result: ExcelExportData = {
      data: data,
    };

    return result;
  }
  overviewdata: PrResponseDto[] = [];

  onFilterAllField(event: any) {
    //console.log("Value : ", event.target.value);

    let inputValue;
    if (event) {
      inputValue = event.target.value;
      this.serachText = inputValue;
    } else {
      inputValue = this.serachText;
    }

    let filterData = this.getFilteredData(inputValue);
    this.gridViewvendoranalysis = process(filterData, this.state);
  }

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.viewCsData, {
        filters: [
          {
            filters: [
              {
                field: 'pR_NUM',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'description',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'siteName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'PROJECT_NAME',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'departmentName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'prtype',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'prSubType',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'preparer',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'totalValue',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'assignBuyer',
                operator: 'contains',
                value: inputValue,
              },
            ],
            logic: 'or',
          },
        ],
        logic: 'or',
      });
    } else {
      return filterBy(this.viewCsData, this.filter);
    }
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.viewCsData = data;

    this.gridViewvendoranalysis = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
  }

  uploadNewDocument(event: any, index: number) {
    this.file = event.target.files[0];
    this.viewCsData[index].fileDetail = {
      url: event.target.value,
      fileObj: this.file,
    };

    this.loadData(this.viewCsData);

    // console.log(this.file);
    // console.log('this path', event.target.value);
  }

  ScoringByCollaborator(index: number) { }

  technicalApproveMapping(type: string) {
    switch (type) {
      case 'Pending':
        return 0;
      case 'Approved':
        return 1;
      case 'Not Approved':
        return 2;

      default:
        break;
    }
  }

  techApprovalCondition() {
    switch (this.authData?.userRole) {


      case 'Buyer':
        return false;
      case 'Vendor':
        return false;
      case 'Requester/Technical':
        return this.currentCollaboratorPermission?.iS_TECHNICAL_APPROVE
          ? true
          : false;

      default:
        return false;
    }
  }

  uploadButtonCondition() {
    switch (this.authData?.userRole) {
      case 'Buyer':
        return false;
      case 'Vendor':
        return false;
      case 'Requester/Technical':
        return this.currentCollaboratorPermission?.iS_TECHNICAL_APPROVE
          ? true
          : false;

      default:
        return false;
    }
  }
  downloadAttachment(url: string) {
    this.commonService.downloadFile(url);
  }
  scoreCondition() {
    switch (this.authData?.userRole) {
      case 'Buyer':
        return false;
      case 'Vendor':
        return false;
      case 'Requester/Technical':
        return this.currentCollaboratorPermission?.iS_SCORE_ASSIGN
          ? true
          : false;

      default:
        return false;
    }
  }

  isTechApprovalAndScoreDisabled(): boolean {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (eventStatus) {
      case 'Published':
        return true;
      case 'Closed':
        return false;
      case 'Deleted':
        return true;
      case 'Terminated':
        return true;

      default:
        return true;
    }
  }


  uploadFileDisabledCondition(): boolean {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (eventStatus) {
      case 'Published':
        return true;
      case 'Closed':
        return false;
      case 'Deleted':
        return true;
      case 'Terminated':
        return true;

      default:
        return true;
    }
  }
  cancelButtonHandler(index: number) {
    if (this.viewCsData[index].oldTechnicalApprove) {
      // this.viewCsData[index].technicalApprove = this.viewCsData[index].oldTechnicalApprove
      let item = this.viewCsData[index];
      if (item.oldTechnicalScore) {
        item.technicalScore = item.oldTechnicalScore;
      }
      if (item.oldTechnicalApprove) {
        item.technicalApprove = item.oldTechnicalApprove;
      }
      this.viewCsData[index].fileDetail = null
      this.viewCsData[index] = item;
      this.loadData(this.viewCsData);
    }
  }
  lineItemShow(){
    if(this.authData?.userRole=='Buyer'){
      return true;
    }
    if(this.authData?.userRole=='Requester/Technical'){
      if(this.currentCollaboratorPermission.iS_TECHNICAL_ACCESS){
        return true;
      }
      else{
        return false;
      }
    }
    return true;
  }


HeaderInformationShowCondition(){
  if(this.authData?.userRole=='Buyer'){
    return true;
  }
  if(this.authData?.userRole=='Requester/Technical'){
    if(this.currentCollaboratorPermission.iS_COMMERCIAL_ACCESS){
      return true;
    }
    else{
      return false;
    }
  }
  return true;
}
  scoreValidationTest(item: IviewCsResponseDto) {
    let isValid = true;
    if (item.technicalScore > 100) {
      this.commonService.showToaster(
        'the score cannot be greater then 100',
        false
      );
      isValid = false;
    } else if (item.technicalScore < 0) {
      this.commonService.showToaster(
        'the score cannot be smaller then 0',
        false
      );
      isValid = false;
    } else if (!item.technicalApprove) {
      this.commonService.showToaster(
        'Technical approve field is required',
        false
      );
      isValid = false;
    }
    return isValid;
  }

  submithandler(index: number) {
    let item = this.viewCsData[index];

    if (this.scoreValidationTest(item)) {
      let data: any = {
        eventId: this.rfqDetail.eventid,
        vendorId: item.vendorid,
        scoreDocumnet: 'string',
        technicalRemark: ""
      };



      if (
        item.technicalScore != item.oldTechnicalScore ||
        item.technicalApprove != item.oldTechnicalApprove || item.fileDetail != null
      ) {
        if (this.currentCollaboratorPermission.iS_SCORE_ASSIGN) {
          data.score = item.technicalScore;
        }
        if (this.currentCollaboratorPermission.iS_TECHNICAL_APPROVE) {
          data.isApproved = this.technicalApproveMapping(item.technicalApprove);
        }

        if (item.technicalApprove != item.oldTechnicalApprove || item.fileDetail != null) {
          this.openRemarkModel(data, index)
        } else {
          this.scoringByCollaboratorApi(data, index)
        }

      }
    }
  }

  openRemarkModel(payload: any, index: number) {
    const modelRef = this.activeModel.open(SingleInputModalComponent, {
      centered: true,
      fullscreen: false,
      scrollable: true,
      keyboard: false
    });

    modelRef.componentInstance.title = 'Technical Remark'
    modelRef.componentInstance.placeholderName = 'Remark';
    modelRef.result.then(
      (result) => { },
      (result) => {
        if (result) {
          payload.technicalRemark = result
          this.scoringByCollaboratorApi(payload, index)
          if (this.viewCsData[index].fileDetail) {
            this.uploadScoreDocumentApi(this.viewCsData[index], index);
          }
        }
      }
    );
  }


  scoringByCollaboratorApi(payload: any, index: number) {
    this.eventService.ScoringByCollaborator(payload).subscribe({
      next: (result: IDefaultResponseDto<any>) => {
        if (result.success) {
          // updated old values with new values
          this.viewCsData[index].oldTechnicalApprove =
            this.viewCsData[index].technicalApprove;
          this.viewCsData[index].oldTechnicalScore =
            this.viewCsData[index].technicalScore;

          this.loadData(this.viewCsData);

          this.commonService.showToaster('Data updated successfully', true);
          this.cdr.detectChanges();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  expandAll() {
    this.itemBidComparisonsList.map((val: any) => (val.isShow = true));
  }

  collapseAll() {
    this.itemBidComparisonsList.map((val: any) => (val.isShow = false));
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
  uploadScoreDocumentApi(item: IviewCsResponseDto, index: number) {
    this.eventService
      .uploadScoreDocument(
        this.rfqDetail.eventid,
        item.vendorid,
        item.fileDetail?.fileObj,
        item.fileDetail?.url ? item.fileDetail?.url : ''
      )
      .subscribe({
        next: (result: IDefaultResponseDto<any>) => {
          if (result.success) {
            this.viewCsData[index].fileDetail = null;
            this.viewCsData[index].scoreDocPath = result.data;

            this.loadData(this.viewCsData);
            this.commonService.showToaster('File uploaded successfully', true);
          } else {
            this.commonService.showToaster(result.errorDetail, false);
          }
          // this.viewCs();
        },
        error: (err: any) => { this.viewCs(); },
      });
  }

  lineSubmitVisibilty(item: IviewCsResponseDto) {
    return (
      item.technicalScore == item.oldTechnicalScore &&
      item.technicalApprove == item.oldTechnicalApprove &&
      item.fileDetail == null
    );
  }

  // work of cs sheet starts here

  getRfqPrList() {
    let payload = {
      userId: this.authnewdata.userId,
      eventcode: this.rfqDetail.eventNo,
      eventname: '',
      currentstatus: '',
      projectName: '',
      eventType: '',
      userName: '',
      // if event is click form view only then all event round will be shown
      getAll: this.commonService.getAdminViewFlag() ? true : false,
      startDate: this.commonService
        .getLastDateFromRange(365)
        .toISOString()
        .slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
    };

    this.eventService.getRFQListApi(payload).subscribe({
      next: (result: IDefaultResponseDto<IRfqcsListDataDto[]>) => {
        if (result.success) {
          this.roundlist = result.data
            .sort(
              (a: IRfqcsListDataDto, b: IRfqcsListDataDto) =>
                a.evenT_ROUND - b.evenT_ROUND
            )
            .slice(0, Number(this.rfqDetail.eventRound));
            if(this.rfqDetail.eventType == "3"){
              this.getRAPrList()
            }
        } else {
          this.loading = false;
          this.commonService.showToaster(result.errorDetail, false);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  getRAPrList() {
    let payload = {
      userId: this.authnewdata.userId,
      eventcode: this.rfqDetail.eventNo,
      eventname: '',
      currentstatus: '',
      projectName: '',
      eventType: '',
      userName: '',
      // if event is click form view only then all event round will be shown
      getAll: this.commonService.getAdminViewFlag() ? true : false,
      startDate: this.commonService
        .getLastDateFromRange(365)
        .toISOString()
        .slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
    };

    this.eventService.getReverseAuctionListApi(payload).subscribe({
      next: (result: IDefaultResponseDto<IRfqcsListDataDto[]>) => {
        if (result.success) {
          let roundlistForRa :any = result.data.sort((a: IRfqcsListDataDto, b: IRfqcsListDataDto) => a.evenT_ROUND - b.evenT_ROUND).slice(0, Number(this.rfqDetail.eventRound));
          this.roundlist.push(...roundlistForRa);
          console.log("this is round list",this.roundlist);
        } else {
          this.loading = false;
          this.commonService.showToaster(result.errorDetail, false);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  cssheetcs() {
    this.loading = true;
    this.eventService.ViewCsApi(this.rfqDetail.eventid, this.rfqDetail.eventNo).subscribe({
      next: (result: any) => {
        this.loading = false;
        let uniqueItem = result.data.reduce((prev: any, crr: IVendorListdataDto) => {
          prev[crr.vendorid] = crr
          return prev
        }, {})
        this.vendorslistdata = Object.values(uniqueItem);
        // console.log("this are unique elements", Object.values(uniqueItem))
        // this.loadData(result.data);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  
  selectallrounds() {
    for (let i = 0; i < this.roundlist.length; i++) {
      this.roundlist[i].isroundenabled = this.selectAllrounds;
    }
  }

  vendorboxChnageHandler(vendorItem: IVendorListdataDto) {
    let vendorList = this.vendorslistdata.filter((val) => val.isvendorEnabled);
    if (vendorList.length == this.vendorslistdata.length) {
      this.selectAllvendor = true;
    } else {
      this.selectAllvendor = false;
    }

    for (let i = 0; i < this.vendorslistdata.length; i++) {
      if (this.vendorslistdata[i].isvendorEnabled) {
      }
    }
  }
  selectallvendor() {
    for (let i = 0; i < this.vendorslistdata.length; i++) {
      this.vendorslistdata[i].isvendorEnabled = this.selectAllvendor;
    }
  }
  checkboxChnageHandler(roundItem: IroundlistDto) {
    let RoundList = this.roundlist.filter((val) => val.isroundenabled);
    if (RoundList.length == this.roundlist.length) {
      this.selectAllrounds = true;
    } else {
      this.selectAllrounds = false;
    }
    for (let i = 0; i < this.roundlist.length; i++) {
      if (this.roundlist[i].isroundenabled) {
      }
    }
  }
  downloadCsComparisionSheet() {
    let apivalidation = true;
    let roundlist = this.roundlist.filter((val) => val.isroundenabled);
    let vendorlist = this.vendorslistdata.filter((val) => val.isvendorEnabled);
    if (roundlist.length == 0) {
      this.commonService.showToaster('please select round', false);
    }
    if (vendorlist.length == 0) {
      this.commonService.showToaster('please select vendor', false);
    }
    if (roundlist.length != 0 && vendorlist.length != 0 && apivalidation) {
      let payload = {
        eventId: this.rfqDetail.eventid,
        vendorIds: this.vendorslistdata
          .filter((val) => val.isvendorEnabled)
          .map((val) => val.vendorid)
          .join(','),
        rounds: this.roundlist
          .filter((val) => val.isroundenabled)
          .map((val) => val.evenT_ID)
          .join(','),
      };

      this.eventService.DownloadTechnicalComparisionSheet(payload).subscribe({
        next: (result: any) => {
          const urlBlob = window.URL.createObjectURL(result);
          const link = document.createElement('a');
          link.href = urlBlob;
          link.download = `${this.commonService.eventTypeMapping(this.rfqDetail.eventType)}_${this.rfqDetail.eventNo}_Round_${this.rfqDetail.eventRound}.xlsx`; // Replace 'file.pdf' with the desired filename;
          link.click();
          window.URL.revokeObjectURL(urlBlob);
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
    }
  }
}
