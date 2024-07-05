import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReActiveEventStatusDashboardComponent } from './re-active-event-status-dashboard/re-active-event-status-dashboard.component';
import { ReActiveEventStatusRoutingModule } from './re-active-event-status-routing.module';


let component = [ReActiveEventStatusDashboardComponent]

@NgModule({
  // declarations: [
  //   ReActiveEventStatusDashboardComponent
  // ],
  declarations: [component],
  imports: [
    CommonModule,
    ReActiveEventStatusRoutingModule
  ],
  exports: [component]
})
export class ReactiveEventStatusModule { }
