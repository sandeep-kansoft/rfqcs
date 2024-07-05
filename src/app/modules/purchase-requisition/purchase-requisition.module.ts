import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRequestRoutingModule } from './purchase-requisition-routing.module';
import { PrModalViewComponent } from './pr-modal-view/pr-modal-view.component';
import { PrGridViewComponent } from './pr-grid-view/pr-grid-view.component';
import { PrDetailViewComponent } from './pr-detail-view/pr-detail-view.component';
import { PrOverviewComponent } from './pr-overview/pr-overview.component';
import { ExcelModule, GridModule } from '@progress/kendo-angular-grid';
import { NgbActiveOffcanvas, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrHistoryDetailComponent } from './pr-history-detail/pr-history-detail.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PrMinMaxComponent } from './pr-min-max/pr-min-max.component';

import { DemoPageComponent } from './demo-page/demo-page.component';
import { PrAllViewComponent } from './pr-all-view/pr-all-view.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrMinMaxPendingOrderOnhandComponent } from './pr-min-max-pending-order-onhand/pr-min-max-pending-order-onhand.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateAuctionComponent } from './create-auction/create-auction.component';
import { MinMaxPrPurchaseOrderComponent } from './min-max-pr-purchase-order/min-max-pr-purchase-order.component';
import { PrLineHistoryGridComponent } from './pr-line-history-grid/pr-line-history-grid.component';
import { PrLineGridViewComponent } from './pr-line-grid-view/pr-line-grid-view.component';
import { PrHeaderFormComponent } from './pr-header-form/pr-header-form.component';
import { PrLineDeatailFormComponent } from './pr-line-detail-form/pr-line-deatail-form.component';
import { DatePipe } from '@angular/common';
import { ApprovedRejectedCsComponent } from '../approver/approved-rejected-cs/approved-rejected-cs.component';
const components = [
  PrOverviewComponent,
  PrModalViewComponent,
  PrGridViewComponent,
  PrDetailViewComponent,
  PrHistoryDetailComponent,
  PrMinMaxComponent,
  PrAllViewComponent,
  DemoPageComponent,
  PrMinMaxPendingOrderOnhandComponent,
  CreateAuctionComponent,
  MinMaxPrPurchaseOrderComponent,
  PrLineHistoryGridComponent,
  PrLineGridViewComponent,
  PrHeaderFormComponent,
  PrLineDeatailFormComponent,
  
];

@NgModule({
  declarations: [components],
  imports: [
    CommonModule,
    PurchaseRequestRoutingModule,
    GridModule,
    NgbModule,
    InlineSVGModule,
    ExcelModule,
    NgxSkeletonLoaderModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    
  ],
  providers: [DatePipe, NgbActiveOffcanvas],
  exports: [components],
})
export class PurchaseRequestModule {}
