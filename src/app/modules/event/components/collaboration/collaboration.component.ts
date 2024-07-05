import {
  Component,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  filterBy,
  FilterDescriptor,
  orderBy,
  SortDescriptor,
  State,
  process,
} from '@progress/kendo-data-query';
import {
  CollabrativeUserResponseDto,
  IDefaultResponseDto,
  IGetAllBuyer,
  IGetAllTechnicalAttachMentResponseDto,
  IGetAssignnedCollabrativeUserDataDta,
  IRfqDetailDataDto,
  getBuyer,
} from '../../event.interface';
import { EventService } from '../../event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { Select2Option, Select2UpdateEvent } from 'ng-select2-component';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-collaboration',
  templateUrl: './collaboration.component.html',
  styleUrls: ['./collaboration.component.scss'],
})
export class CollaborationComponent {
  isLoading: boolean = false;
  collabUserDropDownList: CollabrativeUserResponseDto[] = [];
  selectedUserDropDownList: CollabrativeUserResponseDto[] = [];
  @Input() rfqDetail: IRfqDetailDataDto;
  authData: AuthModel | null | undefined;
  @Input() eventId: number;
  // @Output() setTabCompletedStatus$ = new EventEmitter<{
  //   type: string;
  //   status: boolean;
  // }>();

  @Output() updateCheckList$ = new EventEmitter();
  public gridView: GridDataResult;
  public collabTableData: IGetAssignnedCollabrativeUserDataDta[] = [];
  loading: boolean = false;
  public state: State = {};
  serachText: string = '';
  columnWidth = 150;
  headerStyle = 'fw-bold';
  ExtraSmallColumnWidth = 50;
  SmallColumnWidth = 80;
  MediumColumnWidth = 120;
  LargeColumnWidth = 165;
  XtraLargeColumnWidth = 180;
  XtraXtraLargeColumnWidth = 240;
  assignedCollabLoader: boolean = false;
  formGroup: FormGroup;
  deletedList: any = [];
  longColumnWidth = 200;
  pageSize = 10;
  pageNumber = 1;
  dropList: any = [];

  public sort: SortDescriptor[] = [];
  public filter: FilterDescriptor;

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    private commonServices: CommonService
  ) {
    this.authData = this.commonServices.getAuthData();
    this.formGroup = this.fb.group({
      type: ['Collaborative', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.getCollabrativeUserApi();
    this.GetAssignnedCollabrativeUser();

  }

  getCollabrativeUserApi() {
    this.isLoading = true;
    this.eventService.getCollabrativeUserApi(this.eventId).subscribe({
      next: (result: any) => {
        this.isLoading = false;
        this.collabUserDropDownList = result.data.sort((a: any, b: any) => {
          return a.fulL_NAME < b.fulL_NAME ? -1 : 1;
        });
        this.dropList = this.collabUserDropDownList.map((val) => {
          return { value: val.fulL_NAME, label: val.nameAndCode };
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  public onStateChange(state: any) {
    if (!this.loading) {
      this.sort = state.sort;
      this.filter = state.filter;
      this.state = state;
      // let pageSize = state.skip / state.take + 1;
      // if (pageSize != this.pageNumber) {
      //   this.pageNumber = pageSize;
      //   this.getMyPrList();
      // } else {
      // }
      this.loadData(this.collabTableData);
    }
  }

  loadData(data: any) {
    let sortedData = orderBy(data, this.sort);
    let filterData = filterBy(sortedData, this.filter);
    this.collabTableData = data;
    // this.gridView = {
    //   data: filterData,
    //   total: data.length,
    // };
    this.gridView = process(filterData, this.state);
    if (this.serachText != '') {
      this.onFilterAllField(null);
    }
    this.cdr.detectChanges();
  }

  onFilterAllField(event: any) {
    //console.log("Value : ", event.target.value);

    let inputValue;
    if (event) {
      inputValue = event.target.value;
      this.serachText = inputValue;
    } else {
      inputValue = this.serachText;
    }

    let filterData = this.getFilteredData(inputValue);
    this.gridView = process(filterData, this.state);
  }

  getFilteredData(inputValue: string) {
    if (inputValue != '') {
      return filterBy(this.collabTableData, {
        filters: [
          {
            filters: [
              {
                field: 'pR_NUM',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'description',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'siteName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'PROJECT_NAME',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'departmentName',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'prtype',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'prSubType',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'preparer',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'totalValue',
                operator: 'contains',
                value: inputValue,
              },
              {
                field: 'assignBuyer',
                operator: 'contains',
                value: inputValue,
              },
            ],
            logic: 'or',
          },
        ],
        logic: 'or',
      });
    } else {
      return filterBy(this.collabTableData, this.filter);
    }
  }

  addCollabaratorHandler() {
    if (this.formGroup.valid) {
      let type = this.formGroup.get('type')?.value;
      let name = this.formGroup.get('name')?.value;

      if (name == 'Select user') {
        this.commonServices.showToaster('Please select user', false);
        return;
      }

      let index = this.collabTableData.findIndex(
        (val) => val.username == name && val.usertype == type
      );

      if (index != -1 && !this.collabTableData[index].isDeleted) {
        this.commonServices.showToaster('Already Exist', false);
      } else {
        // code to addding a person which is deleted locally
        let data;
        if (index !== -1) {
          data = this.collabTableData[index];
          if (data.isDeleted) {
            this.collabTableData.splice(index, 1);
          }
        }
        let selectedMemberDetail = this.collabUserDropDownList.find(
          (val) => val.fulL_NAME == name
        );

        let obj: IGetAssignnedCollabrativeUserDataDta = {
          usertype: type,
          username: name,
          iS_SCORE_ASSIGN: false,
          iS_COMMERCIAL_ACCESS: false,
          iS_TECHNICAL_ACCESS: false,
          iS_TECHNICAL_APPROVE: false,
          technicalid: selectedMemberDetail?.persoN_ID
            ? selectedMemberDetail?.persoN_ID
            : 0,
          assignid: data && data.isDeleted ? data.assignid : 0,
          eventid: this.eventId,
          isDeleted: false,
          isEdited: data && data.isDeleted ? true : false,
        };

        this.collabTableData.push(obj);
        this.loadData(this.collabTableData);
      }
    } else {
      this.commonServices.showToaster('Please select collaborator name', false);
    }
  }

  public typeChangeHandler(event: any) {
    // debugger
    if (this.formGroup.get('type')?.value == 'Technical') {
      this.selectedUserDropDownList = this.collabUserDropDownList;
    } else {
      this.selectedUserDropDownList = [];
      this.formGroup.get('name')?.setValue('');
    }
    this.cdr.detectChanges();
  }

  GetAssignnedCollabrativeUser() {
    this.assignedCollabLoader = true;
    this.eventService.getAssignedcollaborativeuser(this.eventId).subscribe({
      next: (
        result: IDefaultResponseDto<IGetAssignnedCollabrativeUserDataDta[]>
      ) => {
        this.assignedCollabLoader = false;
        // this.setTabCompleteStatus(result.data.length != 0 ? true : false);
        this.updateCheckList()
        this.loadData(result.data);
      },
      error: (err) => {
        console.log(err);
        this.assignedCollabLoader = false;
      },
    });
  }





  deleteHandler(item: IGetAssignnedCollabrativeUserDataDta, index: number) {
    if (item.isDeleted) {
      this.commonServices.showToaster('Collaborator already deleted', false);
      return;
    }
    this.commonServices
      .showAlertForWarning(
        'Are you sure',
        `You want to delete ${item.username ? item.username.toLowerCase() : ''
        } from collabortar list`
      )
      .then((res) => {
        if (res) {
          // deleteHandler
          this.collabTableData[index].isDeleted = true;
          this.collabTableData[index].iS_COMMERCIAL_ACCESS = false;
          this.collabTableData[index].iS_SCORE_ASSIGN = false;
          this.collabTableData[index].iS_TECHNICAL_ACCESS = false;
          this.collabTableData[index].iS_TECHNICAL_APPROVE = false;
          // this.deletedList.push(this.collabTableData[index]);
          // this.collabTableData.splice(index, 1);
          // let filteredList = this.gridView.data.filter((val) => val != item);
          this.loadData(this.collabTableData);
        }
      });
  }

  technicalOnChangeHandler(item: any) {
    let dataList = this.gridView.data.map(
      (val: IGetAssignnedCollabrativeUserDataDta) => {
        val.iS_TECHNICAL_APPROVE = item == val ? true : false;
        val.isEdited = true;
        return val;
      }
    );
    this.loadData(dataList);
  }
  scoringChangeHandler(item: any) {
    debugger;
    let dataList = this.gridView.data.map((val: any) => {
      val.iS_SCORE_ASSIGN = item == val ? true : false;
      val.isEdited = true;
      return val;
    });
    this.loadData(dataList);
  }

  assignCollabratorApi(list: any) {
    let payload = { collobrativeUser: list };
    this.eventService.assignCollobrativeUserApi(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonServices.showToaster(
            'Collaborator successfully added',
            true
          );
          this.GetAssignnedCollabrativeUser();
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  techncialAndTermsChange(index: number) {
    this.collabTableData[index].isEdited = true;
  }
  updateCollabratorApi(ls: any) {
    let payload = { updateAssignCollobrativeUser: ls };
    this.eventService.updateAssignCollobrativeUserApi(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonServices.showToaster(
            'Collaborator successfully added',
            true
          );
          this.GetAssignnedCollabrativeUser();
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  deleteCollabratorApi(assingId: number, payload: any) {
    this.eventService.deleteCollobrativeUserApi(assingId, payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.GetAssignnedCollabrativeUser();
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  assignTabHandler() {
    if (this.collabTableData.length == 0) {
      this.commonServices.showToaster('Please add collaborator', false);
      return;
    }

    let newData = this.collabTableData
      .filter((val) => val.assignid == 0 && !val.isDeleted)
      .map((val) => {
        let obj = {
          eventid: this.eventId,
          technicalid: val.technicalid,
          iS_SCORE_ASSIGN: val.iS_SCORE_ASSIGN,
          iS_COMMERCIAL_ACCESS: val.iS_COMMERCIAL_ACCESS,
          iS_TECHNICAL_ACCESS: val.iS_TECHNICAL_ACCESS,
          iS_TECHNICAL_APPROVE: val.iS_TECHNICAL_APPROVE,
        };
        return obj;
      });

    let editedData = this.collabTableData
      .filter((val) => val.assignid != 0 && val.isEdited && !val.isDeleted)
      .map((val) => {
        let obj = {
          assignid: val.assignid,
          iS_SCORE_ASSIGN: val.iS_SCORE_ASSIGN,
          iS_COMMERCIAL_ACCESS: val.iS_COMMERCIAL_ACCESS,
          iS_TECHNICAL_ACCESS: val.iS_TECHNICAL_ACCESS,
          iS_TECHNICAL_APPROVE: val.iS_TECHNICAL_APPROVE,
        };
        return obj;
      });

    let deleteList = this.collabTableData.filter(
      (val) => val.assignid != 0 && val.isDeleted
    );

    //function to create new data
    if (newData.length != 0) {
      this.assignCollabratorApi(newData);
    }
    // function to delete data
    // if (this.deletedList.length != 0) {

    // local delete data
    this.collabTableData
      .filter((val) => val.assignid == 0 && val.isDeleted)
      .forEach((item) => {
        let index = this.collabTableData.findIndex((val) => val == item);
        if (index != -1) {
          this.collabTableData.splice(index, 1);
        }
      });

    // }
    // funciton to update data
    if (editedData.length != 0) {
      this.updateCollabratorApi(editedData);
    }

    if (deleteList.length != 0) {
      deleteList.forEach((val: any) => {
        let obj = {
          eventid: this.eventId,
          technicalid: val.technicalid,
          iS_SCORE_ASSIGN: val.iS_SCORE_ASSIGN,
          iS_COMMERCIAL_ACCESS: val.iS_COMMERCIAL_ACCESS,
          iS_TECHNICAL_ACCESS: val.iS_TECHNICAL_ACCESS,
          iS_TECHNICAL_APPROVE: val.iS_TECHNICAL_APPROVE,
        };
        this.deleteCollabratorApi(val.assignid, val);
      });
    }
  }

  // setTabCompleteStatus(status: boolean) {
  //   this.setTabCompletedStatus$.emit({
  //     type: 'COLLABORATION',
  //     status: status,
  //   });
  // }

  addCollaboratorCondition() {
    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return false;
        } else if (eventStatus == 'Unpublished') {
          return true;
        } else if (eventStatus == 'Closed') {
          return false;
        } else if (eventStatus == 'Deleted') {
          return false;
        } else if (eventStatus == 'Terminated') {
          return false;
        }
        break;
    }
  }

  checkBoxDisableCondition(
    item: IGetAssignnedCollabrativeUserDataDta
  ): boolean {
    if (item.isDeleted) {
      return true;
    }

    let eventStatus = this.rfqDetail.eventStatus;
    switch (this.authData?.userRole) {
      case 'Buyer':
        if (eventStatus == 'Published') {
          return true;
        } else if (eventStatus == 'Unpublished') {
          return false;
        } else if (eventStatus == 'Closed') {
          return true;
        } else if (eventStatus == 'Deleted') {
          return true;
        } else if (eventStatus == 'Terminated') {
          return true;
        }
        break;
    }

    return true;
  }

  open(key: string, event: any) {

  }

  close(key: string, event: any) {

  }

  focus(key: string, event: any) {

  }

  blur(key: string, event: any) {

  }

  change(key: string, event: any) {

  }

  search(key: string, event: any) {

  }
  update(event: Select2UpdateEvent<any>) {

  }

  overlay = false;

  updateCheckList() {
    this.updateCheckList$.emit();
  }


  checkBoxSelectedHandler(item:any,index:number){

  }

  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonServices .checkPermission(key)
  }

}
