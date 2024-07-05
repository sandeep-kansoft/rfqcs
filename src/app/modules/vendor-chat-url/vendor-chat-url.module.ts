import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorChatComponentComponent } from './vendor-chat-component/vendor-chat-component.component';
import { VendorChatUrlRoutingModule } from './vendor-chat-url-routing.module';
import { EventModule } from '../event/event.module';

@NgModule({
  declarations: [VendorChatComponentComponent],
  imports: [CommonModule, VendorChatUrlRoutingModule , EventModule ],
})
export class VendorChatUrlModule {}
