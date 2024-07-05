import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl, commonApiModule } from 'src/app/shared/constants/urlconfig';
import { IDefaultResponseDto, IDefaultResponseDtoSecond } from '../event/event.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReActiveEventStatusService {
  baseUrl: string = '';
  constructor(private http: HttpClient) {
    this.baseUrl = baseUrl;
  }

  getCsApproveRejectStatus(eventId: any): Observable<IDefaultResponseDtoSecond<any>> {
    let url_ = this.baseUrl + '/' + commonApiModule.reactiveEventStatus + `?key=${eventId}`;
    return this.http.post<IDefaultResponseDtoSecond<any>>(url_,{});
  }
}
