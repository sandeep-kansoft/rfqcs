import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IPriceBidResultDataDto } from 'src/app/modules/event/event.interface';
import { EventService } from 'src/app/modules/event/event.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-submit-bid-pop-up',
  templateUrl: './submit-bid-pop-up.component.html',
  styleUrls: ['./submit-bid-pop-up.component.scss'],
})
export class SubmitBidPopUpComponent {
  isLoading: boolean = false;
  formSubmitLoader: boolean = false;
  @Input() eventId: number;
  inValidate = false;
  file: File;

  currentDate: string | undefined;
  attachName: string = '';
  validityInDays: number = 1;
  validityDate: string | undefined;
  imageData: string;

  constructor(
    public activeModel: NgbActiveModal,
    public eventService: EventService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.currentDate = datePipe
      .transform(new Date(), 'dd MMM YYYY')
      ?.toString();
    this.validityDate = datePipe
      .transform(new Date(), 'dd MMM YYYY')
      ?.toString();
  }
  cancelButtonClick() {
    // this.closeEmitter.emit();
    this.activeModel.close();
  }

  formSubmitHandler() {}
  onSelected(event: any) {
    this.file = event.target.files[0];
    console.log(event);
  }

  calculateValidityInDays() {
    this.validityDate = this.datePipe
      .transform(
        this.commonService.getFutureDateFromRange(this.validityInDays),
        'dd MMM YYYY'
      )
      ?.toString();
  }

  async submitPopUp() {
    let isValid =await this.commonService.eventPublishedChecker(this.eventId) 
if(isValid){
  if (this.validityInDays) {
    this.submitBidServiceCall();
  } else {
    this.commonService.showToaster(
      'Please provide atleast 1 day validity for price bid',
      false
    );
  }
}
else{
  this.commonService.showToaster('Event Already Closed',false);
  this.activeModel.dismiss();
}
  
  }

  submitBidServiceCall() {

    this.commonService.setGlobalLoaderStatus(true);
    const data = document.getElementById('submit-bid-btn');
    data?.setAttribute('data-kt-indicator', 'on');
    this.eventService
      .submitPriceBid(
        this.eventId,
        this.attachName,
        this.validityInDays,
        true,
        this.file,
        this.imageData
      )
      .subscribe({
        next: (result: any) => {
          if (result.success) {
            this.commonService.setGlobalLoaderStatus(false);
            this.activeModel.close(true);
            this.commonService.showToaster('Price bid submitted successfully.',true);
            data?.removeAttribute('data-kt-indicator');
            this.cdr.detectChanges();
          } else {
            this.commonService.setGlobalLoaderStatus(false);
            data?.removeAttribute('data-kt-indicator');
            this.commonService.showToaster(result.errorDetail, false);
          }
        },
        error: (err: any) => {
          this.commonService.setGlobalLoaderStatus(false);
          console.log('error is', err);
          // this.activeModel.close(true);
          this.commonService.showToaster(err.ErrorDetail, false);
          this.commonService.showToaster(err.title, false);
          data?.removeAttribute('data-kt-indicator');
          
          this.cdr.detectChanges();
        },
      });
  }
}
