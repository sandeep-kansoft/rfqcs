export interface PurchaseRequest {}

export interface PrResponseDto {
  prid: number;
  pR_NUM: string;
  prNum?:string;
  prepareR_ID: number;
  description: string;
  enterby: string;
  enterdate: Date;
  approvedDate: Date;
  siteId: number;
  siteName: string | undefined;
  projecT_NAME: any;
  departmentCode: any;
  departmentName: string;
  prtype: string;
  prSubType: string;
  preparer: string;
  totalValue: number;
  assignBuyer: string;
  pR_STATUS: string;
  buyerstatus: string;
  isEventCreation: boolean;
  totalcount:number;
  remQty:  number
}

export interface PrLineResponseDto {
  prtransid: number;
  prid: number;
  pR_NUM: string | undefined;
  itemcode: string;
  iteM_DESCRIPTION: string;
  uom: string;
  quantity: number;
  inProcessQUANTITY: number;
  usedQty: number;
  remQty: number;
  rate: number;
  netAmount: number;
  buyerstatus: string;
  rfqStatus: string;
  rfqno: string;
  poNo: string;
  poid: number;
  stateName: string;
  buyerid: number;
  siteID: number;
  isEventCreation : boolean
}

export interface PrHistoryResponseDto {
  round: string;
  pR_No: string;
  pR_Description: string;
  wF_No: string;
  level: string;
  approval?: any;
  required_By?: any;
  assigned_Date: string;
  action_Taken_By: string;
  action_Taken_Date: string;
  status: string;
  remarks: string;
  iteM_CODE?: any;
  product_Name?: any;
  quantity?: any;
  uniT_PRICE?: any;
  amount?: any;
}

export interface PrLineHistoryResponseDto {
  round: string;
  pR_No?: any;
  pR_Description?: any;
  wF_No?: any;
  level: string;
  approval?: any;
  required_By?: any;
  assigned_Date: string;
  action_Taken_By: string;
  action_Taken_Date: string;
  status: string;
  remarks: string;
  iteM_CODE: string;
  product_Name: string;
  quantity: string;
  uniT_PRICE: string;
  amount: string;
}

export interface PrLineHeaderDetail {
  pR_Lines: any[];
  prepareR_ID: number;
  prid: number;
  pR_NUM: string;
  siteId: number;
  siteName: string | undefined | null;
  prtype: string;
  prSubType: string;
  creatioN_DATE: string;
  projecT_NAME?: any;
  description: string;
  tefrId?: any;
  bjReason?: any;
  bjDetails: string;
  woNumber?: any;
  totalValue: number;
  requester:string;
  preparer: string;
  departmentCode?: any;
  departmentName: string;
  warehouse?: any;
  enterby: string;
  assignBuyer: string;
  pR_STATUS: string;
  enterDate: string;
  attachment?: any;
  mConsumptionDate: string;
  doc: FIleInfoDoc[];
}

interface FIleInfoDoc {
  prattachmentid: number;
  prid: number;
  uploadpath: string;
  filename: string;
  uploadedbyid: number;
  prType: string;
  itemCode: string;
  prtransid: number;
  remarks: string;
}

export interface PrLinesDetailResponseDto {
  // prtransid: number;
  // prid: number;
  // pR_NUM: string;
  // itemcode: string | undefined;
  // iteM_DESCRIPTION: string;
  // itemname: string;
  // status: string;
  // address: string;
  // requestDate?: any;
  // tefrId?: any;
  // quantity: number;
  // inProcessQUANTITY: number;
  // usedQty: number;
  // remQty: number;
  // uom: string;
  // rate: number;
  // netAmount: number;
  // currency: string;
  // consumptionDate: string;
  // deliveryName: string;
  // deliveryAddress: string;
  // attentionInformation: string;
  // projecT_ID: number;
  // projecT_NAME?: any;
  // busiUnit: string;
  // costCenterValue: string;
  // invWarehouse: string;
  // createdDate: string;
  // costElementValue: string;
  // department: string;
  // inventorySite: string;
  // bjReason?: any;
  // bjDetails: string;
  // configCode: string;
  // warehouseCode?: any;
  // poNo: string;
  // poid: number;
  // rfqno?: any;
  // buyerid: number;
  // rfqStatus?: any;
  // siteID: number;
  // buyerstatus?: any;
  // stateName: string;
  // assignBuyer?: any;
  prtransid: number;
  prid: number;
  pR_NUM: string;
  itemcode: string;
  iteM_DESCRIPTION: string;
  itemname: string;
  status: string;
  address: string;
  requestDate?: any;
  tefrId?: any;
  quantity: number;
  inProcessQUANTITY: number;
  usedQty: number;
  remQty: number;
  uom: string;
  rate: number;
  netAmount: number;
  currency: string;
  consumptionDate: string;
  deliveryName: string;
  deliveryAddress: string;
  attentionInformation?: any;
  projecT_ID: number;
  projecT_NAME?: any;
  busiUnit: string;
  costCenterValue: string;
  invWarehouse: string;
  createdDate: string;
  costElementValue: string;
  department: string;
  inventorySite: string;
  bjReason?: any;
  bjDetails: string;
  configCode: string;
  warehouseCode: string;
  poNo: string;
  poid: number;
  rfqno?: any;
  buyerid: number;
  rfqStatus?: any;
  siteID: number;
  buyerstatus?: any;
  stateName: string;
  assignBuyer?: any;
  pendingPO: number;
  inProcessPR: number;
  availableStock: number;
  stockInOtherWarehouse: number;
  noofManpower: number;
  uniT_PRICE: number;
  lastPurchasePrice: number;
  remark: string;
  procumentCategory: string;
  ledgerAccountName: string;
  businessUnit: number;
  costCenter: string;
  gla: string;
  doc: FIleInfoDoc[];
}

export interface AllResponseDto {
  prid: number;
  pR_NUM: string;
  prepareR_ID: number;
  description: string;
  enterby: string;
  enterdate: string;
  approvedDate?: any;
  siteId: number;
  siteName: string | undefined;
  projecT_NAME?: any;
  departmentCode?: any;
  departmentName: string;
  prtype: string;
  prSubType: string;
  preparer: string;
  totalValue: number;
  assignBuyer?: any;
  pR_STATUS: string;
  buyerstatus: string;
  totalcount: number;
}

export interface PPOPendingOrderDto {
  // ppoId: number;
  // ppoNo: string;
  // itemId: number;
  // itemNumber: string;
  // productName: string;
  // searchName: string;
  // config: string;
  // reqQuantity: number;
  // ppoDate: string;
  // uom: string;
  // siteId: number;
  // site: string;
  // warehouseId: number;
  // warehouse: string;
  // location: string;
  // buyerGroup: string;
  // itemGroup?: any;
  // totalcount: number;
  // prQty: number;
  // poQty: number;
  // inProcessQty: number;
  // netOrderQty: number;
  // orderQty: number;
  // remaingQty: number;
  // orderDoneBy: string;
  // orderStatus?: any;
  // remarks?: any;
  // lastPurchasePrice: number;
  // ppoAmount: number;
  // minOrderQty: number;
  // maxOrderQty: number;
  // onHandQtyinMain: number;
  // onHandQtyinOther: number;
  // poInProcess: number;
  // prInReview: number;
  // totalConsumption365Days: number;
  isEnabled? : boolean,
  ppoId: number;
  ppoNo: string;
  lastPPONo?: any;
  itemId: number;
  itemCode: string;
  itemDescription: string;
  searchName: string;
  config: string;
  reqQuantity: number;
  ppoDate: string;
  lastPODate: string;
  uom: string;
  siteId: number;
  site: string;
  warehouseId: number;
  warehouse: string;
  location: string;
  buyerGroup: string;
  itemGroup?: any;
  totalcount: number;
  prQty: number;
  poQty: number;
  inProcessQty: number;
  netOrderQty: number;
  orderQty: number;
  remaingQty: number;
  orderDoneBy: string;
  orderedQty: number;
  orderStatus: string;
  remarks: string;
  lastPurchasePrice: number;
  ppoAmount: number;
  minOrderQty: number;
  maxOrderQty: number;
  onHandQtyinMain: number;
  onHandQtyinOther: number;
  poInProcess: number;
  prInReview: number;
  totalConsumption365Days: number;
}

export interface OnHandQuantityDto {
  site: number;
  itemNumber: string;
  config: string;
  warehouse: number;
  location: string;
  qty: number;
}

export interface AllPPOResponseDto {
  ppoId: number;
  ppoNo: string;
  itemId: number;
  itemNumber: string;
  item_Description: string;
  searchName: string;
  config: string;
  reqQuantity: number;
  ppoDate: string;
  uom: string;
  siteId: number;
  site: string;
  warehouseId: number;
  warehouse: string;
  location: string;
  buyerGroup: string;
  itemGroup?: any;
  pendingPRQty: number;
  pendingPO: number;
  inProcessQtyPR: number;
  netOrderQty: number;
  orderQty: number;
  remainingQty?: any;
  minOrderQty: number;
  maxOrderQty: number;
  onHandQtyinMain: number;
  onHandQtyinOther: number;
  poInProcess: number;
  prInReview: number;
  lastPurchasePrice: number;
  ppoAmount: number;
  vendorName?: any;
  totalConsumption365Days: number;
  totalcount:number;
}
export interface ICreateAuctionByPRDto {
  
  
    pR_ID: number,
    user_ID:number ,
    type: string,
    eventName: string,
    eventDescription: string,
    eventColorCode: string
  
}
export interface ICreateAuctionByPRLineDto {
  
  
  
  pR_ID: number,
    user_ID: number,
    type: string,
    prtraN_ID: number,
    eventName: string,
    eventDescription: string,
    eventColorCode: string
  

}