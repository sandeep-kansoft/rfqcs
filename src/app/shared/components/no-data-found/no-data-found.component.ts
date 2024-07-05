import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data-found',
  templateUrl: './no-data-found.component.html',
  styleUrls: ['./no-data-found.component.scss']
})
export class NoDataFoundComponent {
  @Input() errMessage: string = ''

  ngOninit() {
    if (!this.errMessage) {
      this.errMessage = 'No Results Found'
    }
  }
}
