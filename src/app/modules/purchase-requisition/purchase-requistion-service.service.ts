import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from 'src/app/shared/services/common.service';
import {
  baseUrl,
  PurchaseRequistionApi,
} from 'src/app/shared/constants/urlconfig';
import { AuthModel } from '../auth/models/auth.model';
import {
  ICreateAuctionByPRDto,
  ICreateAuctionByPRLineDto,
  PrHistoryResponseDto,
  PrLineHistoryResponseDto,
  PrLineResponseDto,
  PrResponseDto,
} from './purchase-requisition';

@Injectable({
  providedIn: 'root',
})
export class PurchaseRequistionServiceService {
  baseUrl: string = '';
  authData: AuthModel | null | undefined;

  constructor(private http: HttpClient, private commonService: CommonService) {
    this.baseUrl = baseUrl;
    this.authData = this.commonService.getAuthData();
  }

  /**
   * @param pR_ID
   * @param type
   * @return PrResponseDto
   */
  createRfqByPr(payload: any): Observable<any[]> {
    payload.user_ID = this.authData?.userId;
    let url_ = this.baseUrl + '/' + PurchaseRequistionApi.createRfqByPr;
    return this.http.post<any[]>(url_, payload);
  }

  /**
   * @param pR_ID
   * @param prtraN_ID
   * @return PrResponseDto
   */
  createRfqByPrLine(payload: any): Observable<any[]> {
    payload.user_ID = this.authData?.userId;
    let url_ = this.baseUrl + '/' + PurchaseRequistionApi.createRfqByPrLine;
    return this.http.post<any[]>(url_, payload);
  }

  /**
   * @param startDate
   * @param endDate
   * @return PrResponseDto
   */
  getMyPrList(startDate: string, endDate: string,site:string,department:string): Observable<PrResponseDto[]> {
    let url_ =
      this.baseUrl +
      '/' +
      PurchaseRequistionApi.prOverview +
      `/?startdate=${startDate}&enddate=${endDate}&Site=${site}&Department=${department}`;
    return this.http.get<PrResponseDto[]>(url_);
  }

  /**
   * @param   startDate: string,
   * @param  enddate: string,
   * @param  prNumber: string,
   * @param  pageSize: number,
   * @param pageSize
   * @param pageNumber
   * @return AllPr list
   */
  getALLPrList(payload: any): Observable<PrResponseDto[]> {
    payload.userId = this.authData?.userId;
    let url_ = this.baseUrl + '/' + PurchaseRequistionApi.getAllPr;
    return this.http.post<PrResponseDto[]>(url_, payload);
  }

  /**
   * @param prid
   * @return PrResponseDto
   */
  getLineItem(prid: number): Observable<PrLineResponseDto[]> {
    let url_ =
      this.baseUrl +
      '/' +
      PurchaseRequistionApi.getPrLines +
      `/?UserId=${this.authData?.userId}&&PR_id=${prid}`;
    return this.http.get<PrLineResponseDto[]>(url_);
  }

  /**
   * @param prId
   * @return PrResponseDto
   */
  getPrHistory(prId: number): Observable<PrHistoryResponseDto[]> {
    let url_ =
      this.baseUrl +
      '/' +
      PurchaseRequistionApi.getPrHistory +
      `?UserId=${this.authData?.userId}&PrId=${prId}`;
    return this.http.get<PrHistoryResponseDto[]>(url_);
  }

  /**
   * @param pageSize
   * @param pageNumber
   * @return PrResponseDto
   */
  getPrLineHistory(itemCode: string): Observable<PrLineHistoryResponseDto[]> {
    let url_ =
      this.baseUrl +
      '/' +
      PurchaseRequistionApi.getPrLineHistory +
      `?Itemcode=${itemCode}`;
    // `?UserId=${this.authData?.userId}&PrId=${prId}`;
    return this.http.get<PrLineHistoryResponseDto[]>(url_);
  }

  /**
   * @param pageSize
   * @param pageNumber
   * @return PrResponseDto
   */
  getPrLineHistoryHeader(prId: number): Observable<PrLineHistoryResponseDto[]> {
    let url_ =
      this.baseUrl +
      '/' +
      PurchaseRequistionApi.getPrLineHistoryHeader +
      `/?UserId=${this.authData?.userId}&PrId=${prId}`;
    return this.http.get<PrLineHistoryResponseDto[]>(url_);
  }

  /**
   * @param pageSize
   * @param pageNumber
   * @return PrResponseDto
   */
  getPrHeader(prId: number): Observable<PrLineHistoryResponseDto[]> {
    let url_ =
      this.baseUrl +
      '/' +
      PurchaseRequistionApi.getPrLineHistory +
      `/?UserId=${this.authData?.userId}&PrId=${prId}`;
    return this.http.get<PrLineHistoryResponseDto[]>(url_);
  }

  /**
   * @param pageSize
   * @param pageNumber
   * @return PrResponseDto
   */
  getPendingPPO(
    startDate: string,
    endDate: string,
    site: string
  ): Observable<PrLineHistoryResponseDto[]> {
    let url_ =
      this.baseUrl +
      '/' +
      PurchaseRequistionApi.getPendingPPO +
      `?startdate=${startDate}&enddate=${endDate}&site=${site}`;
    return this.http.get<PrLineHistoryResponseDto[]>(url_);
  }

  /**
   * @param pageSize
   * @param pageNumber
   * @return PrResponseDto
   */
  getPrHeaderDetailBYid(prid: number): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      PurchaseRequistionApi.getPrDetailById +
      `?PR_id=${prid}`;
    return this.http.get<any>(url_);
  }

  getPrLineDetailBYid(prid: number): Observable<PrLineHistoryResponseDto[]> {
    let url_ =
      this.baseUrl +
      '/' +
      PurchaseRequistionApi.getPrLineDetailById +
      `?PR_id=${prid}`;
    return this.http.get<PrLineHistoryResponseDto[]>(url_);
  }

  /**
   * @param pageSize
   * @param pageNumber
   * @return PrResponseDto
   */
  getAllPpo(payload: any): Observable<any[]> {
    let url_ = this.baseUrl + '/' + PurchaseRequistionApi.getAllPPO;
    return this.http.post<any[]>(url_, payload);
  }

  /**
   * @param pageSize
   * @param pageNumber
   * @return PrResponseDto
   */
  getOnHandQuantity(ppoId: number): Observable<any[]> {
    let url_ =
      this.baseUrl +
      '/' +
      PurchaseRequistionApi.getOnHandQuantity +
      `?PPOId=${ppoId}`;
    return this.http.get<any[]>(url_);
  }

  /**
   * @param pageSize
   * @param pageNumber
   * @return PrResponseDto
   */
  DownloadPRPdf(prId: number): Observable<any[]> {
    let url_ =
      this.baseUrl + '/' + PurchaseRequistionApi.downloadPdf + `?PR_id=${prId}`;
    return this.http.get<any[]>(url_);
  }

  public downloadPdf(url: string, filename: string) {
    return this.http.get(url, {
      headers: new HttpHeaders().append('Content-Type', 'application/pdf'),
    });
  }
  /**
   * @param pR_ID
   * @param type
   * @return PrResponseDto
   */
  createRfqByPPO(payload: any): Observable<any[]> {
    payload.userId = this.authData?.userId;
    let url_ = this.baseUrl + '/' + PurchaseRequistionApi.createRfqByPPO;
    return this.http.post<any[]>(url_, payload);
  }

  /**
  @param pR_ID
  @param user_ID
  @param type
  @param eventName
  @param eventDescription
  @param eventColorCode
   * @return PrResponseDto
   */
  CreateAuctionByPR(payload: any): Observable<ICreateAuctionByPRDto> {
    payload.user_ID = this.authData?.userId;
    let url_ = this.baseUrl + '/' + PurchaseRequistionApi.createAuctionByPR;
    return this.http.post<ICreateAuctionByPRDto>(url_, payload);
  }

  /**
  @param pR_ID
  @param user_ID
  @param type
  @param prtraN_ID
  @param eventName
  @param eventDescription
  @param eventColorCode
   * @return PrResponseDto
   */
  CreateAuctionByPRLine(payload: any): Observable<ICreateAuctionByPRLineDto> {
    payload.user_ID = this.authData?.userId;
    let url_ = this.baseUrl + '/' + PurchaseRequistionApi.createAuctionByPRLine;
    return this.http.post<ICreateAuctionByPRLineDto>(url_, payload);
  }


   /**
   * @return PrResponseDto
   */
   getPrAndLinesDetailForManualRFQList(data:any): Observable<PrResponseDto[]> {
    let url_ =
      this.baseUrl +
      '/' +
      PurchaseRequistionApi.getPRAndPRLinesDetailsForManualRFQ +
      `?startdate=${data.startDate}&enddate=${data.endDate}&Site=${data.site}&Department=${data.department}`;
    return this.http.get<PrResponseDto[]>(url_);
  }
}
