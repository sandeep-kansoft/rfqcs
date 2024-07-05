import { environment } from 'src/environments/environment';

export const baseUrl: string = environment.isMockEnabled
  ? 'api'
  : environment.apiUrl;

export const LoginApi: any = {
  login: 'api/Login/Authenticate',
  switchtoeps: 'api/Login/SwitchToEPS',
  logout: "api/Login/LogOut",
  vendorForgotPasswordOtpSend : "api/Login/ForgotPaswordOTPSend",
  vendorVerifyOtp : "api/Login/ForgetPasswrodVerification",
  vendorUpdatePassword : "api/Login/UpdateVendorPassword"


};

export const commonApiModule: any = {
  usersApi: 'api/Users',
  commonApi: 'api/Common',
  cSApproveRejectStatus: 'api/Common/CSApproveReject',
  getDocumentPath : "api/Common/GetDocumentPath",
  reactiveEventStatus:'api/Common/ReactivateEvent'


};

export const PurchaseRequistionApi: any = {
  prOverview: 'api/PR/GetMy_PRList',
  getPrHistory: 'api/PR/GetPR_History',
  getAllPr: 'api/PR/GetAllPR',
  getPrLines: 'api/PR/GetPR_Lines',
  getPrLineHistory: 'api/PR/GetPRLine_History',
  getPrLineHistoryHeader: 'api/PR/GetPRDetails_ById',
  getPendingPPO: 'api/PPO/GetPendingPPO',
  getPrDetailById: 'api/PR/GetPRDetails_ById',
  getPrLineDetailById: 'api/PR/GetPRLinesDetail_ById',
  getAllPPO: 'api/PPO/GetAllPPO',
  getOnHandQuantity: 'api/PPO/GetOnHandQuantity',
  downloadPdf: 'api/PR/DownloadMyPRPdf',
  createRfqByPr: 'api/RFQCS/CreateRFQByPR',
  createRfqByPrLine: 'api/RFQCS/CreateRFQByPRLine',
  createRfqByPPO: 'api/RFQCS/CreateRFQByPPO',
  createAuctionByPR: 'api/RFQCS/CreateAuctionByPR',
  createAuctionByPRLine: 'api/RFQCS/CreateAuctionByPRLine',
  getPRAndPRLinesDetailsForManualRFQ:
    'api/PR/GetPRAndPRLinesDetailsForManualRFQ',
};

export const EventApis: any = {
  getRfqList: 'api/RFQCS/GetRFQList',
  getReverseAuctionList:'api/ReverseAuction/GetReverseAuctionList',
  ReactiveEventAPi:'api/ReverseAuction/SendReactivationLink',
  createRFQByPR: 'api/RFQCS/CreateRFQBYPR',
  createRFQByPRLines: 'api/RFQCS/CreateRFQByPRLine',
  technicalUpload: 'Technical/UploadTechnicalAttachment',
  deleteTechnicalAttachment: 'Technical/DeleteTechnicalAttachment',
  sumbitTechnicalAttachment: 'Technical/SubmitTechnicalAttachment',
  getAllTechnicalAttachment: 'GetAllTechnicalAttachment',
  downloadAllTechnicalAttachment: 'DownloadAllTechnicalAttachment',
  getAllVendors: 'api/RFQCS/GetAllVendors',
  getSuggestedVendor: 'api/RFQCS/GetSuggestedVendors',
  createRFQByPPO: 'RFQCS/CreateRFQByPPO',
  getRFQDetailsById: 'api/RFQCS/GetRFQDetailsById',
  createRFQmanually: 'api/RFQCS/CreateRFQManually',
  closeEvent: "api/RFQCS/CloseEvent"

};
export const BuyerDocument: any = {
  uploadBuyerDocument: 'api/Buyer/UploadBuyerAttachment',
  getAllBuyerAttachment: 'api/Buyer/GetAllBuyerAttachment',
  deleteBuyerAttachment: 'api/Buyer/DeleteBuyerAttachment',
  downloadAllBuyerAttachment: 'api/Buyer/DownloadAllBuyerAttachment',
  getAllBuyer: 'api/Buyer/GetAllBuyers'
};
export const TechnicalEvent: any = {
  uploadTechnicalAttachment: 'api/Technical/UploadTechnicalAttachment',
  downloadTechnicalAttachment: 'api/Technical/DownloadTechnicalAttachment',
  getAllTechnicalAttachment: 'api/Technical/GetAllTechnicalAttachment',
  downloadAllTechnicalAttachment:
    'api/Technical/DownloadAllTechnicalAttachment',
  deleteTechnicalAttachment: 'api/Technical/DeleteTechnicalAttachment',
  submitTechnicalAttachment: 'api/Technical/SubmitTechnicalAttachment',
  saveTechnicalParameters: 'api/Technical/SaveTechnicalParameters',
  updateTechnicalParameters: 'api/Technical/UpdateTechnicalParameters',
  deleteTechnicalParameters: 'api/Technical/DeleteTechnicalParameters',
  getTechnicalParametersById: 'api/Technical/GetTechnicalParametersById',
  saveTechnicalRemarks: 'api/Technical/SaveTechnicalRemarks',
  getTechnicalRemarksById: 'api/Technical/GetTechnicalRemarksById',
  getAllTechnicalParameterLinesByEventId:
    'api/Technical/GetAllTechnicalParameterLinesByEventId',

  getTechnicalParametersOfEvents:
    'api/Technical/GetTechnicalParametersOfEvents',

  getTechnicalParameterTermsFromVendorSide:
    'api/Technical/GetTechnicalParameterTermsFromVendorSide',
  saveTechnicalParameterTermsFromVendorSide:
    'api/Technical/SaveTechnicalParameterTermsFromVendorSide',
  updateTechnicalParameterTermsFromVendorSide:
    'api/Technical/UpdateTechnicalParameterTermsFromVendorSide',
};

export const PriceBidApis: any = {
  getPriceBidTemplates: 'api/PriceBid/GetPriceBidTemplates',
  getPriceBidLines: 'api/PriceBid/GetPriceBidLines',
  getPriceBidCharges: 'api/PriceBid/GetPriceBidCharges',
  getOtherCharges: 'api/PriceBid/GetOtherCharges',

  setPriceBidCharges: 'api/PriceBid/SetPriceBidCharges',
  updatePriceBidRemarks: 'api/PriceBid/UpdatePriceBidRemarksNQuantity',
  addPriceBidColumns: 'api/PriceBid/AddPriceBidColumns',
  getPriceBidColumns: 'api/PriceBid/GetPriceBidColumns',
  addPriceBidChargeNRemark: 'api/PriceBid/AddPriceBidChargeNRemark',
  GetVendorEventCurrency:'api/PriceBid/GetVendorEventCurrency',

  getAllINCOTerms: 'api/PriceBid/GetAllINCOTerms',
  getAllPaymentTerms: 'api/PriceBid/GetAllPaymentTerms',

  updatePriceBidColumns: 'api/PriceBid/UpdatePriceBidColumns',
  deletePriceBidColumns: 'api/PriceBid/DeletePriceBidColumns',
  updatePriceBidChargeNRemark: 'api/PriceBid/UpdatePriceBidChargeNRemark',
  deletePriceBidChargeNRemark: 'api/PriceBid/DeletePriceBidChargeNRemark',
  getAssignedPBBidChargesNRemarks:
    'api/PriceBid/GetAssignedPBBidChargesNRemarks',
  getAllManpowerItems: 'api/PriceBid/GetAllManpowerItems',
  addManpowerItems: 'api/PriceBid/AddManpowerItems',

  getAllSubItems: 'api/PriceBid/GetAllSubItems',
  getAllSubItemsForVendors: 'api/PriceBid/GetAllSubItemsForVendor',
  addSubItems: 'api/PriceBid/AddSubItems',
  updateSubItems: 'api/PriceBid/UpdateSubItems',
  deleteSubItems: 'api/PriceBid/DeleteSubItems',

  deleteRFQItems: 'api/PriceBid/DeleteRFQItems',
  vendorPriceBidOnLine: 'api/PriceBid/VendorPriceBidOnLine',
  getVendorPriceBidOnLine: 'api/PriceBid/GetVendorPriceBidOnLine',

  getVendorChargesNCRemarks: 'api/PriceBid/GetVendorChargesNCRemarks',
  saveChargesNRemarksByVendor: 'api/PriceBid/SaveChargesNRemarksByVendor',
  getTaxes: 'api/PriceBid/GetTaxes',
  submitPriceBid: 'api/PriceBid/SubmitPriceBid',
  getBidComparison: 'api/PriceBid/GetBidComparison',
  getHeaderBidComparision: 'api/PriceBid/GetHeaderBidComparison',
  getChargeDescription: "api/PriceBid/GetChargeDescription",
  setSubItemsForVendor: 'api/PriceBid/SetSubItemsForVendor',
  getPOHistory: "api/PriceBid/GetPOHistory",
  RejectLastBid: "api/PriceBid/RejectLastBid"
};

export const TermsAndConditionsApis: any = {
  saveTermsAndCondition: 'api/TermsAndConditions/SaveTermsAndCondition',
  editTermsAndCondition: 'api/TermsAndConditions/EditTermsAndCondition',
  deleteTermsAndCondition: 'api/TermsAndConditions/DeleteTermsAndCondition',
  getALLTermsAndCondition: 'api/TermsAndConditions/GetALLTermsAndCondition',
  getTermsAndConditionById: 'api/TermsAndConditions/GetTermsAndConditionById',
  getVendorDeviationList: 'api/TermsAndConditions/GetVendorDeviationList',
  acceptVendorDeviation: 'api/TermsAndConditions/AcceptVendorDeviation',
  deviateVendorDeviation: 'api/TermsAndConditions/DeviateVendorDeviation',
  updateVendorDeviation: 'api/TermsAndConditions/UpdateVendorDeviation',
};

export const TemplateApis: any = {
  saveTemplate: 'api/Template/SaveTemplate',
  getTemplatebyid: 'api/Template/GetTemplateById',
  getTemplatebytype: 'api/Template/GetTemplateByType',
};

export const RfqcsApis: any = {
  updateRfq: 'api/RFQCS/UpdateRFQ',
  scheduleEvent: 'api/RFQCS/ScheduleEvent',
  saveEventVendors: 'api/RFQCS/SaveEventVendors',
  uploadOtherDocument: 'api/RFQCS/UploadOtherDocument',
  submitOtherDocument: 'api/RFQCS/SubmitOtherDocument',
  getRankAndColorRangeForVendors: 'api/RFQCS/GetRankAndColorRangeForVendors',
  getVendorWiseEvents: 'api/RFQCS/GetVendorWiseEvents',
  deleteRfqAuction: 'api/RFQCS/DeleteRFQAuction',
  terminateRfqAuction: 'api/RFQCS/TerminateRFQAuction',
  updateEventTitle: 'api/RFQCS/UpdateEventTitle',
  getAllEventVendors: 'api/RFQCS/GetAllEventVendors',
  saveCurrencyAndTemplate: 'api/RFQCS/SaveCurrencyAndTemplate',
  getSuggestedVendors: 'api/RFQCS/GetSuggestedVendors',
  deleteEventVendor: 'api/RFQCS/DeleteEventVendor',
  getRfqForCopyEvent: 'api/RFQCS/GetRFQForCopyEvent',
  getReasonByType: 'api/RFQCS/GetReasonByType',
  terminateRFQAuction: 'api/RFQCS/TerminateRFQAuction',
  getInvitationTemplate: 'api/RFQCS/GetInvitationTemplate',
  copyEvent: 'api/RFQCS/CopyEvent',
  getEventsScheduleDetails: 'api/RFQCS/GetEventsScheduleDetails',
  regretParticipateRFQ: 'api/RFQCS/RegretParticipateRFQ',
  RFQNextRound: 'api/RFQCS/RFQNextRound',
  getAuctionDetails: 'api/RFQCS/GetAuctionDetails',
  getAuctionDetailsForVendors: 'api/RFQCS/GetAuctionDetailsForVendor',
  getTechnicalSpecification: 'api/RFQCS/GetTechnicalSpecification',
  getAuctionGraphDetails: "api/RFQCS/GetAuctionGraphDetails",
  TransferEventToOtherBuyer: "api/RFQCS/TransferEventToOtherBuyer",
  Shortcloseapi: "api/RFQCS/ShortCloseRFQ",
  getEventVendorsEmail: "api/RFQCS/GetEventVendorsEmail",
  saveEventVendorsEmail :"api/RFQCS/SaveEventVendorsEmail",

};

export const ReverseAuctionSettingApis :any={
  getReverseAuctionSetting:'api/ReverseAuction/GetRAAuctionSetings',
  saveReverseAuctionSettingApi:'api/ReverseAuction/SaveRAAuctionSettings',
  submitReverseAuction:'api/ReverseAuction/SubmitReverseAuction',
  getReverseAuctionViewerApi:'api/ReverseAuction/GetReverseAuctionViewers',
  saveReverseAuctionViewersApi:'api/ReverseAuction/SaveReverseAuctionViewers',
  getReverseAuctionSettingSubItem:'api/ReverseAuction/GetSubItemRASetings',
  saveReverseAuctionSettingSubItem:'api/ReverseAuction/SaveSubItemRASettings',
  getWfUserRole:'api/ReverseAuction/GetWFUserRoles',
  getTimeZoneList:'api/ReverseAuction/GetTimeZone',
  disqualifyVendorBid:'api/ReverseAuction/DisqualifyVendorBid',
  disqualificationDetailsHistory:'api/ReverseAuction/GetDisqualificationHistory',
  tranAuctionSettings:'api/ReverseAuction/GetRATranAuctionSettings',
  ReverseActionReport:'api/ReverseAuction/ReverseActionReport',
}

export const ViewerAndAdminstrator:any={
  getAllAdminstrator:'api/Buyer/GetAllBuyers',
  saveRAAdminstrator:'api/ReverseAuction/SaveRAAdmin'
}
export const ReverseAuctionApproverApis :any={
  getPendingRA:'api/ReverseAuction/GetPendingRAList',
  getApprovedRejectedRA:'api/ReverseAuction/GetApproveRejectRAList',
  saveApproveApi:'api/ReverseAuction/ApproveReverseAuction'
}

export const CollaborationApis: any = {
  GetAssignedCollaborativeUser:
    'api/Collaboration/GetAssignnedCollabrativeUser',
  getCollabrativeUser: 'api/Collaboration/GetCollabrativeUser',
  assignCollobrativeUser: 'api/Collaboration/AssignCollobrativeUser',
  updateAssignCollobrativeUser:
    'api/Collaboration/UpdateAssignCollobrativeUser',
  deleteCollobrativeUser: 'api/Collaboration/DeleteCollobrativeUser',
  ScoringByCollaborator: 'api/Collaboration/ScoringByCollaborator',
  uploadScoreDocument: 'api/Collaboration/UploadScoreDocument',
};

export const PublishEventApis: any = {
  publishEvent: 'api/RFQCS/PublishEvent',
  publishChecklist: 'api/RFQCS/PublishChecklist',
};

export const eventCommunicationApis: any = {
  getThreadByThreadId: 'api/EventThread/GetThreadByThreadId',
  getThreadsByEventId: 'api/EventThread/GetThreadsByEventId',
  getRepliesByThreadId: 'api/EventThread/GetRepliesByThreadId',
  replyInThread: 'api/EventThread/ReplyInThread',
  uploadFile: 'api/EventThread/UploadAttachment',
  getAllBroadcastTemplates: 'api/EventThread/GetAllBroadcastTemplates',
  getOldBroadcastMsg: 'api/EventThread/GetOldBroadcastMessages',
  markAsRead: 'api/EventThread/MarkAsRead',
  getUnreadMsgCountByUser: 'api/EventThread/GetUnreadMsgCountByUser',
};

export const CsComparision: any = {
  downloadComparisionSheet: 'api/CSComparison/DownloadComparisionSheet',
  DownloadTechnicalComparisionSheet:'api/CSComparison/DownloadTechnicalComparisionSheet',
  downloadapprovercssheet:'api/CSComparison/DownloadApproverCSSheet'
}

export const CsApprovalApis: any = {
  getVendorsForCSApproval: 'api/CSApproval/GetVendorsForCSApproval',
  GetEventDetailsForVendorCS: 'api/CSApproval/GetEventDetailsForVendorCS',
  viewcs: 'api/CSApproval/ViewCS',
  createCsApproval: 'api/CSApproval/CreateCSApproval',
  getCsStatusDetailApi: 'api/CSApproval/GetCSStatusDetails',
  myAwardCs: 'api/CSApproval/GetMyAwardCS',
  getApprovedRejectedCS: 'api/CSApproval/GetApprovedRejectedCS',
  getPendingCS: 'api/CSApproval/GetPendingCS',
  approveCSAppoval: 'api/CSApproval/ApproveCSAppoval',
  rejectCSAppoval: 'api/CSApproval/RejectCSAppoval',
  getCSLineDetailsofCSApproval: 'api/CSApproval/GetCSLineDetailsofCSApproval',
  createPo: 'api/CSApproval/CreatePO',
  getCSStatusList: "api/CSApproval/GetCSStatusList",
  getCSDetails: 'api/CSApproval/GetCSDetails',
  getCSReview: "api/CSApproval/GetCSReview",
  uploadCsApprovalDocument: "api/CSApproval/UploadCSDocuments",
  getVendorBidComparison: "api/PriceBid/GetVendorBidComparison",
  GetCSVendorSelectionReason: 'api/CSApproval/GetCSVendorSelectionReason',
  GetCsLine: 'api/CSApproval/GetCSLines',
  CreatePoFromLine: 'api/CSApproval/CreatePOFromLine',
  shortCloseCS: "api/CSApproval/ShortCloseCS",
  getcSDocumentUrl:'api/CSApproval/GetCSDocumentURL'

};
