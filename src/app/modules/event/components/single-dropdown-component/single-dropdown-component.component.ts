import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbActiveModal,
  NgbActiveOffcanvas,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { INextRoundRfqTypePayload, IRfqDetailDataDto } from '../../event.interface';


@Component({
  selector: 'app-single-dropdown-component',
  templateUrl: './single-dropdown-component.component.html',
  styleUrls: ['./single-dropdown-component.component.scss']
})
export class SingleDropdownComponentComponent {
  @Input() title: string;
  @Input() rfqDetail: IRfqDetailDataDto;
  typeOfRfq: string = ''
  typeOfAuction: string = ''
  auctionMode: string = 'Both'
  isAuctionModelVisible: boolean = false


  inValidate: boolean = false;

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private activeModel: NgbActiveModal
  ) { 
    
  }

  public ngOnInit() {
    console.log("this is rfq detail",this.rfqDetail);
  }
  close() {
    this.activeModel.dismiss();
  }

  save() {
    if (this.validatePayload()) {
      this.activeModel.close({
        eventtype: this.typeOfRfq == 'RFQ' ? this.typeOfRfq : this.typeOfAuction,
        eventColorCode: this.typeOfRfq == 'RFQ' ? 'Both' : this.auctionMode
      } as INextRoundRfqTypePayload);
    } else {
      this.inValidate = true
    }
    this.cdr.detectChanges();
  }

  typeOfRfqChangeHandler() {
    this.typeOfAuction = ''
    this.auctionMode = 'Both'
    this.inValidate = false
  }

  validatePayload() {
    if (this.typeOfRfq == '') {
      return false
    }
    if (this.typeOfRfq == 'Auction') {
      if (this.typeOfAuction == '') {
        return false
      }
      if (this.auctionMode == '') {
        return false
      }
    }

    return true

  }

  CheckValidation(){
    if(this.rfqDetail.eventType == "3"){
return false
    }
    else{
      return true;
    }
  }

}



