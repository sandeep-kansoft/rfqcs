import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VendorDashboardListComponent } from "./vendor-dashboard-list/vendor-dashboard-list.component";
import { PurchaseOrderComponent } from "./purchase-order/purchase-order.component";

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'VendorDashboard',
          component: VendorDashboardListComponent,
        },
        {
          path: 'VendorPO',
          component: PurchaseOrderComponent,
        },
      ],
    },
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class VendorDashboardRoutingModule { }