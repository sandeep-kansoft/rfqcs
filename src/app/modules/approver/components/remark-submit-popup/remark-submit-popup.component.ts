import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-remark-submit-popup',
  templateUrl: './remark-submit-popup.component.html',
  styleUrls: ['./remark-submit-popup.component.scss']
})
export class RemarkSubmitPopupComponent {
  @Input() buyerRemark: string;
  @Input() ReasonRemark:string;
  public RemarkString:string;

  constructor( private popupModel: NgbModal) {

  }


  SubmitRemark() {

  }
  CloseModel(){
    // alert("test");
    this.popupModel.dismissAll();
  }
}
