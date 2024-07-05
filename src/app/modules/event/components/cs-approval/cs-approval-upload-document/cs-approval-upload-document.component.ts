import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { IDefaultResponseDto } from '../../../event.interface';
import { EventService } from '../../../event.service';
@Component({
  selector: 'app-cs-approval-upload-document',
  templateUrl: './cs-approval-upload-document.component.html',
  styleUrls: ['./cs-approval-upload-document.component.scss'],
})
export class CsApprovalUploadDocumentComponent {
  formGroup!: FormGroup;
  isLoading: boolean = false;
  formSubmitLoader: boolean = false;
  fileName:any;
  @Input() eventId: number;
  inValidate = false;
  file: any;
  filePath: any;
  constructor(
    public fb: FormBuilder,
    public activeModel: NgbActiveModal,
    public eventService: EventService,
    private commonService: CommonService
  ) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],

      imageData: ['', Validators.required],
    });
  }
  cancelButtonClick() {
    this.activeModel.dismiss();
  }
  ngOnInit() {
    this.fileName = localStorage.getItem('fileName');
  }
  formSubmitHandler() {
    if (!this.formSubmitLoader) {
      if (this.formGroup.valid) {
        let obj: any = {
          file: this.file,
          filePath: this.filePath,
          description: this.formGroup.get('name')?.value,
        };
        this.activeModel.close(obj);
      } else {
        this.inValidate = true;
      }
    }
  }
  onSelected(event: any) {
    this.file = event.target.files[0];
    this.filePath = event.target.value;
     this.fileName = this.file.name;
     localStorage.setItem('fileName', this.fileName);
     event.target.value = this.fileName;
  }

  getValidation(controlName: string) {
    let control: AbstractControl<any, any> | null =
      this.formGroup.get(controlName);
    return this.inValidate && control?.invalid;
  }
}
