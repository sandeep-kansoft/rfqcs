export interface IPermissionlistDataDto {
  userId: number;
  permissionId: number;
  permissionCode: string;
  permissionName: string;
  permissionDetails: string;
}

export interface IPermissionlist2DataDto {
  userId: number;
  permissionId: number;
  permissionCode: string;
  permissionName: string;
  permissionDetails: string;
}

export interface Childmenu {
  menuId: number;
  menuName: string;
  menuCode: string;
  parentId: number;
  filePath?: string;
  permissionlist: IPermissionlist2DataDto[];
}

export interface IMenuDataDto {
  menuId: number;
  menuName: string;
  menuCode: string;
  parentId: number;
  filePath?: string;
  permissionlist: IPermissionlistDataDto[];
  childmenu: Childmenu[];
}

export interface IMenuResponseDataDto {
  data: IMenuDataDto[];
  success: boolean;
  error?: any;
  errorDetail?: any;
}

export interface IPermissionDataDto {
  data: IPermissionlistDataDto[];
  success: boolean;
  error?: any;
  errorDetail?: any;
}

export interface ICustomFilterDataDto {
  dateRangeSelected:any;
  prNo: string;
  ppoNumber: string;
  department: string;
  isPrFieldVisible: boolean;
  isDepartmentVisible: boolean;
  isSearchByPPONumber: boolean;
  isSearchItemNumber: boolean;
  ItemNumber: string;
  site: string;
  isSiteVisible: boolean;
}

export interface IDateRangeDataDto {
  rangeName: string,
  rangeType: string,
  days: number,
  isVisible: boolean,
  isDefault: boolean,
  startDate:Date | null;
  endDate:Date | null
}

//common dto for services
export interface ICommmonDataDto {
  data: any;
  success: boolean
  error: any
  errorDetail: any
}

//currency dto for services
export interface ICurrencyDataDto {
  currencY_CODE: string
  currencY_NAME: string
  currencymastid: number
}

export interface IUserDataDto {
  userId: number
  isADUser: boolean
  email: string
  userRole: string
  isEPS: boolean
  isMRD: boolean
  isPlant: boolean
  userAddress: any
  contactNo: string
  ipAddress: string
  loginDateTime: string
  fullName: string
}