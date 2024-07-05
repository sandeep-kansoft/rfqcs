import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsMailApprovalStatusRoutingModule } from './cs-mail-approval-status-routing.module';
import { CsMailApprovalStatusDashboardComponent } from './cs-mail-approval-status-dashboard/cs-mail-approval-status-dashboard.component';

let component = [CsMailApprovalStatusDashboardComponent]

@NgModule({
  declarations: [component],
  imports: [
    CsMailApprovalStatusRoutingModule,
    CommonModule,

  ],
  exports: [component]
})
export class CsMailApprovalStatusModule { }
