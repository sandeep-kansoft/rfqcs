import { Component, Input, ChangeDetectorRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../event.service';
import { IRfqDetailDataDto, ITNCVendorDeviationdDto } from '../../../event.interface';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-terms-and-condition-deviate-reason',
  templateUrl: './terms-and-condition-deviate-reason.component.html',
  styleUrls: ['./terms-and-condition-deviate-reason.component.scss'],
})
export class TermsAndConditionDeviateReasonComponent {
  formGroup: FormGroup;
  inValidate: boolean = false;
  formSubmitLoader: boolean = false;
  @Input() eventId: number;
  @Input() item: ITNCVendorDeviationdDto;
  @Input() rfqDetail: IRfqDetailDataDto;


  constructor(
    private activeModel: NgbActiveModal,
    private fb: FormBuilder,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService
  ) {
    this.formGroup = this.fb.group({
      clauseNo: [''],
      clauseInformation: [''],
      deviation: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.formGroup.get('clauseNo')?.setValue(this.item?.tncid);
    this.formGroup.get('clauseInformation')?.setValue(this.item?.terms);
    this.formGroup.get('clauseNo')?.disable();
    this.formGroup.get('clauseInformation')?.disable();
  }

  cancelButtonClick() {
    // this.closeEmitter.emit();
    this.activeModel.dismiss();
  }

  getValidation(controlName: string) {
    let control: AbstractControl<any, any> | null =
      this.formGroup.get(controlName);
    return this.inValidate && control?.invalid;
  }

  formSubmitHandler() {
    this.inValidate = true;
    if (this.formGroup.valid) {
      this.deviateVendorDeviationListApi();
    }
  }

  deviateVendorDeviationListApi() {
    if (!this.formSubmitLoader) {
      this.formSubmitLoader = false;

      let payload = {
        tncid: this.item.tncid,
        eventid: this.eventId,
        vendorid: this.item.vendorid,
        deviation: this.formGroup.get('deviation')?.value,
      };

      if (this.rfqDetail.vendorStatus == 'Participated' && this.rfqDetail.eventStatus == 'Published') {
        this.eventService.postDeviateVendorDeviation(payload).subscribe({
          next: (result: any) => {
            if (result.success) {
              this.commonService.showToaster(
                'Clause Deviated Successfully',
                true
              );
              this.activeModel.close(true);
            } else {
              this.activeModel.dismiss(true);
              this.commonService.showToaster(result.errorDetail, false);
            }
            this.formSubmitLoader = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.activeModel.dismiss(true);
            this.formSubmitLoader = false;
            console.log(err);
          },
        });
      } else {
        this.commonService.showToaster('Permission is not allowed.', false);

      }

    }
  }
}
