import { Directive, ElementRef, HostListener, Input } from '@angular/core';
const commaPattern = /([,])$/;
const dotPattern = /([.])$/;
const commaWithDotPattern = /[^0-9.,]*/g;
const minusWithDotPattern = /[^0-9.,]*/g;
const integerPattern = /[^0-9]*/g;
@Directive({
    selector: 'input[numbersOnly]'
})
export class NumberDirective {
    count = 0;
    constructor(private _el: ElementRef) { }

    @HostListener('input', ['$event']) onInputChange(event: any) {
        const initalValue = this._el.nativeElement.value;
        if (this._el.nativeElement.id == "discount") {
            var newValue = initalValue.replace(commaWithDotPattern, '');
            if ((commaPattern.test(newValue) || (dotPattern.test(newValue)))) {
                if (commaPattern.test(newValue)) {
                    let splitVal = newValue.split(',');
                    newValue = dotPattern.test(splitVal[0]) ? (splitVal[0].split('.')[0] + "." + splitVal[0].split('.')[1]) : splitVal[0] + ',' + (dotPattern.test(splitVal[1]) ? splitVal[1].split('.')[0] : splitVal[1]);
                    this._el.nativeElement.value = newValue
                }
                else {
                    if (dotPattern.test(newValue)) {
                        let splitVal = newValue.split('.');
                        newValue = commaPattern.test(splitVal[0]) ? (splitVal[0].split(',')[0] + "," + splitVal[0].split(',')[1]) : splitVal[0] + '.' + (commaPattern.test(splitVal[1]) ? splitVal[1].split(',')[0] : splitVal[1]);
                        this._el.nativeElement.value = newValue
                    }
                }
            }
            else {
                this._el.nativeElement.value = newValue;
            }
        }
        else {
            this._el.nativeElement.value = initalValue.replace(integerPattern, '');
        }
        if (initalValue !== this._el.nativeElement.value) {
            event.stopPropagation();
        }
    }
    @HostListener('keydown', ['$event']) onKeyDown(event: any) {
        var specialKeys = new Array();
        specialKeys.push(8);
        specialKeys.push(46);
        if (event.target.id == "capacity" && (/^[0-9]+$/.test(event.key) == false && specialKeys.indexOf(event.keyCode) == -1)) {
            event.preventDefault();
        }
        else if(event.target.id == "discount" && ((event.target.value.split('.').length > 1 || event.target.value.split(',').length > 1) && (event.key == '.' || event.key == ","))){
            event.preventDefault();  
        }

    }
    
}