import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chat.discontinue',
  templateUrl: './chat.discontinue.component.html',
  styleUrls: ['./chat.discontinue.component.scss']
})
export class ChatDiscontinueComponent {

  closeRemark: string = '';

  constructor(
    private modalService: NgbActiveModal){

  }

  closeModel() {
    this.modalService.close();
  }

  discontinue()
  {
    this.modalService.close(this.closeRemark);
  }
}
