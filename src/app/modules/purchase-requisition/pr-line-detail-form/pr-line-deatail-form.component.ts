import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PrLinesDetailResponseDto } from '../purchase-requisition';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';

@Component({
  selector: 'app-pr-line-deatail-form',
  templateUrl: './pr-line-deatail-form.component.html',
  styleUrls: ['./pr-line-deatail-form.component.scss'],
})
export class PrLineDeatailFormComponent {
  PrLinesDetail: PrLinesDetailResponseDto = {
    prtransid: 0,
    prid: 0,
    pR_NUM: '',
    itemcode: '',
    iteM_DESCRIPTION: '',
    itemname: '',
    status: '',
    address: '',
    requestDate: '',
    tefrId: '',
    quantity: 0,
    inProcessQUANTITY: 0,
    usedQty: 0,
    remQty: 0,
    uom: '',
    rate: 0,
    netAmount: 0,
    currency: '',
    consumptionDate: '',
    deliveryName: '',
    deliveryAddress: '',
    attentionInformation: '',
    projecT_ID: 0,
    projecT_NAME: '',
    busiUnit: '',
    costCenterValue: '',
    invWarehouse: '',
    createdDate: '',
    costElementValue: '',
    department: '',
    inventorySite: '',
    bjReason: '',
    bjDetails: '',
    configCode: '',
    warehouseCode: '',
    poNo: '',
    poid: 0,
    rfqno: '',
    buyerid: 0,
    rfqStatus: '',
    siteID: 0,
    buyerstatus: '',
    stateName: '',
    assignBuyer: '',
    pendingPO: 0,
    inProcessPR: 0,
    availableStock: 0,
    stockInOtherWarehouse: 0,
    noofManpower: 0,
    uniT_PRICE: 0,
    lastPurchasePrice: 0,
    remark: '',
    procumentCategory: '',
    ledgerAccountName: '',
    businessUnit: 0,
    costCenter: '',
    gla: '',
    doc: [],
  };
  prLinesDetailLoading: boolean = false;
  @Input() prtransid: number;

  constructor(
    private prService: PurchaseRequistionServiceService,
    public activeModel: NgbActiveModal
  ) { }
  ngOnInit() {
    this.getPrLineDetailByid();
  }

  getPrLineDetailByid() {
    this.prLinesDetailLoading = true;
    this.prService.getPrLineDetailBYid(this.prtransid).subscribe({
      next: (result: any) => {
        this.prLinesDetailLoading = false;
        this.PrLinesDetail = result.data;
      },
      error: (err) => {
        this.prLinesDetailLoading = false;
      },
    });
  }

  closeModel() {
    this.activeModel.close();
  }
}
