import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserDetail } from '../user-detail';

@Component({
  selector: 'app-create-and-edit-form',
  templateUrl: './create-and-edit-form.component.html',
  styleUrls: ['./create-and-edit-form.component.scss'],
})
export class CreateAndEditFormComponent implements OnInit {
  userForm!: FormGroup;
  appThemeName: string = environment.appThemeName;
  appPurchaseUrl: string = environment.appPurchaseUrl;
  appPreviewUrl: string = environment.appPreviewUrl;
  @Input() userDetailInfo: UserDetail;
  @Output() saveProfileEmitter = new EventEmitter<object>();
  appDemos = environment.appDemos;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  
  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {

    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {

    // console.log("Here in child the data is ", this.userDetailInfo)
    this.userForm = this.formBuilder.group({
      firstName: new FormControl(
        this.userDetailInfo.firstName,
        Validators.required
      ),
      lastName: new FormControl(
        this.userDetailInfo.lastName,
        Validators.required
      ),
      company: new FormControl(this.userDetailInfo.company),
      phoneNo: new FormControl(
        this.userDetailInfo.phoneNo,
        Validators.required
      ),
      companySite: new FormControl(this.userDetailInfo.companySite),
      country: new FormControl(this.userDetailInfo.country),
      language: new FormControl(this.userDetailInfo.language),
      timeZone: new FormControl(this.userDetailInfo.timeZone),
      currency: new FormControl(this.userDetailInfo.currency),
      communicationEmail: new FormControl(
        this.userDetailInfo.communicationEmail
      ),
      communicationPhone: new FormControl(
        this.userDetailInfo.communicationPhone
      ),
      allowMarketing: new FormControl(true),
    });
  }

  saveSettings() {
    this.isLoading$.next(true);
    setTimeout(() => {
      let userData: UserDetail = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        company: this.userForm.value.company,
        phoneNo: this.userForm.value.phoneNo,
        companySite: this.userForm.value.companySite,
        country: this.userForm.value.country,
        language: this.userForm.value.language,
        timeZone: this.userForm.value.timeZone,
        currency: this.userForm.value.currency,
        communicationEmail: this.userForm.value.communicationEmail,
        communicationPhone: this.userForm.value.communicationPhone,
        allowMarketing: this.userForm.value.allowMarketing,
      };



      this.saveProfileEmitter.emit(userData);
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
