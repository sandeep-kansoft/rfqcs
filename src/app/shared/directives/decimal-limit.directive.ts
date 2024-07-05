import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDecimalLimit]'
})
export class DecimalLimitDirective {
  @Input() decimalLimit: number = 2; // Default decimal limit is 2

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;

    // Regex pattern for a decimal with up to the specified limit
    const decimalPattern = new RegExp(`^[0-9]+(\\.[0-9]{1,${this.decimalLimit}})?$`);

    if (!decimalPattern.test(inputValue)) {
      inputElement.value = inputValue.substring(0, inputValue.length - 1);
    }
  }
}
