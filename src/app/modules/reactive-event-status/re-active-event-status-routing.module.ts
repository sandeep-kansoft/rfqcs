import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReActiveEventStatusDashboardComponent } from './re-active-event-status-dashboard/re-active-event-status-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ReActiveEventStatusDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReActiveEventStatusRoutingModule { }
