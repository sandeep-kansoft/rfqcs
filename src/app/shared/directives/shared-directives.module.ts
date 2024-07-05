import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberDirective } from './only-number.directive';
import { DecimalLimitDirective } from './decimal-limit.directive';


@NgModule({
  declarations: [NumberDirective, DecimalLimitDirective],
  imports: [CommonModule],
  exports: [NumberDirective ,DecimalLimitDirective]
})
export class SharedDirectivesModule { }
