import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PendingCsComponent } from "./pending-cs/pending-cs.component";
import { ApprovedRejectedCsComponent } from "./approved-rejected-cs/approved-rejected-cs.component";
import { PendingRAComponent } from "./pending-ra/pending-ra.component";
import { ApprovedRejectedRAComponent } from "./approved-rejected-ra/approved-rejected-ra.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Pending',
        component: PendingCsComponent,
      },
      {
        path: 'All',
        component: ApprovedRejectedCsComponent,
      },
      {
        path: 'PendingRA',
        component: PendingRAComponent,
      },
      {
        path: 'ApproveRejectRA',
        component: ApprovedRejectedRAComponent,
      },

    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApproverRoutingModule { }
