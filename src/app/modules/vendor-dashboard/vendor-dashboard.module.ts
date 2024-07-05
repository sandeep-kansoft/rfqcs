import { ChangeDetectorRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorDashboardListComponent } from './vendor-dashboard-list/vendor-dashboard-list.component';
import { VendorDashboardRoutingModule } from './vendor-dashboard-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EventService } from '../event/event.service';
import { SharedComponentsModule } from "../../shared/components/shared-components.module";
import { RegretModelComponent } from './vendor-dashboard-list/regret-model/regret-model.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PoDetailPopComponent } from './components/po-detail-pop/po-detail-pop.component';
import { EventModule } from "../event/event.module";

const component = [VendorDashboardListComponent, RegretModelComponent, VendorDashboardListComponent, PurchaseOrderComponent, PoDetailPopComponent]

@NgModule({
    declarations: [component],
    exports: [component],
    imports: [
        CommonModule,
        VendorDashboardRoutingModule,
        GridModule,
        NgbModule,
        InlineSVGModule,
        ExcelModule,
        NgxSkeletonLoaderModule,
        ReactiveFormsModule,
        FormsModule,
        SharedComponentsModule,
        EventModule
    ]
})
export class VendorDashboardModule {

}
