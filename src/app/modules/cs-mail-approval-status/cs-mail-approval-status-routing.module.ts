import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsMailApprovalStatusDashboardComponent } from './cs-mail-approval-status-dashboard/cs-mail-approval-status-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: CsMailApprovalStatusDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CsMailApprovalStatusRoutingModule { }
