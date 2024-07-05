import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardDetailComponent } from "./dashboard-detail/dashboard-detail.component";


const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'DashboardDetail',
          component: DashboardDetailComponent,
        },
       
        { path: '', redirectTo: 'DashboardDetail', pathMatch: 'full' },
        // { path: '**', redirectTo: 'overview', pathMatch: 'full' },
      ],
    },
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class DashboardRoutingModule { }