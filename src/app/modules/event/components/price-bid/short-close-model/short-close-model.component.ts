import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../event.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-short-close-model',
  templateUrl: './short-close-model.component.html',
  styleUrls: ['./short-close-model.component.scss']
})
export class ShortCloseModelComponent {
  @Input() itemCode: number;
  @Input() shortcloseqty: number;
  @Input() eventTranId: number;
  inValidate: boolean = false;
  value: any;
  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private commonServices: CommonService,
    private activeModel: NgbActiveModal,
  ) { }







  close() {
    this.activeModel.dismiss();
  }

  save() {
    if (this.value && this.value != '') {

      this.activeModel.close({ eventTranId: this.eventTranId, reason: this.value })
    } else {
      this.inValidate = true;
      this.cdr.detectChanges();
    }
  }



}
