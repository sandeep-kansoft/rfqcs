import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbActiveModal,
  NgbActiveOffcanvas,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-single-input-modal',
  templateUrl: './single-input-modal.component.html',
  styleUrls: ['./single-input-modal.component.scss'],
})
export class SingleInputModalComponent {
  @Input() title: string;
  @Input() placeholderName: string;
  @Input() value: string;
  inValidate: boolean = false;

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private activeModel: NgbActiveModal
  ) {}

  close() {
    this.activeModel.dismiss();
  }

  save() {
    debugger;
    if (this.value && this.value != '') {
      this.activeModel.dismiss(this.value);
    } else {
      this.inValidate = true;
      this.cdr.detectChanges();
    }
  }
}
