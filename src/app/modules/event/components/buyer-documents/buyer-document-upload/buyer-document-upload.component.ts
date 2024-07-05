import { Component } from '@angular/core';
import { Input } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { IDefaultResponseDto } from '../../../event.interface';
import { EventService } from '../../../event.service';

@Component({
  selector: 'app-buyer-document-upload',
  templateUrl: './buyer-document-upload.component.html',
  styleUrls: ['./buyer-document-upload.component.scss']
})
export class BuyerDocumentUploadComponent {
  formGroup!: FormGroup;
  isLoading: boolean = false;
  formSubmitLoader: boolean = false;
  @Input() eventId: number;
  inValidate = false;
  file: any;
  constructor(
    public fb: FormBuilder,
    public activeModel: NgbActiveModal,
    public eventService: EventService,
    private commonService: CommonService
  ) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      imageData: ['', Validators.required],
    });
  }
  cancelButtonClick() {
    // this.closeEmitter.emit();
    this.activeModel.close();
  }
  formSubmitHandler() {
    if (!this.formSubmitLoader) {
      if (this.formGroup.valid) {
        this.uploadBuyerDocument();
      } else {
        this.inValidate = true;
      }
    }
  }
  onSelected(event: any) {
    this.file = event.target.files[0];
  }
  uploadBuyerDocument() {
    this.formSubmitLoader = true;
    var formData: any = new FormData();
    formData.append('files', this.formGroup.get('imageData')?.value);
    let documentName = this.formGroup.get('name')?.value;
    let remarks = this.formGroup.get('remarks')?.value;
    this.eventService
      .uploadBuyerAttachmentApi(
        this.eventId,
        documentName,
        remarks,
        this.file,
        this.formGroup.get('imageData')?.value
      )
      .subscribe({
        next: (result: IDefaultResponseDto<any>) => {
          this.formSubmitLoader = false;
          this.activeModel.close(result);
        },
        error: (err: any) => {
          this.formSubmitLoader = false;
          console.log('error is', err);
        },
      });
  }

  getValidation(controlName: string) {
    let control: AbstractControl<any, any> | null =
      this.formGroup.get(controlName);
    return this.inValidate && control?.invalid;
  }
}
