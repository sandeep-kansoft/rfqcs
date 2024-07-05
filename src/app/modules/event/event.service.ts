import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  baseUrl,
  BuyerDocument,
  CollaborationApis,
  CsApprovalApis,
  CsComparision,
  EventApis,
  eventCommunicationApis,
  PriceBidApis,
  PublishEventApis,
  PurchaseRequistionApi,
  ReverseAuctionSettingApis,
  RfqcsApis,
  TechnicalEvent,
  TemplateApis,
  TermsAndConditionsApis,
  ViewerAndAdminstrator,
} from 'src/app/shared/constants/urlconfig';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthModel } from '../auth/models/auth.model';
import {
  IAllVendorsResponse,
  IGetAllTechnicalAttachMentResponseDto,
  IGetAllVendors,
  IDefaultResponseDto,
  IRfqcsListDataDto,
  IRfqcsListRequestDto,
  IRfqDataDtoById,
  ITechnicalAttachmentResponseDto,
  ISaveTechnicalAttachmentRequestDto,
  ISaveTechnicalAttachMentResponseDto,
  IPriceBidResultDataDto,
  ITermAndConditionResultDataDto,
  ISaveTemplateResponseDto,
  IGetTemplateByIdResponseDto,
  IGetTemplateByTypeResponseDto,
  IUpdateRfqResponseDto,
  IScheduleEventResponseDto,
  ISaveEventVendorsResponseDto,
  IUploadOtherDocumentResponseDto,
  ISubmitOtherDocumentResponseDto,
  IGetVendorWiseEventsResponseDto,
  IGetAssignnedCollabrativeUserDataDta,
  IdeleteRfqAuction,
  IGetAllEventVendor,
  CollabrativeUserResponseDto,
  IAllSuggestedVendor,
  PublishChecklistResponseDto,
  IReasonDataDto,
  IRfqcsResultDataDto,
  IInvitationTemplate,
  ITechnicalTermForVendor,
  IGetAllBuyerAttachmentResponseDto,
  IVendorList,
  IVendorDetail,
  ThreadUserDto,
  ThreadReplyDto,
  IGetRfqForCopyEvent,
  IScheduleResponseDto,
  IviewCsResponseDto,
  ICsStatusList,
  IMyAwardCs,
  IheaderBidComparision,
  IgetCSLineDetailsOfCSApproval,
  ICsStatusListDto,
  ICsDetailDto,
  IGetCSReviewDto,
  IVendorBidDto,
  IgetAuctionDetailsDataDto,
  IgetAuctionDetailsForVendorsDataDto,
  ISubItemsForVendorsDataDto,
  AuctionGraphDetails,
  IPoHistoryDto,
  ICsGetCSVendorSelectionReason,
  IGetAllBuyer,
  getBuyer,
  getCsLinesDto,
  IReverseAuctionList,
  ISaveReverseAuctionSettingsApi,
  IReverseAuctionViewerList,
  IGetAllAdminstrator,
  IReverseAuctionSubItemList,
  ISaveSubItemsRASettingsApi,
  IgetWfUserRole,
  ITimeZoneList,
  getDisqualificationDetailsDto,
  BroadcastTemplatDto,
  getDisqualificationDataDto,
  IGetRATranAuctionSettings,
} from './event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  baseUrl: string = '';
  authData: AuthModel | null | undefined;
  rfqDetail: any;
  userType: string;
  WFuserRole: any = null


  constructor(private http: HttpClient, private commonService: CommonService) {
    this.baseUrl = baseUrl;
    this.authData = this.commonService.getAuthData();
  }

  /**
      @param   UserId: this.authData.userId,
      @param  EVENTCODE: '',
      @param  EVENTNAME: '',
      @param  CURRENTSTATUS: '',
      @param  ProjectName: '',
      @param  EventType: '',
      @param  UserName: '',
      @param  PageIndex: this.pageNumber,
      @param  PageSize: this.pageSize,
   * @return IRfqcsListDataDto
   */
  getRFQListApi(
    payload: any
  ): Observable<IDefaultResponseDto<IRfqcsListDataDto[]>> {
    payload.userId = this.authData?.userId;
    let url_ = this.baseUrl + '/' + EventApis.getRfqList;
    return this.http.post<IDefaultResponseDto<IRfqcsListDataDto[]>>(
      url_,
      payload
    );
  }

  getReverseAuctionListApi(
    payload: any
  ): Observable<IDefaultResponseDto<IRfqcsListDataDto[]>> {
    payload.userId = this.authData?.userId;
    let url_ = this.baseUrl + '/' + EventApis.getReverseAuctionList;
    return this.http.post<IDefaultResponseDto<IRfqcsListDataDto[]>>(
      url_,
      payload
    );
  }

  SendReactiveApi(eventId: number): Observable<any> {
    let payload = {};
    let url_ =
      this.baseUrl + '/' + EventApis.ReactiveEventAPi + `?EventID=${eventId}`;
    return this.http.post<any>(url_, payload);
  }

  /**
    @param pR_ID: 66989,
    @param user_ID: 27053,
    @param  type: 'RFQ',
   *@return IRfqcsListDataDto
   */
  createRfqPRApi(payload: any): Observable<any> {
    let url_ = this.baseUrl + '/' + EventApis.createRFQByPR;
    return this.http.post<any[]>(url_, payload);
  }

  /**
  @param   pR_ID: 66989,
  @param   user_ID: 27053,
  @param   type: 'RFQ',
  @param pRTRAN_ID: 116980,
   */
  createRFQByPRLinesApi(payload: any): Observable<any[]> {
    let url_ = this.baseUrl + '/' + EventApis.createRFQByPRLines;
    return this.http.post<any[]>(url_, payload);
  }

  /**
  @param   eventid: ,
  @param   attachmentId: ,
   */

  deleteTechnicalUploadApi(
    eventid: number,
    attachmentId: number
  ): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      EventApis.deleteTechnicalAttachment +
      `?EventId=${eventid}&attachmentId=${attachmentId}`;
    return this.http.delete<any>(url_);
  }

  // /**
  // @param   eventid: ,
  //  */

  // submitTechnicalAttachmentApi(eventid: number): Observable<any[]> {
  //   let payload = {};
  //   let url_ =
  //     this.baseUrl +
  //     '/' +
  //     EventApis.sumbitTechnicalAttachment +
  //     `?EventId=${eventid}`;
  //   return this.http.post<any[]>(url_, payload);
  // }

  /**
  // @param   eventid: ,
  // @param attachmentId
  //  */
  // downloadTechnicalAttachmentApi(
  //   eventid: number,
  //   attachmentId: number
  // ): Observable<any[]> {
  //   let payload = {};
  //   let url_ =
  //     this.baseUrl +
  //     '/' +
  //     EventApis.downloadAllTechnicalAttachment +
  //     `?EventId=${eventid}&attachmentId=${attachmentId}`;
  //   return this.http.post<any[]>(url_, payload);
  // }

  // /**
  // @param   eventid: ,
  // @param attachmentId
  //  */
  // getAllTechnicalAttachmentApi(
  //   eventid: number
  // ): Observable<IDefaultResponseDto<IGetAllTechnicalAttachMentResponseDto>> {
  //   let url_ =
  //     this.baseUrl +
  //     '/' +
  //     EventApis.getAllTechnicalAttachment +
  //     `?EventId=${eventid}`;
  //   return this.http.get<
  //     IDefaultResponseDto<IGetAllTechnicalAttachMentResponseDto>
  //   >(url_);
  // }

  /**
  // @param   eventid: ,
  // @param attachmentId
  //  */
  // downloadAllTechnicalAttachmentApi(
  //   eventid: number
  // ): Observable<IDefaultResponseDto<any>> {
  //   let payload = {};
  //   let url_ =
  //     this.baseUrl +
  //     '/' +
  //     EventApis.downloadAllTechnicalAttachment +
  //     `?EventId=${eventid}`;
  //   return this.http.get<IDefaultResponseDto<any>>(url_);
  // }

  getAllVendorsApi(): Observable<IDefaultResponseDto<IGetAllVendors[]>> {
    let url_ = this.baseUrl + '/' + EventApis.getAllVendors;
    return this.http.get<IDefaultResponseDto<IGetAllVendors[]>>(url_);
  }

  /**
  @param   eventid: ,
  @param attachmentId
   */
  createRFQByPPOApi(payload: any): Observable<IDefaultResponseDto<any>> {
    let url_ = this.baseUrl + '/' + EventApis.createRFQByPPO;
    return this.http.post<IDefaultResponseDto<any>>(url_, payload);
  }

  createRFQManually(payload: any): Observable<IDefaultResponseDto<any>> {
    let url_ = this.baseUrl + '/' + EventApis.createRFQmanually;
    return this.http.post<IDefaultResponseDto<any>>(url_, payload);
  }

  /**
  @param EventId
   */
  getRFQDetailsById(eventId: any): Observable<IRfqDataDtoById> {
    let url_ =
      this.baseUrl + '/' + EventApis.getRFQDetailsById + '?EventId=' + eventId;
    return this.http.get<IRfqDataDtoById>(url_);
  }

  /**
  @param EventId
   */
  getAllVendors(data: any): Observable<IAllVendorsResponse> {
    let url_ = this.baseUrl + '/' + EventApis.getAllVendors;
    return this.http.post<IAllVendorsResponse>(url_, data);
  }

  getSuggestedvendor(data: any): Observable<IAllSuggestedVendor> {
    let url_ = this.baseUrl + '/' + EventApis.getSuggestedVendor;
    return this.http.post<IAllSuggestedVendor>(url_, data);
  }

  /**
   * @return Reason list
   */
  getReasonByType(type: string): Observable<IRfqcsResultDataDto> {
    let url_ = this.baseUrl + '/' + RfqcsApis.getReasonByType + '?Type=' + type;
    return this.http.get<IRfqcsResultDataDto>(url_);
  }

  /**
@param EventId
 */
  closeEvent(eventId: any): Observable<IDefaultResponseDto<boolean>> {
    let url_ =
      this.baseUrl + '/' + EventApis.closeEvent + '?EventId=' + eventId;
    return this.http.put<IDefaultResponseDto<boolean>>(url_, {});
  }

  // <--------------------------------------Buyer api -------------------------->
  /**
    @param eventId
    @param documentName
    @param remarks
    @param payload : image
     */
  uploadBuyerAttachmentApi(
    eventId: number,
    documentName: string,
    remarks: string,
    file: any,
    filePath: string
  ): any {
    let url_ =
      this.baseUrl +
      '/' +
      BuyerDocument.uploadBuyerDocument +
      `?EventId=${eventId}&DocumentName=${documentName}&Remarks=${remarks}`;
    return from(this.multiPartApiCall(url_, file, filePath));
  }

  getAllBuyer(payload: any): Observable<IGetAllBuyer> {
    let url_ = this.baseUrl + '/' + BuyerDocument.getAllBuyer;
    return this.http.post<IGetAllBuyer>(url_, payload);
  }

  getAllBuyerForAdminstrator(payload: any): Observable<IGetAllAdminstrator> {
    let url_ = this.baseUrl + '/' + ViewerAndAdminstrator.getAllAdminstrator;
    return this.http.post<IGetAllAdminstrator>(url_, payload);
  }

  /**
   @param eventId
    */
  getAllBuyerAttachment(
    eventId: number
  ): Observable<IDefaultResponseDto<IGetAllBuyerAttachmentResponseDto[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      BuyerDocument.getAllBuyerAttachment +
      `?eventId=${eventId}`;
    return this.http.get<
      IDefaultResponseDto<IGetAllBuyerAttachmentResponseDto[]>
    >(url_);
  }
  deleteBuyerAttachmentApi(
    eventId: number,
    attachmentId: number
  ): Observable<IDefaultResponseDto<string>> {
    let url_ =
      this.baseUrl +
      '/' +
      BuyerDocument.deleteBuyerAttachment +
      `?eventId=${eventId}&attachmentId=${attachmentId}`;
    return this.http.delete<IDefaultResponseDto<string>>(url_);
  }

  /**
   @param eventId
    */
  downloadAllBuyerAttachmentApi(
    eventId: number
  ): Observable<IDefaultResponseDto<string>> {
    let url_ =
      this.baseUrl +
      '/' +
      BuyerDocument.downloadAllBuyerAttachment +
      `?eventId=${eventId}`;
    return this.http.get<IDefaultResponseDto<string>>(url_);
  }
  // <--------------------------------------Technical api -------------------------->

  /**
  @param eventId
  @param documentName
  @param remarks
  @param payload : image
   */
  uploadTechicalAttachmentApi(
    eventId: number,
    documentName: string,
    remarks: string,
    file: any,
    filePath: string
  ): any {
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.uploadTechnicalAttachment +
      `?EventId=${eventId}&DocumentName=${documentName}&Remarks=${remarks}`;
    return from(this.multiPartApiCall(url_, file, filePath));
  }

  uploadCsApprovalDocument(
    awardId: number,
    documentName: string,
    file: any,
    filePath: string
  ): any {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.uploadCsApprovalDocument +
      `?AwardId=${awardId}&DocumentName=${documentName}`;
    return from(this.multiPartApiCall(url_, file, filePath));
  }

  multiPartApiCall(url: string, file: File, filePath: string) {
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers();
      let userDetails: any = this.authData;
      if (userDetails.userId) {
        myHeaders.append('UserId', userDetails.userId);
      }
      if (userDetails.userRole) {
        myHeaders.append('UserRole', userDetails.userRole);
      }
      myHeaders.append('Authorization', 'Bearer ' + userDetails.accessToken);
      var formdata = new FormData();
      if (file) formdata.append('files', file, filePath);
      fetch(url, {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
        headers: myHeaders,
      })
        .then((response) => {
          return response.text();
        })
        .then((result) => {
          let response = JSON.parse(result);
          // if ((!response?.Success || !response?.success) ) {
          //   reject(response);
          // }

          if (response && (response?.Success || response?.success)) {
            resolve(response);
          } else {
            reject(response);
          }

          // resolve(JSON.parse(result));
        })
        .catch((error) => {
          console.log('reject error', error);
          reject(error);
        });
    });
  }
  /**
  @param eventId
  @param attachementId
   */
  downlaodTechnicalAttachementApi(
    eventId: number,
    attachmentId: number
  ): Observable<IDefaultResponseDto<ITechnicalAttachmentResponseDto>> {
    let data = {};
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.downloadTechnicalAttachment +
      `?eventId=${eventId}&attachmentId=${attachmentId}`;
    return this.http.post<IDefaultResponseDto<ITechnicalAttachmentResponseDto>>(
      url_,
      data
    );
  }

  /**
  @param eventId
   */
  getAllTechnicalAttachmentApi(
    eventId: number
  ): Observable<IDefaultResponseDto<IGetAllTechnicalAttachMentResponseDto>> {
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.getAllTechnicalAttachment +
      `?eventId=${eventId}`;
    return this.http.get<
      IDefaultResponseDto<IGetAllTechnicalAttachMentResponseDto>
    >(url_);
  }

  /**
  @param eventId
   */
  downloadAllTechnicalAttachmentApi(
    eventId: number,
    vendorId: number | null | undefined
  ): Observable<IDefaultResponseDto<string>> {
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.downloadAllTechnicalAttachment +
      `?eventId=${eventId}` +
      (vendorId ? `&vendorId=${vendorId}` : '');
    return this.http.get<IDefaultResponseDto<string>>(url_);
  }

  /**
  @param eventId
   */
  deleteTechnicalAttachmentApi(
    eventId: number,
    attachmentId: number
  ): Observable<IDefaultResponseDto<string>> {
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.deleteTechnicalAttachment +
      `?eventId=${eventId}&attachmentId=${attachmentId}`;
    return this.http.delete<IDefaultResponseDto<string>>(url_);
  }

  /**
  @param eventId
   */
  submitTechnicalAttachmentApi(
    eventId: number
  ): Observable<IDefaultResponseDto<string>> {
    let data = {};
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.submitTechnicalAttachment +
      `?eventId=${eventId}`;
    return this.http.post<IDefaultResponseDto<string>>(url_, data);
  }

  /**
  @param payload
   */
  saveTechnicalParameterApi(
    payload: any
  ): Observable<IDefaultResponseDto<ISaveTechnicalAttachMentResponseDto>> {
    payload.userid = this.authData?.userId;
    let url_ = this.baseUrl + '/' + TechnicalEvent.saveTechnicalParameters;
    return this.http.post<
      IDefaultResponseDto<ISaveTechnicalAttachMentResponseDto>
    >(url_, payload);
  }

  /**
  @param payload
  */
  updateTechnicalParamterApi(
    payload: any
  ): Observable<IDefaultResponseDto<any>> {
    payload.userid = this.authData?.userId;
    let url_ = this.baseUrl + '/' + TechnicalEvent.updateTechnicalParameters;
    return this.http.post<
      IDefaultResponseDto<ISaveTechnicalAttachMentResponseDto>
    >(url_, payload);
  }

  /**
  @param payload
   */
  deleteTechnicalParamterApi(
    parameterId: number
  ): Observable<IDefaultResponseDto<any>> {
    let payload = {};
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.deleteTechnicalParameters +
      `?ParameterId=${parameterId}`;
    return this.http.post<
      IDefaultResponseDto<ISaveTechnicalAttachMentResponseDto>
    >(url_, payload);
  }

  /**
  @param eventId
   */
  getTechnicalParameterByIdApi(
    eventId: number
  ): Observable<IDefaultResponseDto<ISaveTechnicalAttachMentResponseDto[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.getTechnicalParametersById +
      `?eventId=${eventId}`;
    return this.http.get<
      IDefaultResponseDto<ISaveTechnicalAttachMentResponseDto[]>
    >(url_);
  }

  // dto still need to verify by pankaj kumar
  /**
  @param PbId
   */
  saveTechnicalRemarksApi(
    eventID: number,
    eventTransId: number,
    remarks: string
  ): Observable<IDefaultResponseDto<any>> {
    let data = {};
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.saveTechnicalRemarks +
      `?EVENTID=${eventID}&EventTransId=${eventTransId}&TechRemarks=${remarks}`;
    return this.http.post<IDefaultResponseDto<any>>(url_, data);
  }

  /**
  @param PbId
   */
  getTechnicalRemarkByIdApi(
    PbId: number
  ): Observable<IDefaultResponseDto<ISaveTechnicalAttachMentResponseDto[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.getTechnicalRemarksById +
      `?PBID=${PbId}`;
    return this.http.get<
      IDefaultResponseDto<ISaveTechnicalAttachMentResponseDto[]>
    >(url_);
  }

  /**
  @param eventId
   */
  getAllTechnicalParameterLinesByEventId(eventId: number): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.getAllTechnicalParameterLinesByEventId +
      `?EVENTID=${eventId}&EventTransId=0`;
    return this.http.get<any>(url_);
  }

  /**
  @param eventId
   */
  getTechnicalParametersOfEventsApi(
    eventid: number,
    eventTrasnId: number
  ): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.getTechnicalParametersOfEvents +
      `?EVENTID=${eventid}&EventTransid=${eventTrasnId}`;
    return this.http.get<any>(url_);
  }

  /**
  @param eventId
   */
  getTechnicalParameterTermsFromVendorSide(
    eventTransId: number
  ): Observable<IDefaultResponseDto<ITechnicalTermForVendor[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.getTechnicalParameterTermsFromVendorSide +
      `?EventTranId=${eventTransId}`;
    return this.http.get<IDefaultResponseDto<ITechnicalTermForVendor[]>>(url_);
  }

  /**
  @param eventId
   */
  saveTechnicalParameterTermsFromVendorSide(
    payload: any
  ): Observable<IDefaultResponseDto<ITechnicalTermForVendor>> {
    payload.userId = this.authData?.userId;
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.saveTechnicalParameterTermsFromVendorSide;
    return this.http.post<IDefaultResponseDto<ITechnicalTermForVendor>>(
      url_,
      payload
    );
  }
  /**
  @param eventId
   */
  updateTechnicalParameterTermsFromVendorSide(
    payload: any
  ): Observable<IDefaultResponseDto<ITechnicalTermForVendor>> {
    payload.userId = this.authData?.userId;
    let url_ =
      this.baseUrl +
      '/' +
      TechnicalEvent.updateTechnicalParameterTermsFromVendorSide;
    return this.http.post<IDefaultResponseDto<ITechnicalTermForVendor>>(
      url_,
      payload
    );
  }

  /**<<<<<<--------------Technical api end--------------------->>>>>>>>>>>>>> */

  /**<<<<---------------------------------------- Price Bid APi starts ------------------------------>>>>>>>*/

  //Price bid templates
  getPriceBidTemplates(): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.getPriceBidTemplates;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  //Price bid lines
  getPriceBidLines(eventId: number): Observable<IPriceBidResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.getPriceBidLines +
      '?EventId=' +
      eventId;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  //Price Bid Charges
  getPriceBidCharges(): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.getPriceBidCharges;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  GetVendorEventCurrency(EventId:any,VendorId:any): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.GetVendorEventCurrency + `?EventId=${EventId}&VendorId=${VendorId}`;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  //Inco terms
  getIncoTerms(): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.getAllINCOTerms;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  //Payment terms
  getAllPaymentTerms(): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.getAllPaymentTerms;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  //Price Bid Charges post service
  postPriceBidCharges(data: any[]): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.setPriceBidCharges;
    return this.http.post<IPriceBidResultDataDto>(url_, data);
  }

  //Update price bid remark post service
  updatePriceBidRemarks(data: any): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.updatePriceBidRemarks;
    return this.http.post<IPriceBidResultDataDto>(url_, data);
  }

  //add price column
  addPriceBidColumns(data: any): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.addPriceBidColumns;
    return this.http.post<IPriceBidResultDataDto>(url_, data);
  }

  //Price Bid Charges
  getPriceBidColumns(eventId: number): Observable<IPriceBidResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.getPriceBidColumns +
      '?EventId=' +
      eventId;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  //update price column
  updatePriceBidColumns(data: any): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.updatePriceBidColumns;
    return this.http.put<IPriceBidResultDataDto>(url_, data);
  }

  //delete price column
  deletePriceBidColumns(data: any[]): Observable<IPriceBidResultDataDto> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers, body: data };
    let url_ = this.baseUrl + '/' + PriceBidApis.deletePriceBidColumns;
    return this.http.delete<IPriceBidResultDataDto>(url_, options);
  }

  //Get Charges and Remarks
  getAssignedPBBidChargesNRemarks(
    eventId: number,
    type: any = null
  ): Observable<IPriceBidResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.getAssignedPBBidChargesNRemarks +
      '?EventId=' +
      eventId +
      '&Type=' +
      type;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  //update Charges and Remarks
  updatePriceBidChargeNRemark(data: any): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.updatePriceBidChargeNRemark;
    return this.http.put<IPriceBidResultDataDto>(url_, data);
  }

  //Delete Charges and Remarks
  deletePriceBidChargeNRemark(data: any[]): Observable<IPriceBidResultDataDto> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers, body: data };
    let url_ = this.baseUrl + '/' + PriceBidApis.deletePriceBidChargeNRemark;
    return this.http.delete<IPriceBidResultDataDto>(url_, options);
  }

  //Price BidCharge and Remark post service
  addPriceBidChargeNRemark(data: any): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.addPriceBidChargeNRemark;
    return this.http.post<IPriceBidResultDataDto>(url_, data);
  }

  //Price Bid other Charges
  getOtherCharges(): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.getOtherCharges;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  //get man power item
  getAllManpowerItems(): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.getAllManpowerItems;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  //add Man power Items post service
  addManpowerItems(
    data: any,
    eventId: number
  ): Observable<IPriceBidResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.addManpowerItems +
      '?EventId=' +
      eventId;
    return this.http.post<IPriceBidResultDataDto>(url_, data);
  }

  /**
  @param eventTrasnId
  */
  getAllSubItems(eventTrasnId: number): Observable<IPriceBidResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.getAllSubItems +
      `?EventTranId=${eventTrasnId}`;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  getAllSubItemsForVendor(
    eventTrasnId: number,
    vendorId: number
  ): Observable<IDefaultResponseDto<ISubItemsForVendorsDataDto[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.getAllSubItemsForVendors +
      `?EventTranId=${eventTrasnId}&VendorId=${vendorId}`;
    return this.http.get<IDefaultResponseDto<ISubItemsForVendorsDataDto[]>>(
      url_
    );
  }
  /**
  @param payload
  */
  addSubItems(payload: any): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.addSubItems;
    return this.http.post<IPriceBidResultDataDto>(url_, payload);
  }

  /**
  @param payload
  */
  updateSubItems(payload: any): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.updateSubItems;
    return this.http.put<IPriceBidResultDataDto>(url_, payload);
  }

  /**
  @param payload
   */
  deleteSubItems(data: any): Observable<IPriceBidResultDataDto> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers, body: data };
    let url_ = this.baseUrl + '/' + PriceBidApis.deleteSubItems;
    return this.http.delete<IPriceBidResultDataDto>(url_, options);
  }

  //delete rfq items
  deleteRFQItems(payload: any): Observable<IPriceBidResultDataDto> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers, body: payload };
    let url_ = this.baseUrl + '/' + PriceBidApis.deleteRFQItems;
    return this.http.delete<IPriceBidResultDataDto>(url_, options);
  }

  //Update price bid remark post service
  updateVendorPriceBidOnLine(data: any): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.vendorPriceBidOnLine;
    return this.http.put<IPriceBidResultDataDto>(url_, data);
  }

  /**
 @param eventTrasnId
 */
  getVendorPriceBidOnLine(
    eventTrasnId: number
  ): Observable<IPriceBidResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.getVendorPriceBidOnLine +
      `?EventTranId=${eventTrasnId}`;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  /**
 @param eventId
 */
  getVendorChargesNCRemarks(
    eventId: number
  ): Observable<IPriceBidResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.getVendorChargesNCRemarks +
      `?EventId=${eventId}`;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  //Save charge and remark by vendor
  saveChargesNRemarksByVendor(data: any): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + PriceBidApis.saveChargesNRemarksByVendor;
    return this.http.post<IPriceBidResultDataDto>(url_, data);
  }

  /**
@param TaxType
*/
  getTaxes(taxType: string): Observable<IPriceBidResultDataDto> {
    let url_ =
      this.baseUrl + '/' + PriceBidApis.getTaxes + `?TaxType=${taxType}`;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }

  /**
@param eventId
@param documentName
@param remarks
@param payload : image
 */
  submitPriceBid(
    eventId: number,
    documentName: string,
    validity: number,
    isSubmit: boolean,
    file: any,
    filePath: string
  ): any {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.submitPriceBid +
      `?EventId=${eventId}&DocumentName=${documentName}&Validity=${validity}&IsSubmit=${isSubmit}`;
    return from(this.multiPartApiCall(url_, file, filePath));
  }

  //Price bid lines
  getBidComparison(
    eventId: number,
    csId: number = 0
  ): Observable<IPriceBidResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.getBidComparison +
      `?EventId=${eventId}&CSId=${csId}`;
    return this.http.get<IPriceBidResultDataDto>(url_);
  }
  getHeaderBidComparison(
    eventId: number,
    csId: number = 0
  ): Observable<IDefaultResponseDto<IheaderBidComparision>> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.getHeaderBidComparision +
      `?EventId=${eventId}&CSId=${csId}`;

    return this.http.get<IDefaultResponseDto<IheaderBidComparision>>(url_);
  }

  getChargeDescription(code: number): Observable<IDefaultResponseDto<boolean>> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.getHeaderBidComparision +
      `??code=${code}`;

    return this.http.get<IDefaultResponseDto<boolean>>(url_);
  }

  setSubItemsForVendor(paylaod: any): Observable<IDefaultResponseDto<string>> {
    let url_ = this.baseUrl + '/' + PriceBidApis.setSubItemsForVendor;

    return this.http.post<IDefaultResponseDto<string>>(url_, paylaod);
  }

  getPOHistory(
    itemCode: string
  ): Observable<IDefaultResponseDto<IPoHistoryDto[]>> {
    let url_ =
      this.baseUrl + '/' + PriceBidApis.getPOHistory + `?ItemCode=${itemCode}`;
    return this.http.get<IDefaultResponseDto<IPoHistoryDto[]>>(url_);
  }

  /**<<<<---------------------------------------- Price Bid APi ends ------------------------------>>>>>>>*/

  /**<<<<---------------------------------------- Term and Conditions APi starts ------------------------------>>>>>>>*/

  //Save Terms And Condition
  postSaveTermsAndCondition(
    data: any
  ): Observable<ITermAndConditionResultDataDto> {
    data.userid = this.authData?.userId;
    let url_ =
      this.baseUrl + '/' + TermsAndConditionsApis.saveTermsAndCondition;
    return this.http.post<ITermAndConditionResultDataDto>(url_, data);
  }

  //Edit Terms And Condition
  postEditTermsAndCondition(
    data: any
  ): Observable<ITermAndConditionResultDataDto> {
    data.userid = this.authData?.userId;
    let url_ =
      this.baseUrl + '/' + TermsAndConditionsApis.editTermsAndCondition;
    return this.http.post<ITermAndConditionResultDataDto>(url_, data);
  }

  //Delete Terms and condition
  deleteTermsAndCondition(
    tncid: number
  ): Observable<ITermAndConditionResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      TermsAndConditionsApis.deleteTermsAndCondition +
      '?TNCID=' +
      tncid;
    return this.http.post<ITermAndConditionResultDataDto>(url_, {});
  }

  //ALL Terms And Condition
  getALLTermsAndCondition(
    eventId: number,
    searchBy: string
  ): Observable<ITermAndConditionResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      TermsAndConditionsApis.getALLTermsAndCondition +
      '?EVENTID=' +
      eventId +
      '&SearchBy=' +
      searchBy;
    return this.http.get<ITermAndConditionResultDataDto>(url_);
  }

  //Get Terms And Condition by id
  getTermsAndConditionById(
    pncid: number
  ): Observable<ITermAndConditionResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      TermsAndConditionsApis.getTermsAndConditionById +
      '?PNCID=' +
      pncid;
    return this.http.get<ITermAndConditionResultDataDto>(url_);
  }

  //Get Vendor Deviation List
  getVendorDeviationList(
    eventId: number
  ): Observable<ITermAndConditionResultDataDto> {
    let url_ =
      this.baseUrl +
      '/' +
      TermsAndConditionsApis.getVendorDeviationList +
      '?EVENTID=' +
      eventId;
    return this.http.get<ITermAndConditionResultDataDto>(url_);
  }

  //Accept Vendor Deviation
  postAcceptVendorDeviation(
    data: any
  ): Observable<ITermAndConditionResultDataDto> {
    data.userid = this.authData?.userId;
    data.vendorid = this.authData?.userId;
    let url_ =
      this.baseUrl + '/' + TermsAndConditionsApis.acceptVendorDeviation;
    return this.http.post<ITermAndConditionResultDataDto>(url_, data);
  }

  //Deviate Vendor Deviation
  postDeviateVendorDeviation(
    data: any
  ): Observable<ITermAndConditionResultDataDto> {
    let url_ =
      this.baseUrl + '/' + TermsAndConditionsApis.deviateVendorDeviation;
    return this.http.post<ITermAndConditionResultDataDto>(url_, data);
  }

  //Update Vendor Deviation
  postUpdateVendorDeviation(
    data: any
  ): Observable<ITermAndConditionResultDataDto> {
    let url_ =
      this.baseUrl + '/' + TermsAndConditionsApis.updateVendorDeviation;
    return this.http.post<ITermAndConditionResultDataDto>(url_, data);
  }

  // <--------------------------------------Templates api -------------------------->
  //Update Vendor Deviation
  /**
    @param   templateType: string,
    @param  templateName: '',
 ageSize,
 * @return IRfqcsListDataDto
 */
  saveTemplateApi(payload: any): Observable<ISaveTemplateResponseDto> {
    payload.userId = this.authData?.userId;
    let url_ = this.baseUrl + '/' + TemplateApis.saveTemplate;
    return this.http.post<ISaveTemplateResponseDto>(url_, payload);
  }
  getTemplatebyidApi(
    TemplateId: number
  ): Observable<IGetTemplateByIdResponseDto> {
    let url_ =
      this.baseUrl +
      '/' +
      TemplateApis.getTemplatebyid +
      '?TEMPLATEID=' +
      TemplateId;
    return this.http.get<IGetTemplateByIdResponseDto>(url_);
  }
  GetTemplateByTypeApi(TemplateType: string, itemId: number): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      TemplateApis.getTemplatebytype +
      '?TEMPLATETYPE=' +
      TemplateType +
      '&ItemId=' +
      itemId;
    return this.http.get<any>(url_);
  }

  // <--------------------------------------RFQCS api -------------------------->
  //update rfq api
  UpdateRFQApi(payload: any): Observable<IUpdateRfqResponseDto> {
    let url_ = this.baseUrl + '/' + RfqcsApis.updateRfq;
    return this.http.post<IUpdateRfqResponseDto>(url_, payload);
  }

  getTechnicalSpecification(eventTransId: number): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.getTechnicalSpecification +
      `?EventTranID=${eventTransId}`;
    return this.http.get<any>(url_);
  }

  TranferEventToOtherBuyer(
    eventId: number,
    transferToId: number
  ): Observable<IGetAllBuyer> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.TransferEventToOtherBuyer +
      `?EventID=${eventId}&TransferFrom=${this.authData?.userId}&TransferTo=${transferToId}`;
    return this.http.post<IGetAllBuyer>(url_, {});
  }

  SelectAdministratorApi(
    eventId: number,
    transferToId: number
  ): Observable<IGetAllAdminstrator> {
    let url_ =
      this.baseUrl +
      '/' +
      ViewerAndAdminstrator.saveRAAdminstrator +
      `?EventID=${eventId}&userId=${transferToId}`;
    return this.http.put<IGetAllAdminstrator>(url_, {});
  }

  shortclose(eventtranId: number, Reason: number): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.Shortcloseapi +
      `?EventTranId=${eventtranId}&Reason=${Reason}`;
    return this.http.post<any>(url_, {});
  }

  RegretParticipateRfq(payload: any): Observable<IDefaultResponseDto<any>> {
    payload.userId = this.authData?.userId;
    let url_ = this.baseUrl + '/' + RfqcsApis.regretParticipateRFQ;
    return this.http.post<IDefaultResponseDto<any>>(url_, payload);
  }

  getRankandColorRangeForVendors(
    eventId: number,
    vendorId: number
  ): Observable<IDefaultResponseDto<any>> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.getRankAndColorRangeForVendors +
      `?EventId=${eventId}&VendorId=${vendorId}`;

    return this.http.get<IDefaultResponseDto<any>>(url_);
  }

  getAuctionGraphDetails(
    eventId: number,
    vendorId: number = 0
  ): Observable<IDefaultResponseDto<AuctionGraphDetails[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.getAuctionGraphDetails +
      `?EventId=${eventId}&VendorId=${vendorId}`;
    return this.http.get<IDefaultResponseDto<AuctionGraphDetails[]>>(url_);
  }

  GetAllEventVendor(eventId: number): Observable<IGetAllEventVendor> {
    let payload = {};
    let url_ =
      this.baseUrl + '/' + RfqcsApis.getAllEventVendors + `?EventID=${eventId}`;
    return this.http.post<IGetAllEventVendor>(url_, payload);
  }

  getReverseAuctionSettingsList(eventId: number): Observable<IReverseAuctionList> {

    let url_ = this.baseUrl + '/' + ReverseAuctionSettingApis.getReverseAuctionSetting + `?EventId=${eventId}`;
    return this.http.get<IReverseAuctionList>(url_);
  }
  getTimeZoneList(): Observable<ITimeZoneList> {

    let url_ = this.baseUrl + '/' + ReverseAuctionSettingApis.getTimeZoneList ;
    return this.http.get<ITimeZoneList>(url_);
  }

  

  getReverseAuctionSettingssubItemList(eventId: number, BidConfig: string): Observable<IReverseAuctionSubItemList> {

    let url_ = this.baseUrl + '/' + ReverseAuctionSettingApis.getReverseAuctionSettingSubItem + `?EventTranId=${eventId}&BidConfig=${BidConfig}`;
    return this.http.get<IReverseAuctionSubItemList>(url_);
  }

  getWfUserRolesById(eventId: number): Observable<IgetWfUserRole> {

    let url_ = this.baseUrl + '/' + ReverseAuctionSettingApis.getWfUserRole + `?EventId=${eventId}`;
    return this.http.get<IgetWfUserRole>(url_);
  }

  getReverseAuctionViewersList(eventId: number): Observable<IReverseAuctionViewerList> {

    let url_ = this.baseUrl + '/' + ReverseAuctionSettingApis.getReverseAuctionViewerApi + `?EventId=${eventId}`;
    return this.http.get<IReverseAuctionViewerList>(url_);
  }

  saveReverseAuctionViewers(eventId: number, payload: any): Observable<IReverseAuctionViewerList> {

    let url_ = this.baseUrl + '/' + ReverseAuctionSettingApis.saveReverseAuctionViewersApi + `?EventId=${eventId}`;
    return this.http.post<IReverseAuctionViewerList>(url_, payload);
  }

  SavereverseAuctionSettingsApi(payload: any): Observable<ISaveReverseAuctionSettingsApi> {
    let url_ = this.baseUrl + '/' + ReverseAuctionSettingApis.saveReverseAuctionSettingApi;
    return this.http.post<ISaveReverseAuctionSettingsApi>(url_, payload);
  }

  SavereverseAuctionSettingssubItemsApi(payload: any): Observable<ISaveSubItemsRASettingsApi> {
    let url_ = this.baseUrl + '/' + ReverseAuctionSettingApis.saveReverseAuctionSettingSubItem;
    return this.http.post<ISaveSubItemsRASettingsApi>(url_, payload);
  }

  submitReverseAuctionApi(eventId: any, remark: any): Observable<IDefaultResponseDto<boolean>> {
    let url_ =
      this.baseUrl + '/' + ReverseAuctionSettingApis.submitReverseAuction + `?EventId=${eventId}&Remark=${remark}`;
    return this.http.put<IDefaultResponseDto<boolean>>(url_, {});
  }



  deleteRfqAuction(eventId: number): Observable<IDefaultResponseDto<any>> {
    let url_ =
      this.baseUrl + '/' + RfqcsApis.deleteRfqAuction + '?EventId=' + eventId;
    return this.http.post<IDefaultResponseDto<any>>(url_, {});
  }
  deleteEventVendor(
    eventId: number,
    vendorId: number
  ): Observable<IDefaultResponseDto<any>> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.deleteEventVendor +
      '?EventId=' +
      eventId +
      '&VendorId=' +
      vendorId;
    return this.http.post<IDefaultResponseDto<any>>(url_, {});
  }
  terminateRfqAuction(payload: any): Observable<IDefaultResponseDto<any>> {
    let url_ = this.baseUrl + '/' + RfqcsApis.terminateRfqAuction;
    return this.http.post<IDefaultResponseDto<any>>(url_, payload);
  }

  updateEventTitle(
    eventId: number,
    eventTitle: string
  ): Observable<IDefaultResponseDto<any>> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.updateEventTitle +
      '?EventId=' +
      eventId +
      '&EventTitle=' +
      eventTitle;
    return this.http.put<IDefaultResponseDto<any>>(url_, {});
  }

  ScheduleEvent(payload: any): Observable<IScheduleEventResponseDto> {
    let url_ = this.baseUrl + '/' + RfqcsApis.scheduleEvent;
    return this.http.post<IScheduleEventResponseDto>(url_, payload);
  }
  getRfqForCopyEvent(
    pageindex: number,
    pagesize: number,
    searchText: string
  ): Observable<IDefaultResponseDto<IGetRfqForCopyEvent[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.getRfqForCopyEvent +
      '?pageIndex=' +
      pageindex +
      '&pageSize=' +
      pagesize +
      '&SearchText=' +
      searchText;
    return this.http.get<IDefaultResponseDto<IGetRfqForCopyEvent[]>>(url_);
  }

  rfqcsCopyEvent(copyFromEvent: number, copyToEvent: number): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.copyEvent +
      '?CopyFromEvent=' +
      copyFromEvent +
      '&CopyToEvent=' +
      copyToEvent;

    return this.http.post<any>(url_, {});
  }

  SaveEventVendors(payload: any): Observable<ISaveEventVendorsResponseDto> {
    let url_ = this.baseUrl + '/' + RfqcsApis.saveEventVendors;
    return this.http.post<ISaveEventVendorsResponseDto>(url_, payload);
  }
  UploadOtherDocument(
    payload: any
  ): Observable<IUploadOtherDocumentResponseDto> {
    let url_ = this.baseUrl + '/' + RfqcsApis.uploadOtherDocument;
    return this.http.post<IUploadOtherDocumentResponseDto>(url_, payload);
  }
  SubmitOtherDocument(
    eventId: number
  ): Observable<ISubmitOtherDocumentResponseDto> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.submitOtherDocument +
      '?EVENTID=' +
      eventId;
    return this.http.get<ISubmitOtherDocumentResponseDto>(url_);
  }

  getAuctionDetails(eventId: number): Observable<IgetAuctionDetailsDataDto> {
    let url_ =
      this.baseUrl + '/' + RfqcsApis.getAuctionDetails + '?EVENTID=' + eventId;
    return this.http.get<IgetAuctionDetailsDataDto>(url_);
  }

  getAuctionDetailsForVendors(
    eventId: number,
    vendorId: number
  ): Observable<IDefaultResponseDto<IgetAuctionDetailsForVendorsDataDto>> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.getAuctionDetailsForVendors +
      `?EVENTID=${eventId}&VendorId=${vendorId}`;
    return this.http.get<
      IDefaultResponseDto<IgetAuctionDetailsForVendorsDataDto>
    >(url_);
  }

  GetVendorWiseEvents(): Observable<IGetVendorWiseEventsResponseDto> {
    let payload = {};

    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.getVendorWiseEvents +
      `?VendorID=${this.authData?.userId}`;
    return this.http.post<IGetVendorWiseEventsResponseDto>(url_, payload);
  }

  //update currency and template
  saveCurrencyAndTemplate(data: any): Observable<IPriceBidResultDataDto> {
    let url_ = this.baseUrl + '/' + RfqcsApis.saveCurrencyAndTemplate;
    return this.http.put<IPriceBidResultDataDto>(url_, data);
  }

  getSuggestedVendors(
    payload: any
  ): Observable<IGetVendorWiseEventsResponseDto> {
    let url_ = this.baseUrl + '/' + RfqcsApis.getSuggestedVendors;
    return this.http.post<IGetVendorWiseEventsResponseDto>(url_, payload);
  }

  getInvitationTemplate(
    eventId: number
  ): Observable<IDefaultResponseDto<IInvitationTemplate[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.getInvitationTemplate +
      `?EventId=${eventId}`;
    return this.http.get<IDefaultResponseDto<IInvitationTemplate[]>>(url_);
  }

  getEventsScheduleDetails(
    eventId: number
  ): Observable<IDefaultResponseDto<IScheduleResponseDto>> {
    let url_ =
      this.baseUrl +
      '/' +
      RfqcsApis.getEventsScheduleDetails +
      `?EventId=${eventId}`;
    return this.http.get<IDefaultResponseDto<IScheduleResponseDto>>(url_);
  }

  RFQNextRoundApi(payload: any): Observable<IDefaultResponseDto<any>> {
    let url_ = this.baseUrl + '/' + RfqcsApis.RFQNextRound;
    return this.http.post<IDefaultResponseDto<any>>(url_, payload);
  }

  // ------------------------------------------- CollaborationApis ------------------------------------

  getAssignedcollaborativeuser(
    eventId: number,
    isCollaborator: boolean = false
  ): Observable<any> {
    let userId = this.authData?.userId;
    let url_ =
      this.baseUrl +
      '/' +
      CollaborationApis.GetAssignedCollaborativeUser +
      `?EventId=${eventId}` +
      (isCollaborator ? `&CollaboratorId=${userId}` : '');

    return this.http.get<any>(url_);
  }

  getCollabrativeUserApi(eventId: number): Observable<any> {
    let url_ = this.baseUrl + '/' + CollaborationApis.getCollabrativeUser;

    return this.http.get<any>(url_);
  }

  assignCollobrativeUserApi(payload: any): Observable<any> {
    let url_ = this.baseUrl + '/' + CollaborationApis.assignCollobrativeUser;
    return this.http.post<any>(url_, payload);
  }

  updateAssignCollobrativeUserApi(payload: any): Observable<any> {
    let url_ =
      this.baseUrl + '/' + CollaborationApis.updateAssignCollobrativeUser;
    return this.http.post<any>(url_, payload);
  }

  deleteCollobrativeUserApi(assignId: number, payload: any): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      CollaborationApis.deleteCollobrativeUser +
      `?AssignId=${assignId}`;
    return this.http.post<any>(url_, payload);
  }

  GetReasonByType(
    type: string
  ): Observable<IDefaultResponseDto<IReasonDataDto[]>> {
    let url_ = this.baseUrl + '/' + RfqcsApis.getReasonByType + `?Type=${type}`;
    return this.http.get<IDefaultResponseDto<IReasonDataDto[]>>(url_);
  }

  uploadScoreDocument(
    eventId: number,
    vendorId: number,
    file: any,
    filePath: string
  ): any {
    let url_ =
      this.baseUrl +
      '/' +
      CollaborationApis.uploadScoreDocument +
      `?EventId=${eventId}&VendorId=${vendorId}`;
    return from(this.multiPartApiCall(url_, file, filePath));
  }

  // ------------------------------ Publish -----------------------------------------------------------
  publishEventApi(payload: any): Observable<any> {
    let url_ = this.baseUrl + '/' + PublishEventApis.publishEvent;
    return this.http.put<any>(url_, payload);
  }
  /**
      @param   eventId: this.authData.userId,

   * @return IRfqcsListDataDto
   */
  getpublishChecklistApi(
    eventId: number
  ): Observable<IDefaultResponseDto<PublishChecklistResponseDto>> {
    let url_ =
      this.baseUrl +
      '/' +
      PublishEventApis.publishChecklist +
      `?EventId=${eventId}`;
    return this.http.get<IDefaultResponseDto<PublishChecklistResponseDto>>(
      url_
    );
  }

  //-----------------------------------Event communication start----------------------------------------------
  getThreadByThreadId(
    threadId: string
  ): Observable<IDefaultResponseDto<ThreadUserDto>> {
    let url_ =
      this.baseUrl +
      '/' +
      eventCommunicationApis.getThreadByThreadId +
      `?ThreadId=${threadId}`;
    return this.http.get<IDefaultResponseDto<ThreadUserDto>>(url_);
  }

  getThreadsByEventId(
    eventId: number
  ): Observable<IDefaultResponseDto<ThreadUserDto[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      eventCommunicationApis.getThreadsByEventId +
      `?EventId=${eventId}&PageIndex=1&PageSize=500`;
    return this.http.get<IDefaultResponseDto<ThreadUserDto[]>>(url_);
  }

  getRepliesByThreadId(
    threadId: string,
    pageIndex: number,
    pageSize: number
  ): Observable<IDefaultResponseDto<ThreadReplyDto[]>> {
    let url_ = `${this.baseUrl}/${eventCommunicationApis.getRepliesByThreadId}?ThreadId=${threadId}&PageIndex=${pageIndex}&PageSize=${pageSize}`;
    return this.http.get<IDefaultResponseDto<ThreadReplyDto[]>>(url_);
  }

  sendReply(
    replyDto: ThreadReplyDto
  ): Observable<IDefaultResponseDto<ThreadReplyDto>> {
    let url_ = `${this.baseUrl}/${eventCommunicationApis.replyInThread}`;
    return this.http.post<any>(url_, replyDto);
  }

  uploadFileThread(threadId: string, file: any) {
    let url_ = `${this.baseUrl}/${eventCommunicationApis.uploadFile}?ThreadId=${threadId}`;
    var formdata = new FormData();
    formdata.append('files', file);

    return from(this.fileUploadMultiPart(url_, formdata));
  }

  fileUploadMultiPart(url_: string, formdata: FormData) {
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers();
      let userDetails: any = this.authData;
      if (userDetails.userId) {
        myHeaders.append('UserId', userDetails.userId);
      }
      if (userDetails.userRole) {
        myHeaders.append('UserRole', userDetails.userRole);
      }
      myHeaders.append('Authorization', 'Bearer ' + userDetails.accessToken);

      fetch(url_, {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
        headers: myHeaders,
      })
        .then((response) => response.text())
        .then((result) => resolve(JSON.parse(result)))
        .catch((error) => reject(error));
    });
  }

  refreshChatQueue(): Observable<any> {
    let url_ = `${baseUrl}/queue`;
    return this.http.get<any>(url_);
  }

  getAllBroadcastTemplates(): Observable<IDefaultResponseDto<BroadcastTemplatDto[]>> {
    let url_ = this.baseUrl + '/' + eventCommunicationApis.getAllBroadcastTemplates;
    return this.http.get<IDefaultResponseDto<BroadcastTemplatDto[]>>(url_);
  }

  getOldBroadcastMsg(
    threadId : string,
    pageIndex: number,
    pageSize: number): Observable<IDefaultResponseDto<ThreadReplyDto[]>> {
    let url_ = `${this.baseUrl}/${eventCommunicationApis.getOldBroadcastMsg}?ThreadId=${threadId}&PageIndex=${pageIndex}&PageSize=${pageSize}`;
    return this.http.get<IDefaultResponseDto<ThreadReplyDto[]>>(url_);
  }
  //-----------------------------------Event communication close----------------------------------------------

  // -------------------------------------------- Cs Approval start -------------------------------------------------------
  /**
      @param   UserId: this.authData.userId,

   * @return IRfqcsListDataDto
   */
  getVendorsForCsApproval(
    eventId: any
  ): Observable<IDefaultResponseDto<IVendorList[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.getVendorsForCSApproval +
      `?EVENTID=${eventId}`;
    return this.http.get<IDefaultResponseDto<IVendorList[]>>(url_);
  }

  getCsVendorSelectionReason(
    ReasonId: string
  ): Observable<ICsGetCSVendorSelectionReason> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.GetCSVendorSelectionReason +
      '?ReasonCode=' +
      ReasonId;
    return this.http.get<ICsGetCSVendorSelectionReason>(url_);
  }

  GetRATranAuctionSettings(EventId:number,EventTranId: number): Observable<IGetRATranAuctionSettings> {
    let url_ =
      this.baseUrl +
      '/' +
      ReverseAuctionSettingApis.tranAuctionSettings +
      `?EventId=${EventId}&EventTranId=${EventTranId}`;
    return this.http.get<IGetRATranAuctionSettings>(url_);
  }

  getCsStatusDetails(
    eventId: any
  ): Observable<IDefaultResponseDto<ICsStatusList[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.getCsStatusDetailApi +
      `?EVENTID=${eventId}`;
    return this.http.get<IDefaultResponseDto<ICsStatusList[]>>(url_);
  }

  getCSLineDetailsOfCSApproval(
    eventId: number,
    vendorId: number
  ): Observable<IDefaultResponseDto<IgetCSLineDetailsOfCSApproval>> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.getCSLineDetailsofCSApproval +
      `?EVENTID=${eventId}&VendorId=${vendorId}`;
    return this.http.get<IDefaultResponseDto<IgetCSLineDetailsOfCSApproval>>(
      url_
    );
  }

  getMyAwardCs(payload:any): Observable<IDefaultResponseDto<IMyAwardCs[]>> {
    let url_ = this.baseUrl + '/' + CsApprovalApis.myAwardCs;
    return this.http.post<IDefaultResponseDto<IMyAwardCs[]>>(url_,payload);
  }

  getCSDocumentURL(AwardNo:number,fileName:string,filePath:string): Observable<IDefaultResponseDto<any>> {
    let url_ = this.baseUrl + '/' + CsApprovalApis.getcSDocumentUrl + `?awardNo=${AwardNo}&fileName=${fileName}&filePath=${filePath}`;
    return this.http.get<IDefaultResponseDto<any>>(url_);
  }
  /**
      @param   EventId: eventId,
      @param   VendorId: Selected vendor id,

   * @return IRfqcsListDataDto
   */
  // EVENTID=143&VendorId=6399
  getVendorDetailForCsApproval(
    eventId: any,
    vendorId: any
  ): Observable<IDefaultResponseDto<IVendorDetail>> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.GetEventDetailsForVendorCS +
      `?EVENTID=${eventId}&VendorId=${vendorId}`;
    return this.http.get<IDefaultResponseDto<IVendorDetail>>(url_);
  }

  ViewCsApi(
    eventId: number,
    eventCode: string = ''
  ): Observable<IDefaultResponseDto<IviewCsResponseDto[]>> {
    let url_ =
      this.baseUrl + '/' + CsApprovalApis.viewcs + '?EVENTID=' + eventId + (eventCode ? `&EventCode=${eventCode}` : '');
    return this.http.get<IDefaultResponseDto<IviewCsResponseDto[]>>(url_);
  }

  createCSApproval(payload: any): Observable<any> {
    let url_ = this.baseUrl + '/' + CsApprovalApis.createCsApproval;
    return this.http.post<any>(url_, payload);
  }

  ScoringByCollaborator(payload: any): Observable<any> {
    let url_ = this.baseUrl + '/' + CollaborationApis.ScoringByCollaborator;
    return this.http.post<any>(url_, payload);
  }

  DownloadComparisionSheet(payload: any): Observable<any> {
    let url_ = this.baseUrl + '/' + CsComparision.downloadComparisionSheet;
    return from(this.downloadFileType(url_, payload))
  }
  DownloadTechnicalComparisionSheet(payload: any): Observable<any> {
    let url_ = this.baseUrl + '/' + CsComparision.DownloadTechnicalComparisionSheet;
    return from(this.downloadFileType(url_, payload))
  }

  downloadFileType(_url: string, payload: any) {
    return new Promise((resolve, reject) => {
      const url = _url; // Replace with your API endpoint
      const data = payload;
      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authData && this.authData.accessToken}`,
          "userId": this.authData ? this.authData.userId.toString() : '',
          "userRole": this.authData ? this.authData.userRole : '',
        }
      };
      fetch(url, options)
        .then(response => resolve(response.blob()))
        .catch(err => reject(err))
    })

  }


  // downloadFileFromUrl(url :string , paylaod :any) {

  //   const options = {
  //     method: 'POST',
  //     body: JSON.stringify(paylaod),
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${this.authData?.accessToken}`
  //     }
  //   return new Promise((resolve, reject) => {
  //     fetch(url, options)
  //       .then((response) => resolve(response.blob()))
  //       .then((blob) => {
  //         const urlBlob = window.URL.createObjectURL(blob);
  //         const link = document.createElement('a');
  //         link.href = urlBlob;
  //         link.download = 'file.xlsx'; // Replace 'file.pdf' with the desired filename
  //         link.click();
  //         window.URL.revokeObjectURL(urlBlob);
  //       });
  //   });
  // }

  createPo(AwardId: number): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.createPo +
      `?AwardId=${AwardId}&CSDocPath=${'testdoc'}`;
    return this.http.post<any>(url_, {});
  }

  RejectLastBid(
    EventId: number,
    VendorId: number,
    Reason: string
  ): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      PriceBidApis.RejectLastBid +
      `?EventId=${EventId}&VendorId=${VendorId}&Reason=${Reason}`;
    return this.http.post<any>(url_, {});
  }

  DisqualifyVendorBid(
    EventId: number,
    VendorId: number,
    Reason: string
  ): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      ReverseAuctionSettingApis.disqualifyVendorBid +
      `?EventId=${EventId}&VendorId=${VendorId}&DisqualificationReason=${Reason}`;
    return this.http.post<any>(url_, {});
  }

  DownloadReverseAuctionReport(
  payload:any
  ): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      ReverseAuctionSettingApis.ReverseActionReport ;
      
      return from(this.downloadFileType(url_, payload))
  }


  createPoFromLine(AwardTranId: number, awardId: number): Observable<any> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.CreatePoFromLine +
      `?AwardTranId=${AwardTranId}&AwardId=${awardId}&CSDocPath=${'testdoc'}`;
    return this.http.post<any>(url_, {});
  }

  GetCSStatusList(
    eventId: number
  ): Observable<IDefaultResponseDto<ICsStatusListDto[]>> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.getCSStatusList +
      `?EVENTID=${eventId}`;
    return this.http.get<IDefaultResponseDto<ICsStatusListDto[]>>(url_);
  }

  GetCSDetails(awardId: number): Observable<IDefaultResponseDto<ICsDetailDto>> {
    let url_ =
      this.baseUrl + '/' + CsApprovalApis.getCSDetails + `?AwardId=${awardId}`;
    return this.http.get<IDefaultResponseDto<ICsDetailDto>>(url_);
  }

  GetCsLines(awardId: number): Observable<IDefaultResponseDto<getCsLinesDto>> {
    let url_ =
      this.baseUrl + '/' + CsApprovalApis.GetCsLine + `?AwardId=${awardId}`;
    return this.http.get<IDefaultResponseDto<getCsLinesDto>>(url_);
  }

  GetdisqualificationDetails(EventId:number,VendorId: number): Observable<getDisqualificationDataDto> {
    let url_ =
      this.baseUrl + '/' + ReverseAuctionSettingApis.disqualificationDetailsHistory + `?EventId=${EventId}&VendorId=${VendorId}`;
    return this.http.get<getDisqualificationDataDto>(url_);
  }
  // GetCSStatusList()

  getCSReview(
    awardId: number
  ): Observable<IDefaultResponseDto<IGetCSReviewDto[]>> {
    let url_ =
      this.baseUrl + '/' + CsApprovalApis.getCSReview + `?AwardId=${awardId}`;
    return this.http.get<IDefaultResponseDto<IGetCSReviewDto[]>>(url_);
  }

  getVendorBidComparison(
    eventId: number
  ): Observable<IDefaultResponseDto<IVendorBidDto>> {
    let url_ =
      this.baseUrl +
      '/' +
      CsApprovalApis.getVendorBidComparison +
      `?EventId=${eventId}`;
    return this.http.get<IDefaultResponseDto<IVendorBidDto>>(url_);
  }
  // -------------------------------------------- Cs Approval end -------------------------------------------------------

  shortCloseCsApproval(
    awardTransId: number,
    resason: string
  ): Observable<IDefaultResponseDto<any>> {
    let url_ = this.baseUrl + '/' + CsApprovalApis.shortCloseCS + `?AwardTranId=${awardTransId}&Reason=${resason}`;
    return this.http.post<IDefaultResponseDto<any>>(url_, {});
  }

  // -------------------------------------------- Chat sercvice  -------------------------------------------------------

  getCCMailUsers(
    eventId: number
  ): Observable<IDefaultResponseDto<any>> {
    let url_ = this.baseUrl + `/api/Common/GetCCMailUsers?EventId=${eventId}`;
    return this.http.get<IDefaultResponseDto<any>>(url_);
  }

  saveCCMailUsers(
    eventId: number,
    payload: any
  ): Observable<IDefaultResponseDto<any>> {
    let url_ = this.baseUrl + `/api/Common/SaveCCMailUsers?EventId=${eventId}`;
    return this.http.post<IDefaultResponseDto<any>>(url_, payload);
  }

  getEventVendorsEmail(eventid: any, eventVendorId: number): Observable<IDefaultResponseDto<any>> {
    let payload = {};
    let url_ =
      this.baseUrl + '/' + RfqcsApis.getEventVendorsEmail + `?EventID=${eventid}&VendorId=${eventVendorId}`;
    return this.http.post<IDefaultResponseDto<any>>(url_, payload);
  }


  saveEventVendorsEmail(Emails: any, EventID: any, VendorId: any): Observable<IDefaultResponseDto<any>> {
    let url_ =
      this.baseUrl + '/' + RfqcsApis.saveEventVendorsEmail + `?Emails=${Emails}&EventID=${EventID}&VendorId=${VendorId}`;
    return this.http.post<IDefaultResponseDto<any>>(url_, {});
  }
  // -------------------------------------------- Chat sercvice  -------------------------------------------------------

  // getCCMailUsers(
  //   eventId: number
  // ): Observable<IDefaultResponseDto<any>> {
  //   let url_ = this.baseUrl + `/api/Common/GetCCMailUsers?EventId=${eventId}`;
  //   return this.http.get<IDefaultResponseDto<any>>(url_);
  // }

  // saveCCMailUsers(
  //   eventId: number,
  //   payload: any
  // ): Observable<IDefaultResponseDto<any>> {
  //   let url_ = this.baseUrl + `/api/Common/SaveCCMailUsers?EventId=${eventId}`;
  //   return this.http.post<IDefaultResponseDto<any>>(url_, payload);
  // }
//you can commit out this on merging because create duplicate issue on merge
  // getReverseAuctionListApi(
  //   payload: any
  // ): Observable<IDefaultResponseDto<IRfqcsListDataDto[]>> {
  //   payload.userId = this.authData?.userId;
  //   let url_ = this.baseUrl + '/' + EventApis.getReverseAuctionList;
  //   return this.http.post<IDefaultResponseDto<IRfqcsListDataDto[]>>(
  //     url_,
  //     payload
  //   );
  // }
}
