import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddChargesComponent } from '../add-charges/add-charges.component';

@Component({
  selector: 'app-bid-optimization',
  templateUrl: './bid-optimization.component.html',
  styleUrls: ['./bid-optimization.component.scss']
})
export class BidOptimizationComponent {

  constructor(
    private modalService: NgbModal,
    private cdr:ChangeDetectorRef
  ){

  }


  openAddChargeComponent() {
    debugger;
    const modelRef = this.modalService.open(AddChargesComponent, {
      centered: true,
      size:'lg',
      scrollable: true,
    });

    // modelRef.componentInstance.otherChargesParameterList = JSON.stringify(this.otherChargesParameterList);
    // modelRef.componentInstance.eventId = this.rfqDetail.eventid;
    modelRef.result.then(
      (err) => {
      },
      (data) => {
        if (data) {
          // this.getPriceBidColumnsServiceCall();
          this.cdr.detectChanges();
        }
      }
    );
  }


}
