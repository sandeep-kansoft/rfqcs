import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, forkJoin, map, of } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { IPriceBidChargesListDataDto, IPriceBidColumnDataDto, IPriceBidResultDataDto, IRfqDetailDataDto } from '../../../event.interface';
import { EventService } from '../../../event.service';

@Component({
  selector: 'app-other-charges-pop-up',
  templateUrl: './other-charges-pop-up.component.html',
  styleUrls: ['./other-charges-pop-up.component.scss']
})
export class OtherChargesPopUpComponent {
  loading: boolean = false;
  @Input() otherChargesParameterList: any = [];
  @Input() eventId: number;
  otherChargesParameterListHere: Array<IPriceBidColumnDataDto> = [];
  @Input() rfqDetail: IRfqDetailDataDto;

  typeAccess: any = {
    CHARGES_REMARKS_COLOUMNS: 'Charges Remarks Coloumns',
  }

  userType: string | undefined;

  constructor(
    public modal: NgbModal,
    public commonService: CommonService,
    public eventService: EventService
  ) {
    debugger;
    setTimeout(() => {
      this.otherChargesParameterListHere = JSON.parse(this.otherChargesParameterList);
    }, 100);

  }

  public ngOnInit() {
    let authData = this.commonService.getAuthData();
    this.userType = authData?.userRole; 
  }

  close() {
    this.modal.dismissAll();
  }



  addOtherChargesParameter() {
    let item = {
      pB_HeaderID: 0,
      eventId: this.eventId,
      headerName: '',
      headerType: 'Other',
      isDeleted: false,
      isError: false,
      isEdit: false,
    }
    this.otherChargesParameterListHere.push(item);
  }

  saveButtonClicked() {


    let dismiss = true;
    this.getNonDeletedOtherCharges().forEach((element: any) => {
      if (element.headerName === '') {
        element.isError = true;
        dismiss = false
      }
    }
    )
    if (dismiss) {
      this.callFunctionForSaveChanges()

    }
  }

  callFunctionForSaveChanges() {


    let newItems = this.otherChargesParameterListHere.filter((val) => val.pB_HeaderID == 0 && !val.isDeleted);
    let editItems = this.otherChargesParameterListHere.filter((val) => val.pB_HeaderID != 0 && val.isEdit && !val.isDeleted);
    let deletedItems = this.otherChargesParameterListHere.filter((val) => val.pB_HeaderID != 0 && val.isDeleted);

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

    this.callApisForColumns(newColumns, editColumns, deletedColumns)
  }

  callApisForColumns(newColumns: any, editColumns?: any, deletedColumns?: any) {
    const data = document.getElementById('sumbitbtn');
    data?.setAttribute('data-kt-indicator', 'on');

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


  getNonDeletedOtherCharges() {
    return this.otherChargesParameterListHere.filter((val: any) => !val.isDeleted);
  }

  
  checkConditionForAccess(type: string): boolean {
    let eventStatus = this.rfqDetail.eventStatus;

    switch (this.userType) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          switch (type) {
            case this.typeAccess.CHARGES_REMARKS_COLOUMNS:
              return false;
          }
        } else if (eventStatus == 'Unpublished') {
          switch (type) {
            case this.typeAccess.CHARGES_REMARKS_COLOUMNS:
              return true;
          }
        }

        break;
      case 'Vendor':
        if (eventStatus == 'Published') {
          switch (type) {
            case this.typeAccess.CHARGES_REMARKS_COLOUMNS:
              return false;

          }
        } else if (eventStatus == 'Unpublished') {
          switch (type) {
            case this.typeAccess.CHARGES_REMARKS_COLOUMNS:
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
