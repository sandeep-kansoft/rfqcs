import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from '../auth/models/auth.model';
import { CsApprovalApis, CsComparision, ReverseAuctionApproverApis, baseUrl } from 'src/app/shared/constants/urlconfig';
import { CommonService } from 'src/app/shared/services/common.service';
import { IDefaultResponseDto, IRfqcsListDataDto } from '../event/event.interface';
import { Observable, from } from 'rxjs';
import { IPendingResponseListDto } from './approver-interface';
import { EventService } from '../event/event.service';

@Injectable({
  providedIn: 'root',
})
export class ApproverService {
  private baseUrl: string = '';
  private authData: AuthModel | null | undefined;
  constructor(private commonService: CommonService, private http: HttpClient,private eventService:EventService) {
    this.baseUrl = baseUrl;
    this.authData = this.commonService.getAuthData();
    
  }

  getApprovedRejectedCS(
    payload:any
  ): Observable<IDefaultResponseDto<any[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.getApprovedRejectedCS;
    return this.http.post<IDefaultResponseDto<any[]>>(url_,payload);
  }

  getPendingCS(payload:any): Observable<IDefaultResponseDto<IPendingResponseListDto[]>> {
    let url_ = this.baseUrl + '/' + CsApprovalApis.getPendingCS;
    return this.http.post<IDefaultResponseDto<IPendingResponseListDto[]>>(url_,payload);
  }

  approveCsApi(
    awardId: number,
    remarks: string,
    level:number
  ): Observable<IDefaultResponseDto<boolean>> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.approveCSAppoval +
      `?AwardId=${awardId}&Remarks=${remarks}&level=${level}`;
    return this.http.post<IDefaultResponseDto<boolean>>(url_, {});
  }

  DownloadApproverCsSheet(payload: any): Observable<any> {
    let url_ = this.baseUrl + '/' + CsComparision.downloadapprovercssheet;
     return from(this.eventService.downloadFileType(url_, payload))
  }


  rejectCsApi(
    awardId: number,
    remarks: string,
    level:number
  ): Observable<IDefaultResponseDto<boolean>> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.rejectCSAppoval +
      `?AwardId=${awardId}&Remarks=${remarks}&level=${level}`;
    return this.http.post<IDefaultResponseDto<boolean>>(url_, {});
  } 

  getPendingRAListApi(
    payload: any
  ): Observable<IDefaultResponseDto<IRfqcsListDataDto[]>> {
    payload.userId = this.authData?.userId;
    let url_ = this.baseUrl + '/' + ReverseAuctionApproverApis.getPendingRA;
    return this.http.post<IDefaultResponseDto<IRfqcsListDataDto[]>>(
      url_,
      payload
    );
  }

  getApprovedRejectedRAList(
    payload: any
  ): Observable<IDefaultResponseDto<IRfqcsListDataDto[]>> {
    payload.userId = this.authData?.userId;
    let url_ = this.baseUrl + '/' + ReverseAuctionApproverApis.getApprovedRejectedRA;
    return this.http.post<IDefaultResponseDto<IRfqcsListDataDto[]>>(
      url_,
      payload
    );
  }

  ApproveReverseAuction(eventId: any): Observable<IDefaultResponseDto<boolean>> {
    let url_ =
      this.baseUrl + '/' + ReverseAuctionApproverApis.saveApproveApi + `?EventId=${eventId}`;
    return this.http.put<IDefaultResponseDto<boolean>>(url_, {});
  }
  
}
