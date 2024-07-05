import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthHTTPService } from '../../../services/auth-http';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-forgot-password-pop-up',
  templateUrl: './forgot-password-pop-up.component.html',
  styleUrls: ['./forgot-password-pop-up.component.scss']
})
export class ForgotPasswordPopUpComponent {

  formGroup: FormGroup
  inValidate: boolean = false
  isLoading: boolean = false

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder,
    private loginService: AuthHTTPService, private commonService: CommonService) {
    this.formGroup = this.fb.group({
      vendorCode: ['', [Validators.required]],
      vendorEmail: ['', [Validators.required, Validators.email]]
    })
  }


  getValidation(controlName: string) {
    let control: AbstractControl<any, any> | null =
      this.formGroup.get(controlName);
    return this.inValidate && control?.invalid;
  }


  formSubmitHandler() {
    if (this.isLoading) return
    if (this.formGroup.valid) {
      this.sendVendorForgotPasswordOtp();
    } else {
      this.inValidate = true
    }

  }

  cancelButtonClick() {
    this.activeModal.dismiss();
  }

  sendVendorForgotPasswordOtp() {
    this.isLoading = true;
    const { vendorCode, vendorEmail } = this.formGroup.value
    this.loginService.sendVendorForgotPasswordOtp(vendorEmail.trim(), vendorCode.trim()).subscribe({
      next: (response) => {
        this.isLoading = false
        if (response.success) {
          this.cancelButtonClick();
          this.commonService.showToaster("Otp send to your email id", true);
        } else {
          this.commonService.showToaster(response.errorDetail, false);
        }


      }, error: (err) => {
        this.isLoading = false;
        this.commonService.showToaster(err.errorDetail, false)
        console.log("err", err)
      }
    })
  }

  getErrorType(controlName: string) {
    let control: AbstractControl<any, any> | null =
      this.formGroup.get(controlName);
    let errType = ''
    if (control?.errors) {
      errType = Object.keys(control?.errors)[0]
    }

    return errType
  }
}
