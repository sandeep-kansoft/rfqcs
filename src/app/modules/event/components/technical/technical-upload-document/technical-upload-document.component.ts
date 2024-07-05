import { Component, Input } from '@angular/core';
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
  selector: 'app-technical-upload-document',
  templateUrl: './technical-upload-document.component.html',
  styleUrls: ['./technical-upload-document.component.scss'],
})
export class TechnicalUploadDocumentComponent {
  formGroup!: FormGroup;
  isLoading: boolean = false;
  formSubmitLoader: boolean = false;
  @Input() eventId: number;
  inValidate = false;
  file: any;
  fileName:any

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
 public ngOnInit():void {
   this.fileName = localStorage.getItem('uploadedFileName');

   }
  cancelButtonClick() {

    this.activeModel.close();
    localStorage.setItem('uploadedFileName', this.fileName);
  }
  formSubmitHandler() {
    if (!this.formSubmitLoader) {
      if (this.formGroup.valid) {
        this.uploadTechnicalAttachment();
      } else {
        this.inValidate = true;
      }
    }
  }
  onSelected(event: any) {
    this.file = event.target.files[0];
    this.fileName=this.file.name;
    localStorage.setItem('uploadedFileName', this.fileName);
  }
  uploadTechnicalAttachment() {
    this.formSubmitLoader = true;
    var formData: any = new FormData();
    formData.append('files', this.formGroup.get('imageData')?.value);
    let documentName = this.formGroup.get('name')?.value;
    let remarks = this.formGroup.get('remarks')?.value;


    this.eventService
      .uploadTechicalAttachmentApi(
        this.eventId,
        documentName,
        remarks,
        this.file,
        this.formGroup.get('imageData')?.value
      )
      .subscribe({
        next: (result: IDefaultResponseDto<any>) => {
          if (result.success) {
            this.formSubmitLoader = false;
            this.activeModel.close(result);
          } else {
            this.formSubmitLoader = false;
            this.commonService.showToaster(result.errorDetail, false)
          }

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
