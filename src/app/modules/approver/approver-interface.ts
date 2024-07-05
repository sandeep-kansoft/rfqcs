 export interface IPendingResponseListDto {
    awardId: number;
    eventCode: number;
    eventID: number;
    responseStatus?: any;
    buyer: string;
    vendor: string;
    grandTotal: number;
    pr: string;
    projectName: string;
    site: string;
    department: string;
    level: number;
  }