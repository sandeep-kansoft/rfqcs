import { Component, Input } from '@angular/core';
import { PrLineHeaderDetail } from '../purchase-requisition';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';

@Component({
  selector: 'app-pr-header-form',
  templateUrl: './pr-header-form.component.html',
  styleUrls: ['./pr-header-form.component.scss'],
})
export class PrHeaderFormComponent {
  PrheaderDetail: PrLineHeaderDetail = {
    pR_Lines: [],
    prepareR_ID: 0,
    prid: 0,
    pR_NUM: '',
    siteId: 0,
    siteName: '',
    prtype: '',
    prSubType: '',
    creatioN_DATE: '',
    projecT_NAME: '',
    description: '',
    tefrId: '',
    bjReason: '',
    bjDetails: '',
    woNumber: '',
    totalValue: 0,
    requester: '',
    preparer: '',
    departmentCode: '',
    departmentName: '',
    warehouse: '',
    enterby: '',
    assignBuyer: '',
    pR_STATUS: '',
    enterDate: '',
    attachment: '',
    mConsumptionDate: '',
    doc: [],
  };
  @Input() prId: number;
  isLoading: boolean = false;
  constructor(private prService: PurchaseRequistionServiceService) { }

  ngOnInit() {
    this.getPrHeaderDetailByid();
  }

  getPrHeaderDetailByid() {
    this.isLoading = true;
    this.prService.getPrHeaderDetailBYid(this.prId).subscribe({
      next: (result: any) => {
        this.PrheaderDetail = result.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }
}
