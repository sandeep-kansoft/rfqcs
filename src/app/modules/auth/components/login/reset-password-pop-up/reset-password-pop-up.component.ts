import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthHTTPService } from '../../../services/auth-http';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-reset-password-pop-up',
  templateUrl: './reset-password-pop-up.component.html',
  styleUrls: ['./reset-password-pop-up.component.scss']
})
export class ResetPasswordPopUpComponent {
  formGroup: FormGroup
  inValidate: boolean = false
  isLoading: boolean = false
  @Input() vendorId: string = ''

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;


  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder,
    private loginService: AuthHTTPService, private commonService: CommonService) {
    this.formGroup = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: this.passwordMatchValidator })


  }


  getValidation(controlName: string) {
    let control: AbstractControl<any, any> | null =
      this.formGroup.get(controlName);
    return this.inValidate && control?.invalid;
  }


  formSubmitHandler() {
    if (this.isLoading) return
    if (this.formGroup.valid) {
      this.updatePassword()
    } else {
      this.inValidate = true
    }

  }

  cancelButtonClick() {
    this.activeModal.dismiss();
  }


  passwordMatchValidator(control: any): ValidationErrors | null {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;

    if (!confirmPassword) {
      control.get('confirmPassword').setErrors({ required: true });
      return { require: true };
    }
    // else if (confirmPassword.length < 6) {
    //   control.get('confirmPassword').setErrors({ minlength: true });
    //   return { passwordMismatch: true };
    // }
    else if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      control.get('confirmPassword').setErrors(null);
      return null;
    }
  }


  getErrorMessage(controlName: string) {
    let control: AbstractControl<any, any> | null =
      this.formGroup.get(controlName);
    let errMessage = ''
    if (control?.errors) {
      let err = Object.keys(control?.errors)[0]
      switch (err) {
        case 'required':
          errMessage = `${controlName =='password' ? 'Password' :'Confirm password'} field is required`
          break;
        case 'minlength':
          errMessage = `Minimum length of field must be equal or greater 6 character`

          break;
        case 'passwordMismatch':
          errMessage = 'Confirm password must be same as password'
          break;

        default:
          break;
      }
    }
    return errMessage;
  }

  updatePassword() {
    this.isLoading = true;
    const { password, confirmPassword } = this.formGroup.value
    this.loginService.vendorUpdatePassword(password.trim(), confirmPassword.trim(), this.vendorId).subscribe({
      next: (response) => {
        this.isLoading = false
        if (response.success) {
          this.cancelButtonClick();
          this.commonService.showToaster("Password update successfully", true);
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

}
