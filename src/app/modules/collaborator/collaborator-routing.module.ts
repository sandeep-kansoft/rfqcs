import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollaboratorDashboardComponent } from './collaborator-dashboard/collaborator-dashboard.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'CollaboratorDashboard',
        component: CollaboratorDashboardComponent,
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
export class CollaboratorRoutingModule {}
