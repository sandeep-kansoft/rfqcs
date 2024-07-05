import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRfqListComponent } from './admin-rfq-list/admin-rfq-list.component';
import { AdminAllCsComponent } from './admin-all-cs/admin-all-cs.component';

const routes: Routes = [
  {
    path: 'AllRFQ',
    component: AdminRfqListComponent,
  },
  {
    path: 'AllCS',
    component: AdminAllCsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRouteModule {}
