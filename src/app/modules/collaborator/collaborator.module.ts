import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaboratorDashboardComponent } from './collaborator-dashboard/collaborator-dashboard.component';
import { CollaboratorRoutingModule } from './collaborator-routing.module';
import { ChangeDetectorRef } from '@angular/core';



import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EventService } from '../event/event.service';
import { SharedComponentsModule } from "../../shared/components/shared-components.module";

const components = [CollaboratorDashboardComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, CollaboratorRoutingModule,
    CommonModule,
    GridModule,
    NgbModule,
    InlineSVGModule,
    ExcelModule,
    NgxSkeletonLoaderModule,
    ReactiveFormsModule,
    FormsModule,
    SharedComponentsModule],
  exports: [components],
})
export class CollaboratorModule {}
