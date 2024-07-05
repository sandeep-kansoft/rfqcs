import { Component, OnInit } from '@angular/core';
import { UserDetail } from './user-detail';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  userDetailInfo: UserDetail = {
    firstName: 'Max',
    lastName: 'Smith',
    company: 'Wonder Cement',
    phoneNo: '+91 999 999 9999',
    companySite: 'https://www.wondercement.com',
    country: 'IN',
    language: 'en',
    timeZone: 'Alaska',
    currency: 'USD',
    communicationEmail: true,
    communicationPhone: true,
    allowMarketing: true,
  };

  openDrawer() {}

  updateUserDetail(data: any) {
    this.userDetailInfo = data;
  }

  ngOnInit(): void {}
}
