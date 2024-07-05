import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from './components/shared-components.module';

import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedDirectivesModule } from '@progress/kendo-angular-dropdowns';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,  
    NgbTooltipModule,
    NgbModule,

  ],
  providers: [],


    
  exports: [
    SharedDirectivesModule,
    SharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbTooltipModule,
    NgbModule,

  ],
})



export class SharedModule {

 }
