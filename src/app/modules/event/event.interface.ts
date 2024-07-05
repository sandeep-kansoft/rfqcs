export interface IDefaultResponseDto<T> {
  data: T;
  success: boolean;
  error?: any;
  errorDetail?: any;
}

export interface IDefaultResponseDtoSecond<T>{
  Success: boolean
  Message: any
  Error: string
  ErrorDetail: string
  Data: any
}

export interface IRfqcsListDataDto {
  // evenT_ID: number;
  // evenT_NO: string;
  // evenT_NAME: string;
  // evenT_STATUS: string;
  // createD_DATE: string;
  // closinG_TIME: string;
  // projecT_NAME: string;
  // event_Type: string;
  // evenT_ROUND: number;
  // createD_BY: string;
  // pR_NO: string;
  // pR_VALUE: string;


  sNo: number;
  evenT_ID: number;
  evenT_NO: string;
  evenT_NAME: string;
  evenT_STATUS: string;
  createD_DATE: string;
  closinG_TIME: string;
  projecT_NAME: string;
  event_Type: string;
  evenT_ROUND: number;
  createD_BY: string;
  prid: string;
  pR_NO?: any;
  pR_VALUE: string;
  is_Delete: boolean;
  is_Terminate: boolean;
  bidStartTime: string;
  bidEndTime: string;
  technicalBidStart: string;
  technicalBidEnd: string;
  tncBidStart?: any;
  tncBidEnd?: any;
  threadId: string;

}


export interface IRfqcsListRequestDto {
  UserId: number;
  EVENTCODE: string;
  EVENTNAME: string;
  CURRENTSTATUS: string;
  ProjectName: string;
  EventType: string;
  UserName: string;
  PageIndex: number;
  PageSize: number;
}

export interface IGetAllVendors {
  vendorId: number;
  vendorCode: string;
  vendorName: string;
  totalVendor: number;
  isEMail: string;
  statusVendor: string;
  country: string;
  businessType?: any;
  categories?: any;
}

export interface IgetCSLineDetailsOfCSApproval {
  lineDetails: LineDetails[]
  otherChargesForCSLines: OtherChargesForCsline[]
}
export interface LineDetails {
  srNo: number
  eventTranId: number
  eventId: number
  primaryKeyItemId: number
  itemId: number
  productName: string
  vendorId: number
  unit: string
  awardTransUnitprice: number
  awardTransQuantity: number
  awardTransTotalPrice: number
  unitPrice: number
  totalPrice: number
  otherCharges: number
  event_Qty: number
  remainingQty: number
  isApproved: boolean
  isRejected: boolean
  isNotApproveNRejected: boolean
}
export interface OtherChargesForCsline {
  eventId: number
  chargesName: string
  chargesType: string
  vendorId: number
  amount: number
  totalCSPrice: number
  otherChargesPrice: number
  grandTotal: number
}

export interface IVendorListdataDto {
  vendorid: number;
  vendorcode: number;
  vendorname: string;
  statusvendor: string;
  participatestatus: string;
  tnc: string;
  technical: string;
  technicalApprove: string;
  isTechnicalApproved: number;
  technicalScore: number;
  scoreDocPath: null;
  Score: number;
  isLoading?: boolean;
  oldTechnicalScore?: number;
  oldTechnicalApprove?: string;
  fileDetail: FileDetail | null;
  isvendorEnabled?: boolean
}





export interface IRfqDetailDataDto {
  eventid: number;
  eventNo: string;
  eventTitle: string;
  eventDescription: string;
  eventType: string;
  round: number;
  eventRound: string;
  eventStatus: string;
  eventCurrency: string;
  bidClosing?: any;
  eventBudget: number;
  eventValue: number;
  vendors: number;
  eventLine: number;
  pr: number;
  saving: string;
  currencyId?: number;
  templateId?: number;

  bidStartTime: Date;
  bidEndTime: Date;
  technicalBidStart: Date;
  technicalBidEnd: Date;
  tncBidStart: Date;
  tncBidEnd: Date;
  scheduleReasonId: number;
  vendorStatus: string;
  notAwarded: number;
  bCastThreadId: string;
  unreadMsgCount: string;
}

export interface IRfqDataDtoById {
  data: IRfqDetailDataDto;
  success: boolean;
  error?: any;
  errorDetail?: any;
}
export interface IAllVendorsEmailList {
 email?:any
 isChecked?:boolean
}


export interface IAllVendorsList {
  sNo: number;
  vendorId: number;
  vendorCode: string;
  vendorName: string;
  totalVendor: number;
  isEMail: string;
  vendorEmail?: string;
  statusVendor: string;
  city?: string;
  country: string;
  businessType: any;
  categories: any;
  overAllRating: string;
  qualityRating: string;
  deliveryRating: string;
  primaryContactPerson: string;
  contactNo?: string;
  enabled?: boolean;
  isPriceBid: boolean;
  isTNC: boolean;
  isTechnical: boolean;
  threadId?: string;
  totalAmount: number;
  rank?: string
  participateStatus: string
  rankAmount?:number;
  invoiceMobile:string;
  invoiceEmail:any
  
}
export interface ISuggestedVendorList {
  sNo: number;
  vendorId: number;
  vendorCode: string;
  vendorName: string;
  totalVendor: number;
  isEMail: string;
  vendorEmail: string;
  statusVendor: string;
  city: string;
  country: string;
  businessType: string;
  categories: string;
  overAllRating: string;
  qualityRating: string;
  deliveryRating: string;
  primaryContactPerson: string;
  contactNo: string;
  isTechnical: boolean;
  isTNC: boolean;
  isPriceBid: boolean;
  enabled: boolean;
  invoiceMobile:string;
  invoiceEmail:any
}

export interface IAllVendorsResponse {
  data: IAllVendorsList[];
  success: boolean;
  error?: any;
  errorDetail?: any;
}
export interface IAllSuggestedVendor {
  data: ISuggestedVendorList[];
  success: boolean;
  error?: any;
  errorDetail?: any;
}

// Technical Attachment Dto

export interface IGetAllTechnicalAttachMentResponseDto {
  vendor: IVendor[];
  buyer: IBuyer;
}

export interface IBuyer {
  buyerName?: any;
  attachments: ITechnicalAttachmentResponseDto[];
}

export interface IVendor {
  vendorName: string;
  attachments: ITechnicalAttachmentResponseDto[];
  vendorId: number
}

export interface ITechnicalAttachmentResponseDto {
  attachmentId: number;
  eventId: number;
  attachmentPath: string;
  fileName: string;
  documentName: string;
  remarks: string;
  userId: number;
  userRole: string;
  attachmentURL: string;
  isSubmit: boolean;
  createdDate: Date;
  isDeleted: boolean;
  deletedBy?: number;
  deletedDate?: Date;
}

export interface IGetAllBuyerAttachmentResponseDto {
  attachmentId: number;
  eventId: number;
  attachmentPath: string;
  fileName: string;
  documentName: string;
  remarks: string;
  userId: number;
  userRole: string;
  attachmentURL: string;
  isSubmit: boolean;
  createdDate: Date;
  isDeleted: boolean;
  deletedBy?: number;
  deletedDate?: Date;
}

export interface ISaveTechnicalAttachmentRequestDto {
  parameterid: number;
  eventid: number;
  userid: number;
  createD_BY: string;
  createD_ON: string;
  technicalParams: ITechnicalParam[];
}

interface ITechnicalParam {
  parameter: string;
  isrequired: boolean;
}

export interface ISaveTechnicalAttachMentResponseDto {
  parameterid: number;
  eventid: number;
  userid: number;
  createD_BY?: string;
  createD_ON?: Date;
  technicalParams?: ITechnicalParam[];
}

/**<<<<--------------------------- Price bid data dto start------------------------------------>>>>>>>>>> */

//price bid result
export interface IPriceBidResultDataDto {
  data:
  | any
  | IPriceBidTemplatesListDataDto[]
  | IPriceBidLinesListDataDto[]
  | IPriceBidChargesListDataDto[]
  | IPriceOtherChargesListDataDto[]
  | IPriceBidColumnDataDto[]
  | IIncoTermsDataDto[]
  | IPaymentTermDataDto[]
  | IChargeNRemarkDataDto[]
  | IManPowerItemDataDto[]
  | ISubItemsDataDto[]
  | ISubItemsForVendorsDataDto[]
  | IPrAndLinesDetailDataDto[]
  | IItemAmountInfo
  | IPriceBidVendorDetailDataDto
  | ITaxesDataDto[]
  | ItemBidComparisonData;
  success: boolean;
  error: any;
  errorDetail: any;
}

export interface IGetRATranAuctionSettings{
  ceilingValue: number
  bidDecrement: number
  bidDecrementPercent: number
  thresholdBid: number
  isTieBreaker: string
  isDiscountCP: string
  isTaxCP: string
  isAutoExtended: string
  extensionDuration: number
  extensionBuffer: number
  extensionLimit: number
  bidConfig: string
  timeZone: string
}

export interface IPrAndLinesDetailDataDto {
  srNo: number;
  rnum: number;
  prid: number;
  prNum: string;
  prDescription: string;
  project_name: string;
  createdDate: string;
  totalPRLines: number;
  createdItems: number;
  remainingPRLines: number;
  requester: string;
  siteName: string;
  department: string;
  prLineItems: IPrLineItem[];
  lineCount: number;
}

export interface ICsGetCSVendorSelectionReason {
  reasonDetailId: number,
  detailValue: string
}

export interface IPrLineItem {
  srNo: number;
  prid: number;
  prtransid: number;
  itemcode: string;
  iteM_DESCRIPTION: string;
  uom: string;
  warehouse: string;
  projname: string;
  quantity: number;
  entqty: number;
  remqty: number;
  pR_LINE: number;
  requestor: string;
  isEnabled: boolean;
}

export interface ISubItemsDataDto {
  subId: number;
  eventId: number;
  eventTranId: number;
  itemCode: string;
  itemName: string;
  uom: string;
  quantity: number;
  rate: number;
  remarks: string;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface ISubItemsForVendorsDataDto {
  sNo: number,
  eventid: number,
  eventTranId: number,
  subId: number,
  itemCode: string,
  itemName: string,
  quantity: number,
  buyerRemark: string,
  uom: string,
  subVId: number,
  rate: number,
  vendorRemark: string,
  vendorId: number
}

export interface IChargeNRemarkDataDto {
  pbcR_Id: number;
  eventId: number;
  cR_Name: string;
  cR_Type: string;
  isEdit?: boolean;
  isDeleted?: boolean;
  isError?: boolean;
  remark?: string;
  valueType?: number;
  amount?: number;
  totalAmount?: number;
  iscustomEnabled?: boolean;
  custompaymentcheckbox?: boolean;
}

//Inco term data dto
export interface IIncoTermsDataDto {
  deliveryterM_ID: number;
  description: string;
}

//PaymentTerms Data dto
export interface IPaymentTermDataDto {
  paymentterM_ID: number;
  description: string;
}

//price bid templates
export interface IPriceBidTemplatesListDataDto {
  templateId: number;
  templateName: string;
  isActive: boolean;
}

//price bid lines
export interface IPriceBidLinesListDataDto {
  srNo: number;
  eventTranId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  uom: string;
  deliveryLocation: string;
  deliveryAddress: string;
  siteCode: string;
  remarks: string;
  isEditedMode?: boolean;
  isEditedModeQty?: boolean;
  old_qty: number;
  old_remarks: string;
  itemMasterId: number;
  isManpower?: boolean;
  prtransid?: number;
  prtrnid?: number;
  itemDesc?: string;
  unitPrice: number;
  discountPer: number;
  totalDiscount: number;
  netAmount: number;
  taxAmount?: number;
  bidStatus: number;
  totalTax: number;
  currentBid: number;
  shortCloseQty: number
}



//price bid charges
export interface IPriceBidChargesListDataDto {
  charges_ID: number;
  markupCode: string;
  transTxt: string;
}
export interface IRankAndColor {
  colorRange: string
  eventId: number
  totalAmount: number
  vendorId: number
  vendorRank: string
}
//Price other charges
export interface IPriceOtherChargesListDataDto {
  charges_ID: number;
  markupCode: string;
}

//Price bid column
export interface IPriceBidColumnDataDto {
  pB_HeaderID: number;
  eventId: number;
  eventTranID?: number;
  headerName: string;
  headerType: string;
  isCustom?: boolean;
  isDeleted?: boolean;
  isError?: boolean;
  isEdit?: boolean;

  chargeType?: number;
  discountValue?: number;
  chargeValue?: number;
}

//
export interface IItemAmountInfo {
  vTranID: number;
  eventId: number;
  eventTranId: number;
  bidStatus: number;
  quantity: number;
  unitPrice: number;
  discountPer: number;
  discount: number;
  gsT_VAT: number;
  taxCode: string;
  taxType: string;
  amount?: number;
  totalAmount: number;
  totalDiscount: number;
  assessibleAmount: number;
  totalTax: number;
  netAmount: number;
  grossAmount: number;
  pBLines?: IPriceBidColumnVendorDataDto[];
}

//vendor price bid column dto
export interface IPriceBidColumnVendorDataDto {
  pB_BidID: number;
  eventTranID: number;
  pB_HeaderID: number;
  pB_HeaderId: number;
  headerName?: string;
  headerType: string;
  valuebyVendor: string;
  isAssesible: boolean;
  valueType: number;
  amount: number | '';
  totalAmount: number | '';
  isIncluded?: boolean;
  isError?: boolean
}

//man power item data dto
export interface IManPowerItemDataDto {
  itemMasterID: number;
  productNumber: number;
  productName: string;
  unit: string;
  unitPrice: string;
  hsnCode: string;
  serviceAccCode: string;
  quantity?: number;
  isEnabled?: boolean;
}

export interface IGrossAmountInfo {
  grossAmount: number;
  assessableValue: number;
  gstAmount: number;
  cstVatAmount: number;
  netAmount: number;
  otherCharge: number;
  incoTerm: number;
  totalAmount: number;
}

export interface IPriceBidVendorDetailDataDto {
  eventId: number;
  netAmount: number;
  otherCharges: number;
  totalTaxAmount: number;
  totalAmount: number;
  pBLines: IOtherChargeNRemarkVendorDataDto[];
}

export interface IOtherChargeNRemarkVendorDataDto {
  pbcrV_Id: number;
  pbcR_Id: number;
  cR_Type: string;
  cR_Name: string;
  cR_Value: any;
  valueType: number;
  amount: number | '';
  totalAmount: number | '';
  isEdit?: boolean;
}

export interface ITaxesDataDto {
  code: string;
  tax: number;
  cgst: number;
  sgst: number;
  igst: number;
  isEnabled?: boolean;
}

export interface ItemBidComparisonData {
  itemBidComparisons: ItemBidComparison[];
}

export interface ItemBidComparison {
  eventId: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  uom: string;
  isShow?: boolean;
  // subItemList: any;
  vendorBidComparisons: VendorBidComparison[];
  subItemBidComparisons?: VendorBidComparison[];
  spanParams: any;
  comparisonParamList: any;
  subItemParamList: any;
  lastPoPrice: number;
  lastPrPrice: number;
  isManPowerProduct: boolean;
  subItemList: any[]
  eventTranId: number
  subItems: ISubItemDto[];
  // vendorSubItems: VendorBidComparison[]


}


interface ISubItemDto {
  itemCode: string;
  itemName: string;
  quantity: number;
  uom: string;
  buyerRemark?: any;
  vendorSubItems: IVendorSubItem[];
}

interface IVendorSubItem {
  vendorId: number;
  vendorName: string;
  vendorValues: ComparisonVendorParam[];
}


export interface VendorBidComparison {
  vendorId: number;
  vendorName: string;
  bidRounds: BidRound[];
}

export interface BidRound {
  eventId: number;
  eventRoundNumber: number;
  roundName: string;
  isRegret: boolean;
  isIncluded: boolean;
  tech_Remark: string;
  comparisonVendorParams: any;
}

/**<<<<--------------------------- Price bid data dto end------------------------------------>>>>>>>>>> */

/**<<<<--------------------------- Terms and condition data dto start------------------------------------>>>>>>>>>> */

export interface ITermAndConditionResultDataDto {
  data:
  | any
  | ITermAndConditionsListDataDto[]
  | IVendorDeviationDataDto[]
  | IVendorDeviationDataDto;
  success: boolean;
  error: any;
  errorDetail: any;
}
export interface IGetRfqForCopyEvent {
  eventId: number;
  eventNo: number;
  eventName: string;
  eventType: number;
  eventTypeName: string;
  eventStatusId: number;
  eventStatus: string;
  cretaedDate: Date;
  bidClosingDate: Date;
  totalRows: number;
  isEnabled?: boolean;
}
export interface IGetAssignnedCollabrativeUserDataDta {
  srno?: number;
  usertype?: string;
  technicalid?: number;
  username?: string;
  assignid?: number;
  eventid?: number;
  iS_SCORE_ASSIGN?: boolean;
  iS_COMMERCIAL_ACCESS?: boolean;
  iS_TECHNICAL_ACCESS?: boolean;
  iS_TECHNICAL_APPROVE?: boolean;
  isDeleted?: boolean;
  isEdited?: boolean;
}

export interface ITermAndConditionsListDataDto {
  tncid: number;
  eventid: number;
  userid: number;
  terms: string;
  createddate: string;
  modifieddate: string;
  isrequired: boolean;
  isdeleted: boolean;
}

export interface IVendorDeviationDataDto {
  tncid: number;
  eventid: number;
  userid: number;
  vendorid: number;
  terms: string;
  deviation: string;
  isrequired: boolean;
  isdeleted: boolean;
  deviatioN_MSTID: number;
  isDeviated: boolean;
  isUpdated: boolean;
  isAccepted: boolean;
  createddate: string;
  checkDuplicate: number;
}

export interface ISaveTemplateResponseDto {
  templateType: string;
  templateName: string;
  templateValue: string;
  createdDate: Date;
  createdBy: string;
  modifiedBy: string;
  modifiedDate: Date;
}
export interface IGetTemplateByIdResponseDto {
  templateType: string;
  templateName: string;
  templateValue: string;
  createdDate: Date;
  createdBy: string;
  modifiedBy: string;
  modifiedDate: Date;
}
export interface IGetTemplateByTypeResponseDto {
  // templateType: string,
  // templateName: string,
  // templateValue: string,
  // createdDate: Date,
  // createdBy: string,
  // modifiedBy: string,
  // modifiedDate: Date
  templateID: number;
  templateType: string;
  templateName: string;
  templateValue: string;
  createdDate: string;
  createdBy: number;
  modifiedBy: number;
  modifiedDate: string;
  isChecked?: boolean
}

/**<<<<--------------------------- RFQCS dto start------------------------------------>>>>>>>>>> */

export interface IRfqcsResultDataDto {
  data: IReasonDataDto[];
  success: boolean;
  error: any;
  errorDetail: any;
}
export interface IgetWfUserRole{
  eventId: number
  userRole: string
  userId: number
}
export interface IUpdateRfqResponseDto {
  eventid: number;
  prDto: [
    {
      pR_ID: number;
      pR_TranId: number;
      qty: number;
      line: number;
    }
  ];
}

export interface IGetAllEventVendor {
  sNo: number;
  vendorId: number;
  vendorCode: string;
  vendorName: string;
  city: string;
  country: string;
  status: string;
  vendorEmail: string;
  primaryContact: string;
  contactNo: string;
  vendorRating: string;
  isEMail: string;
  rank?: String;
  totalAmount: number;
  secretKey?: string;
  emailList?: string[]
  vendorEmailUpdated?: string;
  updatedEmailToolTip?: string;
  rankAmount?:number;
}

export interface IReverseAuctionList{
  eventId: number
  auctionDate:Date
  isTieBreaker: boolean
  isDiscountCP: boolean
  bidDecrement:number
  bidDecrementPreviousValueGlobal:number;
  bidDecrementPercent:number;
  bidDecrementpreviousPercentGlobal:number;
  isTaxCP: boolean
  isAutoExtended: boolean
  extensionDuration: number
  extensionBuffer: number
  extensionLimit: number
  bidConfig: any
  auctionDuration: number
  timeZone:number
  templateId:number
  isParentRFQ:string
  lines: [
    {
    eventId: number
    bidDecrementPercent:number
    bidDecrementpreviousPercent:number
    eventTranId: number
    itemCode: string
    itemDesc: string
    uom: string
    ceilingValue: number
    bidDecrement: number
    thresholdBid: number
    bidDecrementpreviousValue:number
    thresholdBidPreviousValue:number
  }
  ]
}

export interface ITimeZoneList{
  data: [{
    timeZoneId: number
    timeZoneName: string
  }]
  success: boolean
  error: any
  errorDetail: any
}

export interface IReverseAuctionSubItemList{
  eventTranId: number
  ceilingValue: number
  bidDecrement: number
  bidDecrementPercent: number
  bidConfig: string
  lines:[
    {
      eventTranId: number
      subId: number
      itemCode: string
      itemName: string
      quantity: number
      uom: string
      ceilingValue: number
      bidDecrement: number
      bidDecrementPercent: number
      bidDecrementPreviousPercent:number;
      bidDecrementpreviousValue:number
    }
  ]
}
export interface IReverseAuctionViewerList{
  userId: string,
  userName: string,
  isSelected: boolean
}
export interface ISaveReverseAuctionSettingsApi{
  eventId: number
  isTieBreaker: boolean
  isDiscountCP: boolean
  isTaxCP: boolean
  isAutoExtended: boolean
  extensionDuration: number
  extensionBuffer: number
  extensionLimit: number
  bidConfig: string
  auctionDuration: number
  timeZone: string
  bidDecrement: number
  bidDecrementPercent: number
  lines: [
    {
      eventId: number
  eventTranId: number
  itemCode: string
  itemDesc: string
  uom: string
  ceilingValue: number
  bidDecrement: number
  bidDecrementPercent: number
  thresholdBid: number
    }
  ]
}

export interface ISaveSubItemsRASettingsApi{
  eventTranId: number
  ceilingValue: number
  bidDecrement: number
  bidDecrementPercent: number
  bidConfig: string
  lines: [
    {
      eventTranId: number
      subId: number
      itemCode: string
      itemName: string
      quantity: number
      uom: string
      ceilingValue: number
      bidDecrement: number
      bidDecrementPercent: number
    }
  ]
}
export interface IdeleteRfqAuction { }

export interface IgetAuctionDetailsDataDto {
  eventId: number;
  eventTranId: number;
  itemCode: any;
  itemDesc: any;
  quantity: number;
  currencY_CODE: string;
  vendorcode: string;
  vendorname: string;
  currentBid: number;
  convertedAmt: number;
  startingBid: number;
  vendorid: number;
  rank?: string;
}

export interface IgetAuctionDetailsForVendorsDataDto {
  eventId: number
  eventTranId: number
  itemCode: string
  itemDesc: string
  quantity: number
  currencY_CODE: string
  vendorcode: string
  vendorname: string
  currentBid: number
  convertedAmt: number
  startingBid: number
  vendorid: number
}

export interface IScheduleEventResponseDto {
  eventId: number;
  scheduleStart: Date;
  scheduleEnd: Date;
  technicalBidStart: Date;
  technicalBidEnd: Date;
  tncBidStart: Date;
  tncBidEnd: Date;
}

export interface ISaveEventVendorsResponseDto {
  eventId: number;
  vendorIds: [
    {
      id: number;
    }
  ];
}
export interface IUploadOtherDocumentResponseDto {
  documentId: number;
  eventId: number;
  attachmentPath: string;
  fileName: string;
  documentName: string;
  remarks: string;
  userId: number;
  userRole: string;
  attachmentURL: string;
  isSubmit: boolean;
}
export interface IGetAllBuyer {
  data: getBuyer[]
  success: boolean
  error: any
  errorDetail: any
}
export interface getBuyer {
  personId: number;
  name: string;
  isEnabled: boolean;
  totalRows: number
}
export interface IGetAllAdminstrator {
  data: getAdminstrator[]
  success: boolean
  error: any
  errorDetail: any
}
export interface getAdminstrator {
  personId: number;
  name: string;
  isAdmin: boolean;
  totalRows: number
}

export interface ISubmitOtherDocumentResponseDto {
  documentId: number;
  eventId: number;
  attachmentPath: string;
  fileName: string;
  documentName: string;
  remarks: string;
  userId: number;
  userRole: string;
  attachmentURL: string;
  isSubmit: boolean;
}
export interface IviewCsResponseDto {
  vendorid: number;
  vendorcode: number;
  vendorname: string;
  statusvendor: string;
  participatestatus: string;
  tnc: string;
  technical: string;
  technicalApprove: string;
  isTechnicalApproved: number;
  technicalScore: number;
  scoreDocPath: null;
  Score: number;
  isLoading?: boolean;
  oldTechnicalScore?: number;
  oldTechnicalApprove?: string;
  fileDetail: FileDetail | null;
}

export interface FileDetail {
  url: string;
  fileObj: any;
}

export interface IGetVendorWiseEventsResponseDto {
  eventid: number;
  eventNo: number;
  vendorid: number;
  eventName: string;
  eventtype: string;
  buyerName: string;
  round: number;
  currentstatus: string;
  bidClosingDate: Date;
  vendorName: string;
  remDays: number;
  isParticipate: number;
  isRegret: number;
  eventStatus?: string;
  EventType?: string;
  isLoading?: boolean;
  sendTo:number;
}

export interface ITechnicalParamterItemDto {
  sNo: number;
  eventId: number;
  eventTranId: number;
  prid: number;
  prtrnid: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  oty: number;
  tech_Remark?: string;
  isEditedMode?: boolean;
  old_remarks?: string;
}

export interface TechnicalParametersItems {
  parameterid: number;
  eventid: number;
  userid: number;
  parameter: string;
  isrequired: boolean;
  createD_BY: number;
  createD_DATE: string;
  isEdited: false;
  remarks?: '';
}

export interface CollabrativeUserResponseDto {
  useR_ID: string;
  persoN_ID: number;
  usertype: string;
  fulL_NAME: string;
  nameAndCode: string;
}
export interface TabDataDto {
  tabName: string;
  tabType: string;
  isVisible: boolean;
  icon: string;
  isChecked: boolean;
  isDisabled: boolean
}

export interface PublishChecklistResponseDto {
  eventId: number;
  technical: string;
  tnc: string;
  priceBid: string;
  vendors: string;
  scheduled: string;
  collaborator: string;
  buyerDocs: string;
  vendorTNC: string;
  vendorTechnical: string;
  vendorPriceBid: string;
  isRASetting:string;
  isAdminSet:string;
}


export interface IReasonDataDto {
  reasonId: number | string;
  reasonName: string;
  reasonDescription: string;
  reasonType: string;
}

export interface IInvitationTemplate {
  eventId: number;
  templateName: string;
  mailSubject: string;
  mailBody: string;
}
export interface ITechnicalTermForVendor {
  sNo: number;
  eventId: number;
  eventTranId: number;
  prid: number;
  itemCode: string;
  itemName: string;
  parameter: string;
  parameterid: number;
  isrequired: boolean;
  vendor_Remark?: string;
  old_remark?: string;
  vendorInitialRemark?: string;
  isEdited?: boolean;
  isEditMode?: boolean;
  isNew?: boolean;
  vendorParameterId: number;
  v_ParameterID:number;
}

export interface ITNCVendorDeviationdDto {
  tncid: number;
  eventid: number;
  userid: number;
  vendorid: number;
  terms: string;
  deviation: string;
  deviatioN_MSTID: number;
  isaccepted: boolean;
  isdeviated: boolean;
  vendorname: string;
}

export enum EventDashboardEnums {
  SUMMARY = 'SUMMARY',
  TECHNICAL = 'TECHNICAL',
  TERM_CONDITION = 'TERM_CONDITION',
  PRICE_BID = 'PRICE_BID',
  Reverse_Auction_Settings='Reverse_Auction_Settings',
  Viewers_And_Administrator='Viewers_And_Administrator',
  BUYER_DOCUMENTS = 'BUYER_DOCUMENTS',
  VIEW_CS = 'VIEW_CS',
  VENDORS = 'VENDORS',
  COLLABORATION = 'COLLABORATION',
  SCHEDULE = 'SCHEDULE',
  PUBLISH = 'PUBLISH',
  CS_APPROVAL = 'CS-APPROVAL',
  VENDOR_ANALYSIS = 'VENDOR_ANALYSIS',
  VIEW_AUCTION = 'VIEW_AUCTION',
  GOTO_AUCTION = 'GOTO_AUCTION',
  VENDOR_PDF = 'VENDOR_PDF',
}

// ---------------------- Cs Approval ----------------------------------

export interface IVendorList {
  eventId: number;
  vendorId: number;
  vendorCode: string;
  vendorName: string;
  grossAmount: string;
  vendorRank:string
}

export interface ICsStatusList {
  cS_No: number;
  eventId: number;
  eventNo: string;
  eventName: string;
  vendorId: number;
  vendorcode: string;
  vendorname: string;
  csSubmitionDate: Date;
  eventDate: Date;
  totalValue: number;
  csStatus: string;
  projecT_NAME: string;
  siteName: string;
  departmentName: string;
  csCreatedBy: number;
  buyerName: string;
  prid: number;
  pR_NUM: string;
  buyer_Remarks: string;
  docFileName: string;
  docPath: string;
}




export interface IMyAwardCs {
  awardNo:number;
  cS_No: number;
  eventId: number;
  eventNo: string;
  eventName: string;
  vendorId: number;
  vendorcode: string;
  vendorname: string;
  csSubmitionDate: Date;
  eventDate: Date;
  totalValue: number;
  csStatus: string;
  projecT_NAME: string;
  siteName: string;
  departmentName: string;
  csCreatedBy: number;
  buyerName: string;
  prid: number;
  pR_NUM: string;
  buyer_Remarks: string;
  docFileName: string;
  docPath: string;
}

export interface IVendorDetail {
  lineDetails: LineDetail[];
  otheChargesDetails: OtheChargesDetail[];
}
export interface LineDetail {
  eventTranId: number;
  eventId: number;
  itemId: number;
  vendorId: number;
  itemCode: string;
  itemDesc: string;
  uom: string;
  unitPrice: number;
  totalPrice: number;
  otherCharges: number;
  event_Qty: number;
  remainingQty: number;
  qty: number;
  isEnabled?: boolean;
  enterdQty?: number | '';
  enterdNetAmount?: number | '';
  remQty?: any;
  totalDiscount?: number,
  totalTax: number,
  unittaxupdated?: number,
  basePrice? : number,
  lineCharges:linecharges[]
}
export interface linecharges{
  pB_BidID: number
  eventTranID: number
  pB_HeaderId: number
  headerType: string
  valuebyVendor: string
  isAssesible: boolean
  valueType: number
  amount: number
  totalAmount: number
  headerName: string
}
export interface OtheChargesDetail {
  eventId: number;
  chargesName: string;
  chargesType: string;
  amount: number;
}

export interface IScheduleResponseDto {
  eventId: number;
  scheduleStart: string;
  scheduleEnd: string;
  technicalBidStart?: any;
  technicalBidEnd?: any;
  tncBidStart?: any;
  tncBidEnd?: any;
  changeReasonId?: any;
  timeZoneShortName:string
}
// ----------------------- Cs Approval End ----------------------------------

export interface ThreadUserDto {
  threadId: string;
  eventId: number;
  threadTitle: string;
  vendorName: string;
  vendorId: number;
  collaboratorId: number;
  userId: number;
  userRole: string;
  vendorEmail: string;
  buyerEmail: string;
  lastReplyDate: Date;
  shortName: string;
  isClosed: boolean;
  threadFor: string;
  isOnline:boolean;
  userName:string;
}

export interface ThreadReplyDto {
  messageId?: string;
  threadId?: string;
  eventId?: number;
  messageType: string;
  text?: string;
  fileName?: string;
  emailFrom?: string;
  emailTo?: string;
  emailCC?: string;
  emailBCC?: string;
  emailSubject?: string;
  emailBody?: string;
  userId?: number;
  userRole?: string;
  shortName?: string;
  userName?: string;
  replyDateTime?: any;
  fileURL?: string;
  isMailSent?: boolean;
  mailAttachmentList?: string[];
  closeThread?: boolean;
  threadFor?: string;
  openThread?: boolean;
  connectionId?: string;
  sendTo?:string;
  eventTitle?:string;
  fromFullName?:string;
}

export interface BroadcastTemplatDto{
  templateId:number;
  templateName?:string;
  templateText?:string
}

export interface IheaderBidComparision {

  pricingAndTerms: ChargesAndTerms;
  isShow?: boolean;
  commercialTNC: ChargesAndTerms;

  otherCharges: ChargesAndTerms

}

export interface IroundlistDto {
  sNo: number
  evenT_ID: number
  evenT_NO: string
  evenT_NAME: string
  evenT_STATUS: string
  createD_DATE: string
  closinG_TIME: string
  projecT_NAME: string
  event_Type: string
  evenT_ROUND: number
  createD_BY: string
  prid: string
  isroundenabled?: boolean
}




interface ChargesAndTerms {

  eventId: number;
  isShow?: boolean;
  vendorBidComparisons: IVendorBidComparison[];

  comparisonParamList: ComparisonVendorParam[];

}




export interface IVendorBidComparison {

  vendorId: number;

  vendorName: string;
  isShow?: boolean;
  bidRounds: IBidRound[];

}




interface IBidRound {

  eventId: number;

  eventRoundNumber: number;

  roundName: string;

  comparisonVendorParams: ComparisonVendorParam[];

}




export interface ComparisonVendorParam {

  key: string;
  isShow?: boolean;
  value: string;

}


export interface ICsStatusListDto {
  cS_No: number;
  eventId: number;
  eventNo: string;
  eventName: string;
  vendorId: number;
  vendorcode: string;
  vendorname: string;
  csSubmitionDate: string;
  eventDate: string;
  totalValue: number;
  csStatus: string;
  projecT_NAME: string;
  siteName: string;
  departmentName: string;
  csCreatedBy: number;
  buyerName: string;
  prid: number;
  pR_NUM: string;
  buyer_Remarks: string;
  docFileName: string;
  docPath: string;
  is_POCreation: boolean;
}



export interface ICsDetailDto {
  lineDetails: LineILineDetailResponseDto[];
  otherChargesForCSLines: IotherChargesForCSLinesDto[];
}
export interface getCsLinesDto {
  // awardTranId: number,
  //     itemCode: string,
  //     itemName: string,
  //     itemDesc: string,
  //     quantity: number,
  //     uom: string,
  //     unitPrice: number,
  //     unitLineCharges: number,
  //     headerCharges: number,
  //     netAmount: number,
  //     isCreatePO: true
  awardTranId: number;
  itemCode: string;
  itemName: string;
  itemDesc: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  unitLineCharges: number;
  headerCharges: number;
  netAmount: number;
  isCreatePO: boolean;
  isShortclose: boolean;
  shortCloseQty: number;
}
export interface getDisqualificationDataDto{
  data: getDisqualificationDetailsDto[]
  success: boolean
  error: string
  errorDetail: string
}

export interface getDisqualificationDetailsDto{
  eventId: number
  vendorId: number
  disqualifiedReason: string
  userName: string
  round: number
  bidDisqualifyDateTime: string
}

export interface LineILineDetailResponseDto {
  srNo: number;
  eventTranId: number;
  eventId: number;
  primaryKeyItemId: number;
  itemId: number;
  productName: string;
  vendorId: number;
  unit: string;
  awardTransUnitprice: number;
  awardTransQuantity: number;
  awardTransTotalPrice: number;
  unitPrice: number;
  totalPrice: number;
  otherCharges: number;
  event_Qty: number;
  remainingQty: number;
  isApproved: boolean;
  isRejected: boolean;
  isNotApproveNRejected: boolean;
  totalDiscount: number;
  totalTax: number;
}


export interface IotherChargesForCSLinesDto {
  eventId: number;
  chargesName: string;
  chargesType: string;
  vendorId: number;
  amount: number;
  chargePercent: number;
  totalCSPrice: number;
  subTotal: number;
  grandTotal: number;
}


export interface IGetCSReviewDto {
  awardId: number;
  awardNo : number;
  site: string;
  department: string;
  grandTotal: number;
  level: number;
  assignDate: string;
  approvedBy: string;
  responseUser: string;
  responseStatus: string;
  responseDate: string;
  responseRemark: string;
  workFlowNo: string;
  approvers: string;
  vendor:string;
}

export interface IVendorBidDto {
  vendorDetail: VendorDetail[];
  comparisonParamList: ComparisonVendorParam[];
}

export interface VendorDetail {
  eventId: number;
  vendorId: number;
  vendorName: string;
  vendorCode: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorCity: string;
  vendorBidRound: VendorBidRound[];
}

export interface VendorBidRound {
  eventRoundNumber: number;
  roundName: string;
  comparisonVendorParams: ComparisonVendorParam[];
}

export interface INextRoundRfqTypePayload {
  eventtype: string,
  eventColorCode: string
}


export interface AuctionGraphDetails {
  eventId: number;
  eventTranId: number;
  itemCode: string;
  itemDesc: string;
  uom: string;
  quantity: number;
  currencY_CODE: string;
  vendorcode: string;
  vendorname: string;
  currentBid: number;
  convertedAmt: number;
  startingBid: number;
  bidDate: string;
  vendorid: number;
  timeZoneShortName:string
}


export interface IPoHistoryDto {
  vendorcode: string;
  vendorname: string;
  pono: string;
  poId: number;
  itemcode: string;
  itemdescription: string;
  uom: string;
  poqty: number;
  podate: Date;
  porate: number;
  discPercent: number;
  unitprice: number;
}

export interface ReadMessageDto{
  EventId?:number;
  ThreadId?:string;
  ThreadFor?:string;
  UserId?:number;
  UserRole?:string;
}