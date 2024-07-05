import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { AccountComponent } from './account.component';
import { SettingsComponent } from './settings/settings.component';
import { OverviewEditorComponent } from './overviewform/overview-editor.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
        data: { layout: 'light-sidebar' },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { layout: 'light-sidebar' },
      },
      {
        path: 'overview1',
        component: OverviewEditorComponent,
        data: { layout: 'light-sidebar' },
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
