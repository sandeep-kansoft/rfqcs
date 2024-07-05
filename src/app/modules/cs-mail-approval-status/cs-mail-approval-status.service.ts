import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl, commonApiModule } from 'src/app/shared/constants/urlconfig';
import { IDefaultResponseDto } from '../event/event.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsMailApprovalStatusService {
  baseUrl: string = '';
  constructor(private http: HttpClient) {
    this.baseUrl = baseUrl;
  }

  getCsApproveRejectStatus(payload: any): Observable<IDefaultResponseDto<any>> {
    let url_ = this.baseUrl + '/' + commonApiModule.cSApproveRejectStatus + `?AwardId=${payload.AwardId}&Remarks=${payload.Remarks}&Type=${payload.Type}&UserId=${payload.UserId}&level=${payload.level}`;
    return this.http.get<IDefaultResponseDto<any>>(url_,);
  }
}
