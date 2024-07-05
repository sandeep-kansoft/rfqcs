import { Component, OnInit, SimpleChanges } from '@angular/core';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  Event,
} from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  currentRoute: string;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.currentRoute = '';
     this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
      if (event instanceof NavigationError) {
        console.log(event.error);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
  }
}
