import { NgModule } from "@angular/core";
import { AdminAllCsComponent } from "./admin-all-cs/admin-all-cs.component";
import { CommonModule } from '@angular/common';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbActiveOffcanvas, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { AdminRfqListComponent } from "./admin-rfq-list/admin-rfq-list.component";
import { AdminRouteModule } from "./admin-routing.module";
const components = [AdminAllCsComponent, AdminRfqListComponent];
@NgModule({
  declarations: [components],
  imports: [
    AdminRouteModule,
    CommonModule,
    GridModule,
    NgbModule,
    InlineSVGModule,
    ExcelModule,
    NgxSkeletonLoaderModule,
    ReactiveFormsModule,
    FormsModule,
    SharedComponentsModule,
  ],
  exports: [components],
  providers: [NgbActiveOffcanvas, NgbActiveModal],
})
export class AdminModule {}
