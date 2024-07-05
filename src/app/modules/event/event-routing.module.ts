import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreatRfqAuctionComponent } from "./creat-rfq-auction/creat-rfq-auction.component";
import { EventDashboardComponent } from "./event-dashboard/event-dashboard.component";
import { RfqAuctionListComponent } from "./rfq-auction-list/rfq-auction-list.component";
import { UserComponent } from "./components/user/user.component";
import { MyAwardCsComponent } from "./my-award-cs/my-award-cs.component";
import { ReverseAuctionListComponent } from "./reverse-auction-list/reverse-auction-list.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'EventDashboard',
        component: EventDashboardComponent,
      },
      {
        path: 'RFQList',
        component: RfqAuctionListComponent,
      },
      { path: 'CreateRfqAuction', component: CreatRfqAuctionComponent },
      { path: 'MyAwardVS', component: MyAwardCsComponent },
      { path: 'ReverseAuction', component: ReverseAuctionListComponent },
      { path: '', redirectTo: 'RFQList', pathMatch: 'full' },
      // { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule { }
