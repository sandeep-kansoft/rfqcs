import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { EventService } from '../../event.service';
import {
  EventDashboardEnums,
  IDefaultResponseDto,
  IReasonDataDto,
  IRfqDetailDataDto,
  IScheduleResponseDto,
} from '../../event.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent {
  loading: boolean = false;
  @Input() rfqDetail: IRfqDetailDataDto;
  @Output() refreshData = new EventEmitter();
  @Output() activetabcondition = new EventEmitter();
  eventStatus: string = '';
  formGroup: FormGroup;
  updateFormGroup: FormGroup;
  showTechnicalBidInputsFlag: boolean = false;
  defaultDateFormat: string = "YYYY-MM-DD HH:mm:ss"
  IndiantimeZone:string="Asia/Kolkata"
  timezoneSelected:any
  priceBidStartDate: Date | null = null
  priceBidEndDate: Date | null = null
  oldPriceEndDate: Date | null = null
  technicalBidStartDate: Date | null = null
  technicalBidEndDate: Date | null = null
  oldTeachnicalEndDate: Date | null = null
  reasonDropdownData: IReasonDataDto[] = [];
  currentReasonId: number | string = ''

  fieldsDisabled: FieldDisabledStatus = {
    isPriceBidStartDisabled: true,
    isPriceBidEndDisabled: true,
    isTechnicalBidStartDisabled: true,
    isTechnicalBidEndDisabled: true,
    oldPriceBidEndDisabled: true,
    oldTechnicalBidEndDisabled: true,
  }
  inValidate: boolean = false
  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private commonServices: CommonService,
    private fb: FormBuilder,
    private fbc: FormBuilder
  ) { }

  getCurrentRoundDate() {
    return new Date(new Date().setHours(new Date().getHours() + 1));
  }
  currdate: Date = new Date();
  date: any = this.currdate.setDate(this.currdate.getDate() - 1);
  saveEventLoader: boolean = false;
  isInvalidate: boolean = false;
  ErrorMessages: any = {};

  public value: Date;
  public disabledDates = (date: Date): boolean => {
    if (date < this.date) {
      return true;
    }
    return false;
  };

  public ngOnInit() {
    this.onInit()
  }


  onInit() {

    if (this.rfqDetail.eventStatus == 'Published') {
      this.getScheduleReasonList()
    } else {
      this.priceBidStartDate = this.setSecondsToZero(new Date())
      this.priceBidEndDate = this.getTodayDateLastTime()
      this.technicalBidStartDate = this.setSecondsToZero(new Date())
      this.technicalBidEndDate = this.getTodayDateLastTime()
      if (this.rfqDetail.eventType == '2' || this.rfqDetail.eventType == '3') {
        this.fieldsDisabled.isPriceBidStartDisabled = false
        this.fieldsDisabled.isTechnicalBidStartDisabled = false
      }
    }
    this.fieldsDisabled.isPriceBidEndDisabled = false
    this.fieldsDisabled.isTechnicalBidEndDisabled = false
    this.getScheduleEventApi();

  }
  scheduleEvent(payload: any, isEventClosed: boolean = false) {
    this.saveEventLoader = true;
    console.log("payload",payload);
    if(this.rfqDetail.eventType == "3"){
payload.scheduleEnd=this.commonServices.convertTimeZone(payload.scheduleEnd,this.timezoneSelected,this.IndiantimeZone,this.defaultDateFormat)
payload.scheduleStart=this.commonServices.convertTimeZone(payload.scheduleStart,this.timezoneSelected,this.IndiantimeZone,this.defaultDateFormat)
payload.technicalBidEnd=this.commonServices.convertTimeZone(payload.technicalBidEnd,this.timezoneSelected,this.IndiantimeZone,this.defaultDateFormat)
payload.technicalBidStart=this.commonServices.convertTimeZone(payload.technicalBidStart,this.timezoneSelected,this.IndiantimeZone,this.defaultDateFormat)
    }
    this.eventService.ScheduleEvent(payload).subscribe({
      next: (result: any) => {
        this.saveEventLoader = false;

        if (result.success) {

          if (isEventClosed) {
            this.closeEvent();
          }

          // this.setTabCompleteStatus(true);
          this.reloadDataFunc()
          this.commonServices.showToaster('event scheduled successful ', true);
        } else {
          this.commonServices.showToaster(result.errorDetail, false);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saveEventLoader = false;
      },
    });
  }

  error: any = {};

  getScheduleEventApi() {
    this.eventService
      .getEventsScheduleDetails(this.rfqDetail.eventid)
      .subscribe({
        next: (result: IDefaultResponseDto<IScheduleResponseDto>) => {
          if (result.success) {
            let data = result.data;
            this.timezoneSelected=result.data.timeZoneShortName
            if(this.rfqDetail.eventType=="3"){
              let priceBidStartDate= data.scheduleStart ? this.commonServices.convertTimeZone(data.scheduleStart,"default",this.timezoneSelected,this.defaultDateFormat)  : this.setSecondsToZero(new Date())
              console.log("before Converting",priceBidStartDate)
              let priceBidEndDate= data.scheduleEnd ? this.commonServices.convertTimeZone(data.scheduleEnd,"default",this.timezoneSelected,this.defaultDateFormat) : this.setSecondsToZero(new Date());
              let technicalBidStartDate= data.technicalBidStart ? this.commonServices.convertTimeZone(data.technicalBidStart,"default",this.timezoneSelected,this.defaultDateFormat) :  this.setSecondsToZero(new Date());
              let technicalBidEndDate= data.technicalBidEnd ? this.commonServices.convertTimeZone(data.technicalBidEnd,"default",this.timezoneSelected,this.defaultDateFormat) :  this.setSecondsToZero(new Date());
              this.priceBidStartDate = priceBidStartDate ? this.setSecondsToZero(priceBidStartDate) : this.setSecondsToZero(new Date());
              this.priceBidEndDate = priceBidEndDate ? this.setSecondsToZero(priceBidEndDate) : this.getTodayDateLastTime()
            this.technicalBidStartDate = technicalBidStartDate ? this.setSecondsToZero(technicalBidStartDate) : this.setSecondsToZero(new Date())
            this.technicalBidEndDate = technicalBidEndDate ? this.setSecondsToZero(technicalBidEndDate) : this.getTodayDateLastTime()
              console.log("price bid start date",this.priceBidStartDate)
            }
            else{
            this.priceBidStartDate = data.scheduleStart ? this.setSecondsToZero(data.scheduleStart) : this.setSecondsToZero(new Date())
            this.priceBidEndDate = data.scheduleEnd ? this.setSecondsToZero(data.scheduleEnd) : this.getTodayDateLastTime()
            this.technicalBidStartDate = data.technicalBidStart ? this.setSecondsToZero(data.technicalBidStart) : this.setSecondsToZero(new Date())
            this.technicalBidEndDate = data.technicalBidEnd ? this.setSecondsToZero(data.technicalBidEnd) : this.getTodayDateLastTime()
            }
            if (data.technicalBidStart && data.technicalBidEnd) {
              this.showTechnicalBidInputsFlag = true;
            }
            if (data.scheduleStart && data.scheduleEnd) {
              // this.setTabCompleteStatus(true);
            }

            if (this.rfqDetail.eventStatus == 'Published') {
              this.oldPriceEndDate = this.priceBidEndDate;
              this.oldTeachnicalEndDate = this.technicalBidEndDate
            }

            this.cdr.detectChanges()
          } else {
            this.commonServices.showToaster(result.errorDetail, false)
          }
        },
        error: (err) => { },
      });
  }


  /**
   * The function sets the seconds and milliseconds of a given date or string to zero.
   * @param {Date | string} date - The parameter `date` can be either a `Date` object or a string
   * representing a date.
   * @returns The function `setSecondsToZero` returns a `Date` object with seconds and milliseconds set
   * to zero, or `null` if the input is falsy.
   */
  setSecondsToZero(date: Date | string): Date | null {
    return date ? new Date(new Date(new Date(date).setSeconds(0)).setMilliseconds(0)) : null;
  }

  reloadDataFunc() {
    this.refreshData.emit()
  }



  /**
   * This function returns the current date with the time set to 23:59.
   * @returns a Date object representing the current date with the time set to 23:59 (11:59 PM).
   */
  getTodayDateLastTime() {
    return this.setSecondsToZero(new Date(new Date(new Date().setHours(23)).setMinutes(59)))
  }




  /**
   * The function returns a boolean value indicating whether a certain type of input field is disabled
   * or not.
   * @param {string} type - string - This parameter is used to identify the type of input field for
   * which the disable status needs to be checked. 
   * @returns A boolean value is being returned.
   */
  getInputDisableStatus(type: string): boolean {
    return this.fieldsDisabled[type]
  }


  /**
   * This function performs validation checks on various fields and returns an error message if any of
   * the checks fail.
   * @param {string} type - string - a string indicating the type of validation to perform. It can be
   * one of the following: 'priceBidStartDate', 'priceBidEndDate', 'technicalBidStartDate',
   * 'technicalBidEndDate', or 'currentReasonId'.
   * @returns a string that represents an error message based on the input type. If there is no error,
   * an empty string is returned.
   */

  getErrorMessage(controlName: string) {
    return this.inValidate ? this.errorValidation(controlName) : ''
  }
  errorValidation(type: string): string {

    let err = ''
    let isAuctionEvent = this.rfqDetail.eventStatus == 'Unpublished' && (this.rfqDetail.eventType == '2' || this.rfqDetail.eventType == '3')
    switch (type) {
      case 'priceBidStartDate':
        if (isAuctionEvent) {
          if (this.priceBidStartDate && this.technicalBidStartDate && (this.priceBidStartDate < this.technicalBidStartDate)) {
            return 'Price bid start date smaller then technical bid start date'
          }

          if (this.priceBidStartDate && this.priceBidEndDate && (this.priceBidStartDate > this.priceBidEndDate)) {
            return 'Price bid start date cannot be greater then end date'
          }
        }
        break;
      case 'priceBidEndDate':
        if (isAuctionEvent) {
          if (this.priceBidStartDate && this.priceBidEndDate && (this.priceBidEndDate < this.priceBidStartDate)) {
            return 'Price bid end date cannot be greater then start date'
          }
        }
        if (this.technicalBidEndDate && this.priceBidEndDate && (this.priceBidEndDate < this.technicalBidEndDate)) {
          return 'Price bid end date cannot be smaller then technical bid end date'
        }

        break;
      case 'technicalBidStartDate':
        if (isAuctionEvent) {
          if (this.priceBidStartDate && this.technicalBidStartDate && (this.technicalBidStartDate > this.priceBidStartDate)) {
            return 'Technical start date cannot be greater price bid start endss'
          }

        }
        return ''
        break;
      case 'technicalBidEndDate':
        if (this.technicalBidEndDate && this.priceBidEndDate && (this.technicalBidEndDate > this.priceBidEndDate)) {
          return 'Technical end time cannot be greater then price bid end time'
        }
        return ''
        break;

      case 'currentReasonId':
        if (this.rfqDetail.eventStatus == 'Published' && (this.currentReasonId == null || this.currentReasonId == '')) {
          return 'Resson filed is required'
        }
        return ''
        break;

      default:
        return ''
        break;
    }

    return err
  }

  /**
   * The function sets the input date to have zero seconds and compares it to the current date, then
   * assigns the input date to a specific variable based on the type parameter.
   * @param {Date} event - A Date object representing the date that was selected or changed.
   * @param {string} type - a string that indicates which date field is being changed (e.g.
   * "priceBidStartDate", "priceBidEndDate", "technicalBidStartDate", "technicalBidEndDate")
   */
  onDateChange(event: any, type: string) {

    let currDateWithSecondsZero = new Date(new Date().setSeconds(0))
    let inputDate = this.setSecondsToZero(event) as any;
    if (new Date(inputDate) < currDateWithSecondsZero) {
      inputDate = this.setSecondsToZero(new Date())
    }


    switch (type) {
      case 'priceBidStartDate':
        this.priceBidStartDate = inputDate
        break;
      case 'priceBidEndDate':
        this.priceBidEndDate = inputDate

        break;
      case 'technicalBidStartDate':
        this.technicalBidStartDate = inputDate

        break;
      case 'technicalBidEndDate':
        this.technicalBidEndDate = inputDate

        break;

      default:
        break;
    }

    // this.cdr.detectChanges();
  }

  /**
   * This function handles the submission of a form and validates certain fields before scheduling an
   * event.
   */
  submitHandler() {
    this.inValidate = true
    if (!this.saveEventLoader) {
      let verifyFieldList = ['priceBidEndDate', 'technicalBidEndDate']
      if (this.rfqDetail.eventStatus == 'Published') { verifyFieldList.push('currentReasonId') }
      if (this.rfqDetail.eventStatus == 'Unpublished' && (this.rfqDetail.eventType == '2' || this.rfqDetail.eventType == '3')) {
        verifyFieldList.push('priceBidStartDate')
        verifyFieldList.push('technicalBidStartDate')
      }
      let isValid = verifyFieldList.every(val => {
        return this.errorValidation(val) == ''
      })
      if (isValid) {

        this.getErrorMessage('technicalBidEndDate')
        let currentDate = this.setSecondsToZero(new Date()) as Date
        if (this.priceBidEndDate != null && this.rfqDetail.eventStatus == 'Published' && this.priceBidEndDate?.toISOString() == currentDate?.toISOString()) {
          this.commonServices.showAlertForWarning("Alert", "If you choose current time, the event will be closed immediately.").then(res => {
            if (res) {
              
              this.scheduleEvent(this.getPayload(), true);
              
              this.cdr.detectChanges();
            }
          })
        } else if (this.priceBidEndDate != null && this.priceBidEndDate < currentDate) {
          this.commonServices.showToaster("Please enter a time that is equal to or greater than the current time.", false)
        } else {
          this.scheduleEvent(this.getPayload(), false)
        }
      }
    }
  }


  /**
   * This function returns a payload object
   * @returns an object with properties eventId, scheduleStart, scheduleEnd, technicalBidStart,
   * technicalBidEnd, and changeReasonId.
   */
  getPayload() {
    let paylod: any = {
      eventId: this.rfqDetail.eventid,
      scheduleStart: null,
      scheduleEnd: null,
      technicalBidStart: null,
      technicalBidEnd: null,
    }
    if (this.rfqDetail.eventStatus == 'Published') {
      paylod.scheduleStart = this.commonServices.convertTimeZone(this.rfqDetail.bidStartTime,this.IndiantimeZone,this.timezoneSelected,this.defaultDateFormat)
      paylod.scheduleEnd = this.commonServices.getDateFormatString(this.priceBidEndDate as Date | string, this.defaultDateFormat)
      paylod.changeReasonId = this.currentReasonId

      if (this.technicalBidEndDate) {
        paylod.technicalBidStart = this.commonServices.convertTimeZone(this.rfqDetail.technicalBidStart,this.IndiantimeZone,this.timezoneSelected,this.defaultDateFormat)
        paylod.technicalBidEnd = this.commonServices.getDateFormatString(this.technicalBidEndDate, this.defaultDateFormat)
      }

    } else {
      paylod.scheduleStart = this.commonServices.getDateFormatString(this.priceBidStartDate as Date, this.defaultDateFormat)
      paylod.scheduleEnd = this.commonServices.getDateFormatString(this.priceBidEndDate as Date | string, this.defaultDateFormat)

      if (this.technicalBidEndDate) {
        paylod.technicalBidStart = this.commonServices.getDateFormatString(this.technicalBidStartDate as Date | string, this.defaultDateFormat)
        paylod.technicalBidEnd = this.commonServices.getDateFormatString(this.technicalBidEndDate, this.defaultDateFormat)
      }
    }
    return paylod
  }

  /**
   * This function retrieves a list of reasons for scheduling events and updates the dropdown menu with
   * the data.
   */
  getScheduleReasonList() {
    this.eventService.GetReasonByType('Schedule').subscribe({
      next: (result: IDefaultResponseDto<IReasonDataDto[]>) => {
        if (result.success) {
          this.reasonDropdownData = result.data;
          let obj: IReasonDataDto = {
            reasonDescription: '',
            reasonId: '',
            reasonType: '',
            reasonName: 'Select Reason',
          };

          this.reasonDropdownData.unshift(obj);
          if (
            this.rfqDetail.eventStatus == 'Published' &&
            this.rfqDetail.scheduleReasonId
          ) {
            this.currentReasonId = this.rfqDetail.scheduleReasonId
          }
          this.cdr.detectChanges();
        }
      },
      error: (_err) => { },
    });
  }

/**
 * This function handles input changes and sets seconds to zero for a given date.
 * @param {any} event - The event parameter is an object that represents the event that triggered the
 * inputChangeHandler function. It could be a keyboard event, a mouse event, or any other type of event
 * depending on the type of input element that the function is attached to.
 * @param {string} type - The type parameter is a string that specifies the type of date being changed.
 * It could be "start" or "end" if this function is being used to handle changes in a date range
 * picker, for example.
 */
  inputChangeHandler(event: any, type: string) {

    if (event?.target?.value) {
      this.onDateChange(this.setSecondsToZero(event?.target?.value), type)

    }
  }


 /**
  * The function calls the eventService to close an event and reloads data if successful.
  */
  closeEvent() {
    this.eventService.closeEvent(this.rfqDetail.eventid).subscribe({
      next: (result: IDefaultResponseDto<boolean>) => {
        if (result.success) {
          this.activetabcondition.emit();
          this.cdr.detectChanges();
          this.reloadDataFunc()
        } else {
          this.commonServices.showToaster(result.errorDetail, false)
        }

      },
      error: (err) => {

      },
    });
  }
  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonServices.checkPermission(key)
  }

}



interface FieldDisabledStatus {
  [key: string]: boolean;
}