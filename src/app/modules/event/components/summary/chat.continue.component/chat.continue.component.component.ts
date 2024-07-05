import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chat.continue.component',
  templateUrl: './chat.continue.component.component.html',
  styleUrls: ['./chat.continue.component.component.scss']
})
export class ChatContinueComponentComponent {

  OpenRemark: string = '';

  constructor(
    private modalService: NgbActiveModal){

  }

  closeModel() {
    this.modalService.close();
  }

  continue()
  {
    this.modalService.close(this.OpenRemark);
  }
}
