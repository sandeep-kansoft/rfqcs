import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorChatComponentComponent } from './vendor-chat-component/vendor-chat-component.component';

const routes: Routes = [
  {
    path: '',
    component: VendorChatComponentComponent,
    children: [
      {
        path: 'chat',
        component: VendorChatComponentComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorChatUrlRoutingModule {}
