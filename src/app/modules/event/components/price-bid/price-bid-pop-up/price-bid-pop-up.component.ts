import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, forkJoin, map, of } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { IPriceBidChargesListDataDto, IPriceBidColumnDataDto, IPriceBidResultDataDto, IRfqDetailDataDto } from '../../../event.interface';
import { EventService } from '../../../event.service';

@Component({
  selector: 'app-price-bid-pop-up',
  templateUrl: './price-bid-pop-up.component.html',
  styleUrls: ['./price-bid-pop-up.component.scss']
})
export class PriceBidPopUpComponent {

  priceBidChargesdropdown:any[]=[]
  loading: boolean = false;
  priceBidChargesList: IPriceBidChargesListDataDto[];

  priceBidParameterListHere: Array<IPriceBidColumnDataDto> = [];
  @Input() priceBidParameterList: any = [];
  @Input() eventId: number;
  @Input() rfqDetail: IRfqDetailDataDto;
  selectDescription: string = '-----Select-----'


  typeAccess: any = {
    ADD_PRICE_BID_CHARGES: 'Add Price Bid Charges',
  }

  userType: string | undefined;

  constructor(
    private commonService: CommonService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public modal: NgbModal,
  ) {

    this.getPriceBidChargesServiceCall();
  }

  public ngOnInit() {
    let authData = this.commonService.getAuthData();
    this.userType = authData?.userRole;

    this.priceBidParameterListHere = JSON.parse(this.priceBidParameterList);
  }

  close() {
    this.modal.dismissAll();
  }

  //Price Bid Charges
  getPriceBidChargesServiceCall() {
    this.loading = true;
    this.eventService.getPriceBidCharges().subscribe({
      next: (result: IPriceBidResultDataDto) => {
        this.loading = false;
        let obj: IPriceBidChargesListDataDto = {
          charges_ID: 0,
          markupCode: this.selectDescription,
          transTxt: '',
        }
        this.priceBidChargesList = result.data;
        this.priceBidChargesList.unshift(obj)
        this.priceBidChargesdropdown = this.priceBidChargesList.map(val => {
          return { value: val.markupCode, label: val.markupCode }
        })
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //inco terms card list
  addPriceBidCharge() {
    let item = {
      pB_HeaderID: 0,
      eventId: this.eventId,
      headerName: '',
      headerType: 'PriceBid',
      isDeleted: false,
      isError: false,
      isEdit: false,
      isCustom: false
    }
    this.priceBidParameterListHere.push(item);
  }

  removePriceBidParameter(index: number) {
    this.priceBidParameterListHere.splice(index, 1);
  }

  saveButtonClicked() {
    let dismiss = true;
    let itrateList: any[] = []
    this.getNonDeletedPriceBidCharge().forEach((element: any) => {
      if (itrateList.includes(element.headerName)) {
        element.isError = true;
        dismiss = false
      } else {
        itrateList.push(element.headerName)
      }


      if (element.headerName === '') {
        element.isError = true;
        dismiss = false
      }
    }
    )
    if (dismiss)
      this.callFunctionForSaveChanges();
  }

  callFunctionForSaveChanges() {



    let newItems = this.priceBidParameterListHere.filter((val) => val.pB_HeaderID == 0 && !val.isDeleted);
    let editItems = this.priceBidParameterListHere.filter((val) => val.pB_HeaderID != 0 && val.isEdit && !val.isDeleted);
    let deletedItems = this.priceBidParameterListHere.filter((val) => val.pB_HeaderID != 0 && val.isDeleted);
    let newPriceBidCharges = this.priceBidParameterListHere.filter((val: any) => val.pB_HeaderID == 0 && !val.isDeleted && val.isCustom);



    let newColumns = newItems.map((val: any) => {
      return ({
        columnName: val.headerName,
        columnType: val.headerType
      })
    })

    let editColumns = editItems.map((val: any) => {
      return ({
        pB_HeaderID: val.pB_HeaderID,
        columnName: val.headerName,
        columnType: val.headerType
      })
    })

    let deletedColumns = deletedItems.map((val: any) => {
      return (
        val.pB_HeaderID
      )
    })

    let newPriceBidColumns = newPriceBidCharges.map((val: any) => {
      return (val.headerName)
    })

    this.callApisForColumns(newColumns, editColumns, deletedColumns, newPriceBidColumns)
  }

  callApisForColumns(newColumns: any, editColumns?: any, deletedColumns?: any, newPriceBidColumns?: any) {


    let newColumnsPayload = {
      "eventId": this.eventId,
      "pbColoumnDetails": newColumns
    }

    let editColumnsPayload = {
      "eventId": this.eventId,
      "pbColoumnDetails": editColumns
    }

    let source = [];
    if (newColumns && newColumns.length != 0) {
      source.push(this.eventService.addPriceBidColumns(newColumnsPayload).pipe(
        map((res) => res),
        catchError((e) => of(e))
      ))
    }
    if (editColumns && editColumns.length != 0) {
      source.push(this.eventService.updatePriceBidColumns(editColumnsPayload).pipe(
        map((res) => res),
        catchError((e) => of(e))
      ))
    }

    if (deletedColumns && deletedColumns.length != 0) {
      source.push(this.eventService.deletePriceBidColumns(deletedColumns).pipe(
        map((res) => res),
        catchError((e) => of(e))
      ))
    }


    if (newPriceBidColumns && newPriceBidColumns.length != 0) {
      source.push(this.eventService.postPriceBidCharges(newPriceBidColumns).pipe(
        map((res) => res),
        catchError((e) => of(e))
      ))
    }

    if (source.length != 0) {
      const data = document.getElementById('sumbitbtn');
      data?.setAttribute('data-kt-indicator', 'on');
      forkJoin(source).subscribe({
        next: (response: any) => {
          if (response[0].success) {
            this.commonService.showToaster('Save changes successfully.', true);
            data?.removeAttribute('data-kt-indicator');
            this.modal.dismissAll(true);
          }
        },
        error: (error: any) => {
          data?.removeAttribute('data-kt-indicator');
          this.commonService.showToaster(error?.error, false);
        },
      });
    }

  }



  getNonDeletedPriceBidCharge() {
    return this.priceBidParameterListHere.filter((val: any) => !val.isDeleted);
  }

  checkValueCheckbox(item: any) {
    if (item.isCustom) {
      item.headerName = '';
    }
    else {
      item.headerName = this.priceBidChargesList[0].markupCode;
    }
  }

  checkConditionForAccess(type: string): boolean {
    let eventStatus = this.rfqDetail.eventStatus;

    switch (this.userType) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          switch (type) {
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return false;
          }
        } else if (eventStatus == 'Unpublished') {
          switch (type) {
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return true;
          }
        }

        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          switch (type) {
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return false;

          }
        } else if (eventStatus == 'Unpublished') {
          switch (type) {
            case this.typeAccess.ADD_PRICE_BID_CHARGES:
              return false;

          }
        }
        break;
      case 'Requester/Technical':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return false;
        }
        break;

      default:
        return false;
        break;
    }

    return false;
  }

}
