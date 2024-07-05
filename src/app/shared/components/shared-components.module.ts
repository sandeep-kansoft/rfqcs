import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToasterComponent } from './toaster/toaster.component';
import { NgbActiveModal, NgbActiveOffcanvas, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { SkeletonListComponent } from './skeleton-list/skeleton-list.component';
import { CalenderRangeViewComponent } from './calender-range-view/calender-range-view.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RatingComponent } from './rating/rating.component';
import { FilterComponent } from './filter/filter.component';
import {
  DateInputModule,
  DateInputsModule,
} from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { IntlModule } from '@progress/kendo-angular-intl';
import { LabelModule } from '@progress/kendo-angular-label';
import { FilterViewComponent } from './filter-view/filter-view.component';
import { WonderLoaderComponent } from './wonder-loader/wonder-loader.component';
import { NoDataFoundComponent } from './no-data-found/no-data-found.component';
import { GlobalLoaderComponent } from './global-loader/global-loader.component';

const components = [
  ToasterComponent,
  AlertModalComponent,
  SkeletonListComponent,
  CalenderRangeViewComponent,
  RatingComponent,
  FilterComponent,
  FilterViewComponent,
  WonderLoaderComponent,
  NoDataFoundComponent,
  GlobalLoaderComponent
];

@NgModule({
  declarations: [components,],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    IntlModule,
    LabelModule,
    ButtonsModule,
    DateInputsModule,
    NgbModule,
    InlineSVGModule.forRoot(),
  ],
  providers: [NgbActiveOffcanvas, NgbActiveModal],
  exports: [components],
})
export class SharedComponentsModule { }
