import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {

  @Input() rating:string;
  ratingNumber:number;

  ngOnInit() {
    this.ratingNumber = parseFloat(this.rating);
    this.ratingNumber=Math.round(this.ratingNumber)
  }
}
