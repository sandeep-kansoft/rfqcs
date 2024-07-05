import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
import { AuthHTTPService } from '../../../services/auth-http';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-otp-verification-pop-up',
  templateUrl: './otp-verification-pop-up.component.html',
  styleUrls: ['./otp-verification-pop-up.component.scss']
})
export class OtpVerificationPopUpComponent {
  otp: string | null;
  showOtpComponent = true;
  focusToFirstElementAfterValueUpdate: boolean = false;
  @ViewChild(NgOtpInputComponent, { static: false }) ngOtpInput: NgOtpInputComponent;
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    containerClass: 'd-flex justify-content-evenly',
    inputClass: "fs-4 py-2"
  };

  isLoading: boolean = false
  @Input() vendorId: string = ''
  inValidate: boolean = false

  constructor(private activeModal: NgbActiveModal, public loginService: AuthHTTPService, public commonService: CommonService) {

  }

  onOtpChange(otp: any) {
    this.config.inputClass = 'fs-4 py-2'
    this.otp = otp;
  }

  setVal(val: any) {
    this.ngOtpInput.setValue(val);
    if (this.focusToFirstElementAfterValueUpdate) {
      let eleId = this.ngOtpInput.getBoxId(0);
      this.ngOtpInput.focusTo(eleId);
    }
  }

  toggleDisable() {
    if (this.ngOtpInput.otpForm) {
      if (this.ngOtpInput.otpForm.disabled) {
        this.ngOtpInput.otpForm.enable();
      } else {
        this.ngOtpInput.otpForm.disable();
      }
    }
  }

  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }

  cancelButtonClick() {
    this.activeModal.dismiss();
  }

  verifyOtp() {
    this.isLoading = true;
    this.loginService.vendorVerifyOtp(this.vendorId, this.otp ?? '').subscribe({
      next: (response) => {
        this.isLoading = false
        if (response.success) {
          this.activeModal.close();
          this.commonService.showToaster("Otp verified", true);
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

  formSubmitHandler() {
    if (this.isLoading) return
    if (this.otp && this.otp.length === 4) {
      this.verifyOtp();
    } else {
      this.inValidate = true
      this.config.inputClass = 'fs-4 py-2 border-danger'
      this.commonService.showToaster("Please enter valid otp", false)
    }

  }
}
