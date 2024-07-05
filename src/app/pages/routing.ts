import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'PR',
    loadChildren: () =>
      import(
        '../modules/purchase-requisition/purchase-requisition.module'
      ).then((m) => m.PurchaseRequestModule),
  },
  {
    path: 'Event',
    loadChildren: () =>
      import('../modules/event/event.module').then((m) => m.EventModule),
  },
  {
    path: 'CSApproval',
    loadChildren: () =>
      import('../modules/approver/approver.module').then(
        (m) => m.ApproverModule
      ),
  },

  {
    path: 'Dashboard',
    loadChildren: () =>
      import('../modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },

  {
    path: 'VendorLogin',
    loadChildren: () =>
      import('../modules/vendor-dashboard/vendor-dashboard.module').then(
        (m) => m.VendorDashboardModule
      ),
  },
  {
    path: 'CollaboratorUser',
    loadChildren: () =>
      import('../modules/collaborator/collaborator.module').then(
        (m) => m.CollaboratorModule
      ),
  },
  {
    path: 'VendorChatIframe',
    loadChildren: () =>
      import('../modules/vendor-chat-url/vendor-chat-url.module').then(
        (m) => m.VendorChatUrlModule
      ),
  },

  {
    path: 'Admin',
    loadChildren: () =>
      import('../modules/admin/admin.module').then((m) => m.AdminModule),
  },

  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
    data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
    data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    data: { layout: 'light-sidebar' },
  },
  {
    path: '',
    redirectTo: '/Dashboard/DashboardDetail',
    pathMatch: 'full',
  },
  // {
  //   path: '**',
  //   redirectTo: 'error/404',
  // },
];

export { Routing };
