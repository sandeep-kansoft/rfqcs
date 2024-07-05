import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calender-range-view',
  templateUrl: './calender-range-view.component.html',
  styleUrls: ['./calender-range-view.component.scss']
})
export class CalenderRangeViewComponent implements OnChanges {
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate;
  toDate: any;
  @Input() calendarFormDate!: string;
  @Input() calendarToDate!: string;
  @Input() parentClass !: string
  @Input() showFooter: boolean = true;
  @Output() handleRangeChange = new EventEmitter<any>();
  model!: NgbDateStruct;
  date!: { year: number, month: number };
  isDateRangeActive = false;
  focusedfirstMonth: Date = new Date();
  focusedSecondMonth: Date = new Date(new Date(new Date().setDate(1)).setMonth(new Date().getMonth() + 1));
  selectedFromDate = new DatePipe('en-US').transform(new Date(), 'MMM d, y');
  selectedToDate = new DatePipe('en-US').transform(new Date(), 'MMM d, y');
  @ViewChild('dp1') dp1!: NgbDatepicker;
  @ViewChild('dp2') dp2!: NgbDatepicker;
  constructor(private calendar: NgbCalendar, private cdr: ChangeDetectorRef) {
    this.fromDate = calendar.getToday();
  }

  handleSameMonthRange() {
    let monthDiff = this.focusedSecondMonth.getMonth() - this.focusedfirstMonth.getMonth() + (12 * (this.focusedSecondMonth.getFullYear() - this.focusedfirstMonth.getFullYear()));
    if (monthDiff == 0) {
      let nextDate = this.dp2.calendar.getNext(this.dp2.state.firstDate, 'm', 1)
      this.dp2.navigateTo(nextDate);
      this.focusedSecondMonth = new Date(this.dp2.state.firstDate.year, this.dp2.state.firstDate.month - 1, 1);
      this.removeTodaysDot();
      this.removeTodayClassFromBlank();
      this.getAllDays();
    }
  }

  ngOnChanges(changes: any) {
    //current value
    if (changes.calendarFormDate && changes.calendarFormDate.currentValue) {
      let ngbDate: any = {
        day: new Date(changes.calendarFormDate.currentValue.replace(/-/g, "/")).getDate(),
        month: new Date(changes.calendarFormDate.currentValue.replace(/-/g, "/")).getMonth() + 1,
        year: new Date(changes.calendarFormDate.currentValue.replace(/-/g, "/")).getFullYear(),
      }
      this.fromDate = ngbDate;
      this.selectedFromDate = new DatePipe('en-US').transform(new Date(this.fromDate.year + '/' + this.fromDate.month + '/' + this.fromDate.day), 'MMM d, y')
    }
    else if (this.fromDate) {
      this.selectedFromDate = new DatePipe('en-US').transform(new Date(this.fromDate.year + '/' + this.fromDate.month + '/' + this.fromDate.day), 'MMM d, y')
    }
    else {
      this.fromDate = this.calendar.getToday();
      this.selectedFromDate = new DatePipe('en-US').transform(new Date(), 'MMM d, y')
    }
    if (changes.calendarToDate && changes.calendarToDate.currentValue) {
      let ngbDate = {
        day: new Date(changes.calendarToDate.currentValue.replace(/-/g, "/")).getDate(),
        month: new Date(changes.calendarToDate.currentValue.replace(/-/g, "/")).getMonth() + 1,
        year: new Date(changes.calendarToDate.currentValue.replace(/-/g, "/")).getFullYear(),
      }
      this.toDate = ngbDate;
      this.selectedToDate = new DatePipe('en-US').transform(new Date(this.toDate.year + '/' + this.toDate.month + '/' + this.toDate.day), 'MMM d, y')
    }
    else {
      this.toDate = null;
      this.selectedToDate = new DatePipe('en-US').transform(new Date(), 'MMM d, y')
    }
    if (this.dp1)
      this.dp1.navigateTo(this.fromDate);
    this.focusedfirstMonth = new Date(this.fromDate.year, this.fromDate.month - 1, 1);
    if (this.toDate) {
      if (this.dp2)
        this.dp2.navigateTo(this.toDate);
      this.focusedSecondMonth = new Date(this.toDate.year, this.toDate.month - 1, 1);
    }
    setTimeout(() => {
      this.removeTodaysDot();
      this.removeTodayClassFromBlank();
      this.getAllDays();
      this.handleSameMonthRange();
    }, 100)

  }
  ngOnInit(): void { }
  ngAfterViewInit() {
    this.parentClass = this.parentClass ? this.parentClass : '';
    if (this.calendarFormDate) {
      let ngbDate: any = {
        day: new Date(this.calendarFormDate.replace(/-/g, "/")).getDate(),
        month: new Date(this.calendarFormDate.replace(/-/g, "/")).getMonth() + 1,
        year: new Date(this.calendarFormDate.replace(/-/g, "/")).getFullYear(),
      }
      this.fromDate = ngbDate;
      this.selectedFromDate = new DatePipe('en-US').transform(new Date(this.fromDate.year + '/' + this.fromDate.month + '/' + this.fromDate.day), 'MMM d, y')
    }
    else {
      this.fromDate = this.calendar.getToday();
      this.selectedFromDate = new DatePipe('en-US').transform(new Date(), 'MMM d, y')
    }
    if (this.calendarToDate) {
      this.toDate.day = new Date(this.calendarToDate.replace(/-/g, "/")).getDate();
      this.toDate.month = new Date(this.calendarToDate.replace(/-/g, "/")).getMonth() + 1;
      this.toDate.year = new Date(this.calendarToDate.replace(/-/g, "/")).getFullYear();
      this.selectedToDate = new DatePipe('en-US').transform(new Date(this.toDate.year + '/' + this.toDate.month + '/' + this.toDate.day), 'MMM d, y')
    }
    else {
      this.toDate = null;
      this.selectedToDate = new DatePipe('en-US').transform(new Date(), 'MMM d, y')
    }
    this.dp1.navigateTo(this.fromDate);
    this.focusedfirstMonth = new Date(this.fromDate.year, this.fromDate.month - 1, 1);
    if (this.toDate) {
      this.dp2.navigateTo(this.toDate);
      this.focusedSecondMonth = new Date(this.toDate.year, this.toDate.month - 1, 1);
    }
    setTimeout(() => {
      this.removeTodaysDot();
      this.removeTodayClassFromBlank();
      this.getAllDays();
      this.handleSameMonthRange();
    }, 100)

  }
  navigateTo(number: number) {
    const { state, calendar } = this.dp2;
    let monthDiff = this.focusedSecondMonth.getMonth() - this.focusedfirstMonth.getMonth() +
      (12 * (this.focusedSecondMonth.getFullYear() - this.focusedfirstMonth.getFullYear()))
    if (monthDiff > 1 || number == 1) {
      state.firstDate.day = this.focusedSecondMonth.getDate();
      state.firstDate.month = (this.focusedSecondMonth.getMonth() + 1);
      state.firstDate.year = this.focusedSecondMonth.getFullYear();
      let nextDate = calendar.getNext(state.firstDate, 'm', number)
      this.dp2.navigateTo(nextDate);
      this.focusedSecondMonth = new Date(nextDate.year, nextDate.month - 1, 1);
      setTimeout(() => {
        this.removeTodaysDot();
      }, 100);
      setTimeout(() => {
        this.removeTodayClassFromBlank();
        this.getAllDays();
      }, 200);
    }
  }
  navigateFrom(number: number) {
    let monthDiff = this.focusedSecondMonth.getMonth() - this.focusedfirstMonth.getMonth() +
      (12 * (this.focusedSecondMonth.getFullYear() - this.focusedfirstMonth.getFullYear()))
    if (monthDiff > 1 || number == -1) {
      const { state, calendar } = this.dp1;
      this.dp1.navigateTo(calendar.getNext(state.firstDate, 'm', number));
      this.focusedfirstMonth = new Date(this.dp1.state.firstDate.year, this.dp1.state.firstDate.month - 1, 1);
      setTimeout(() => {
        this.removeTodaysDot();
      }, 100);
      setTimeout(() => {
        this.removeTodayClassFromBlank();
        this.getAllDays();
      }, 200);
    }
  }
  navigateOnSelectedDate(type: string) {
    if (type == 'from') {
      this.dp1.navigateTo(this.fromDate);
      this.focusedfirstMonth = new Date(this.fromDate.year, this.fromDate.month - 1, 1);
    }
    else {
      let monthDiff = this.focusedSecondMonth.getMonth() - this.focusedfirstMonth.getMonth() + (12 * (this.focusedSecondMonth.getFullYear() - this.focusedfirstMonth.getFullYear()));
      if (monthDiff > 1) {
        this.dp2.navigateTo(this.toDate);
        this.focusedSecondMonth = new Date(this.toDate.year, this.toDate.month - 1, 1);
      }
    }

    setTimeout(() => {
      this.removeTodaysDot();
    }, 100);
    setTimeout(() => {
      this.removeTodayClassFromBlank();
      this.getAllDays();
    }, 200);
  }
  today() {
    const { calendar } = this.dp1;
    this.dp1.navigateTo(calendar.getToday());
    this.toDate = null;
    this.fromDate = calendar.getToday();
    this.isDateRangeActive = true
    this.selectedFromDate = new DatePipe('en-US').transform(new Date(this.fromDate.year + '/' + this.fromDate.month + '/' + this.fromDate.day), 'MMM d, y')
    this.selectedToDate = this.selectedFromDate;
    setTimeout(() => {
      this.removeTodayClassFromBlank();
      this.getAllDays();
    }, 200);
  }
  selectToday() {
    this.model = this.calendar.getToday();
    this.focusedfirstMonth = new Date();
    this.today();
  }
  onDateSelection(date: NgbDate) {
    this.removeTodaysDot();
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.isDateRangeActive = true
      this.selectedFromDate = new DatePipe('en-US').transform(new Date(this.fromDate.year + '/' + this.fromDate.month + '/' + this.fromDate.day), 'MMM d, y')
      this.selectedToDate = this.selectedFromDate;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.isDateRangeActive = false;
      this.selectedToDate = new DatePipe('en-US').transform(new Date(this.toDate.year + '/' + this.toDate.month + '/' + this.toDate.day), 'MMM d, y')
      this.getAllDays();
      this.handleRangeChange.emit({
        fromDate: new Date(this.fromDate.year + '/' + this.fromDate.month + '/' + this.fromDate.day),
        toDate: new Date(this.toDate.year + '/' + this.toDate.month + '/' + this.toDate.day)
      })

    } else {
      this.toDate = null;
      this.fromDate = date;
      this.isDateRangeActive = true
      this.selectedFromDate = new DatePipe('en-US').transform(new Date(this.fromDate.year + '/' + this.fromDate.month + '/' + this.fromDate.day), 'MMM d, y')
      this.selectedToDate = this.selectedFromDate;
    }
    this.getAllDays();
  }
  markDisabled(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day).toDateString();
    const currentDate = new Date().toDateString();
    return new Date(d).getTime() < new Date(currentDate).getTime();
  }
  markDisabledTo(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day).toDateString();
    const currentDate = new Date().toDateString();
    return new Date(d).getTime() < new Date(currentDate).getTime();
  }
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }
  // range =
  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
  handleMouseEvent(event: any, date: NgbDate) {
    if (this.isDateRangeActive && !this.toDate && date.after(this.fromDate)) {
    }
  }
  getAllDays() {
    var self = this;
    let days: any = document.getElementsByClassName('ngb-dp-day');
    for (var i = 0; i < days.length; i++) {
      removeClassFromEmptyCol(days[i])
      if (days[i].children[0] && days[i].children[0].classList && days[i].children[0].classList.value.split(' ').includes(this.parentClass)) {
        removeRangeFromTOClass(days[i])
        if (this.toDate) {
          addRangeClasses(new Date(days[i].ariaLabel), days[i])
        }
      }
    }
    setTimeout(() => {
      self.addDotOnToday()
    }, 200);
    function addRangeClasses(ngbDayDate: Date, days: any) {
      const fromDate = new Date(self.fromDate.year + '/' + self.fromDate.month + '/' + self.fromDate.day);
      const toDate = new Date(self.toDate.year + '/' + self.toDate.month + '/' + self.toDate.day);
      const y = ngbDayDate.getFullYear(), m = ngbDayDate.getMonth();
      const lastDay = new Date(y, m + 1, 0);
      // range start and end date add rounded classes...
      if (ngbDayDate.toLocaleDateString() == fromDate.toLocaleDateString()) {
        if (!days.classList.value.split(' ').includes('hidden') && !(days.classList.value.split(' ').includes('ngb-dp-from'))) {
          if (!(fromDate.getDate() == 1 && fromDate.getDay() == 0 || fromDate.getDay() == 0 || fromDate.getDate() == lastDay.getDate() && fromDate.getDay() == 1)) {
            days.classList.add('ngb-dp-from');
          }
        }
      }
      else if (ngbDayDate.toLocaleDateString() == toDate.toLocaleDateString()) {
        if (!days.classList.value.split(' ').includes('hidden') && !(days.classList.value.split(' ').includes('ngb-dp-to'))) {
          if (!(toDate.getDate() == 1 || toDate.getDay() == 1 || toDate.getDate() == lastDay.getDate() && toDate.getDay() == 1)) {
            days.classList.add('ngb-dp-to');
          }
        }
      }
      // range monday sunday firstday or last in month calendar add radius.
      if (ngbDayDate.getTime() >= fromDate.getTime() && ngbDayDate.getTime() <= toDate.getTime()) {
        if ((days.ariaLabel.split(",")[0] == "Sunday" || days.ariaLabel.split(",")[0] == "Monday")) {
          if (days.ariaLabel.split(",")[0] == "Sunday") {
            if (days.children[0] && days.children[0].classList && !(days.children[0].classList.value.split(' ').includes('border-radius-right'))) {
              days.children[0].classList.add('border-radius-right');
            }
          }
          else if (days.ariaLabel.split(",")[0] == "Monday") {
            if (days.children[0] && days.children[0].classList && !(days.children[0].classList.value.split(' ').includes('border-radius-left'))) {
              days.children[0].classList.add('border-radius-left');
            }
          }
        }
        if ((ngbDayDate.getDate() == 1 || ngbDayDate.getDate() == lastDay.getDate())) {
          if (ngbDayDate.getDate() == 1) {
            if (days.children[0] && days.children[0].classList && !(days.children[0].classList.value.split(' ').includes('border-radius-left'))) {
              days.children[0].classList.add('border-radius-left');
            }
          }
          else if (ngbDayDate.getDate() == lastDay.getDate()) {
            if (days.children[0] && days.children[0].classList && !(days.children[0].classList.value.split(' ').includes('border-radius-right'))) {
              days.children[0].classList.add('border-radius-right');
            }
          }
        }
      }
    }
    function removeRangeFromTOClass(days: any) {
      if (days.classList.value.split(' ').includes('ngb-dp-from')) {
        days.classList.remove('ngb-dp-from');
      }
      else if (days.classList.value.split(' ').includes('ngb-dp-to')) {
        days.classList.remove('ngb-dp-to')
      }
      if (days.children[0] && days.children[0].classList && days.children[0].classList.value.split(' ').includes('border-radius-right')) {
        days.children[0].classList.remove('border-radius-right');
        days.children[0].classList.remove('border-radius-left');
      }
      else if (days.children[0] && days.children[0].classList && days.children[0].classList.value.split(' ').includes('border-radius-left')) {
        days.children[0].classList.remove('border-radius-left');
        days.children[0].classList.remove('border-radius-right');
      }
    }
    function removeClassFromEmptyCol(days: any) {
      if (days.children.length == 0 && days.classList.value.split(' ').includes('ngb-dp-from')) {
        days.classList.remove('ngb-dp-from')
      }
      else if (days.children.length == 0 && days.classList.value.split(' ').includes('ngb-dp-to')) {
        days.classList.remove('ngb-dp-to')
      }
    }
  }
  addDotOnToday() {
    // add dot in calendar
    let days: any = document.getElementsByClassName(this.parentClass);
    for (var j = 0; j < days.length; j++) {
      if (days[j].parentElement.children.length && days[j].parentElement.classList.value.split(" ").includes('ngb-dp-today')) {
        if (days[j] && (new Date(days[j].parentElement.ariaLabel).getMonth() == this.focusedfirstMonth.getMonth() || new Date(days[j].parentElement.ariaLabel).getMonth() == this.focusedSecondMonth.getMonth())) {
          var span = document.createElement('span');
          span.className = 'dot';
          days[j].parentElement.appendChild(span);
        }
      }
    }
  }
  removeTodaysDot() {
    let dots: any = document.getElementsByClassName('dot');
    removeDots(dots)
    function removeDots(allDots: any) {
      for (let k = 0; k < allDots.length; k++) {
        allDots[k].remove();
        if (allDots.length) {
          removeDots(allDots)
        }
      }
    }
    this.cdr.detectChanges();
  }
  removeTodayClassFromBlank() {
    let todays: any = document.getElementsByClassName('ngb-dp-today');
    for (let k = 0; k < todays.length; k++) {
      if (todays[k].children.length < 1) {
        todays[k].classList.remove('ngb-dp-today')
      }
    }
  }
}
