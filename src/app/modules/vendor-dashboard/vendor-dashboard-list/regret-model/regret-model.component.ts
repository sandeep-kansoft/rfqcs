import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IGetVendorWiseEventsResponseDto } from 'src/app/modules/event/event.interface';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from '../../../event/event.service';

@Component({
  selector: 'app-regret-model',
  templateUrl: './regret-model.component.html',
  styleUrls: ['./regret-model.component.scss'],
})
export class RegretModelComponent {
  formSubmitLoader: boolean = false;
  @Input() eventTitle: string;
  @Input() eventNo: number;
  @Input() eventId: number;
  formGroup!: FormGroup;
  inValidate = false;
  saveChangesLoader: boolean = false;
  constructor(
    private modalService: NgbActiveModal,
    private eventService: EventService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      eventNo: ['', []],
      eventName: ['', []],
      projectName: [''],
      location: [''],
      regretType: ['', Validators.required],
      comment: ['', Validators.required],
    });
  }

  public ngOnInit() {
    this.formGroup.get('eventNo')?.setValue(this.eventNo);
    this.formGroup.get('eventName')?.setValue(this.eventTitle);

    this.formGroup.get('eventNo')?.disable();
    this.formGroup.get('eventName')?.disable();
    this.formGroup.get('projectName')?.disable();
    this.formGroup.get('location')?.disable();
  }

  close() {
    this.modalService.dismiss();
  }
  formSubmitHandler() {
    this.inValidate = true;
    if (this.formGroup.valid) {
      if (!this.saveChangesLoader) {
        this.regretParticipateRfq(this.eventId, false);
      }
    }
  }



  regretParticipateRfq(eventId: number, forParticipate: boolean) {
    this.saveChangesLoader = true;
    const payload: any = {
      eventId: eventId,
      participate: forParticipate,
      regret: !forParticipate,
      regretData: {
        regretType: forParticipate
          ? ''
          : this.formGroup.get('regretType')?.value,
        regretRemark: forParticipate
          ? ''
          : this.formGroup.get('comment')?.value,
      },
    };

    this.eventService.RegretParticipateRfq(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonService.showToaster(
            `Vendor ${
              forParticipate ? 'participated' : 'regreted'
            } successfully `,
            true
          );
          this.modalService.close('success');
        } else {
          this.commonService.showToaster(result.errorDetail, false);
          this.modalService.close('failed');
        }

        this.saveChangesLoader = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saveChangesLoader = false;
        this.cdr.detectChanges();
      },
    });
  }
  getValidation(controlName: string) {
    let control: AbstractControl<any, any> | null =
      this.formGroup.get(controlName);
    return this.inValidate && control?.invalid;
  }
}
