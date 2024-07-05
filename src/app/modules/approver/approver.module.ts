import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingCsComponent } from './pending-cs/pending-cs.component';
import { ApproverRoutingModule } from './approver-routing.module';
import { ApprovedRejectedCsComponent } from './approved-rejected-cs/approved-rejected-cs.component';
import { ExcelModule, GridModule } from '@progress/kendo-angular-grid';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RemarkSubmitPopupComponent } from './components/remark-submit-popup/remark-submit-popup.component';
import { ReviewPendingCsPopupComponent } from './components/review-pending-cs-popup/review-pending-cs-popup.component';
import { EventModule } from '../event/event.module';
import { PendingRAComponent } from './pending-ra/pending-ra.component';
import { ApprovedRejectedRAComponent } from './approved-rejected-ra/approved-rejected-ra.component';

let component = [
  PendingCsComponent,
  ApprovedRejectedCsComponent,
  RemarkSubmitPopupComponent,
  ReviewPendingCsPopupComponent,
];

@NgModule({
  declarations: [component, PendingRAComponent, ApprovedRejectedRAComponent],
  imports: [
    CommonModule,
    SharedModule,
    ApproverRoutingModule,
    GridModule,
    InlineSVGModule,
    ReactiveFormsModule,
    NgbModule,
    EventModule,
    ExcelModule,
  ],
  exports: [component],
})
export class ApproverModule {}
