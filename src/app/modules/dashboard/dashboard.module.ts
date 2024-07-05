import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { WidgetsModule } from 'src/app/_metronic/partials';

const components =[DashboardDetailComponent]

@NgModule({
  declarations: [
    components
  ],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    WidgetsModule
  ],
  exports:[components]
})
export class DashboardModule { }
