import { ChangeDetectorRef, Component, Input, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDefaultResponseDto, ThreadReplyDto, ThreadUserDto } from '../../../event.interface';
import { EventService } from '../../../event.service';
import { MailBoxComponent } from '../mail-box/mail-box.component';
import { MailBoxViewComponent } from '../mail-box-view/mail-box-view.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatFileuploadComponent } from '../chat.fileupload/chat.fileupload.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ChatDiscontinueComponent } from '../chat.discontinue/chat.discontinue.component';
import { ChatContinueComponentComponent } from '../chat.continue.component/chat.continue.component.component';
import {formatDate} from '@angular/common';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { baseUrl } from 'src/app/shared/constants/urlconfig';
import { PushnotificationService } from 'src/app/shared/services/pushnotification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @ViewChild('scrollChatMe') private myScrollContainer: ElementRef;
  disableScrollDown = false;  
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  chatFormGroup: FormGroup;
  @Input() eventId: number;
  @Input() chatThreadId: string;
  @Input() chatForBuyer: boolean = false;
  @Input() isModel: boolean = false;
  @Input() eventName: string;
  @Input() QP_UserId: number; //user id from query param;
  @Input() QP_UserRole: string; //user role from query param;
  @Input() QP_UserToken: string; //user token from query param;
  @Input() readonly: boolean = false; //user token from query param;
  @Input() msgSendTo: string;
  @Input() isIFrame: boolean = false; //user token from query param;
  isCloseButtonVisible: boolean = true
  ccMailUserList: any = []
  dropList: any = [];
  overlay = false;
  threadUsers: ThreadUserDto[] = [];
  authData: AuthModel | null | undefined;
  showProfileFlag: boolean = false;
  primaryList: ThreadReplyDto[] = [];
  threadRepliesList: ThreadReplyDto[] = [];
  chatTitle: string;
  _userId: number;
  _userRole: string;
  _userEmail: string;
  _emailToReply: string;
  chatMessageText: string = '';
  isChatClosed: boolean = false;
  threadFor: string = '';
  pageIndex = 1;
  pageSize = 10;
  direction = "";
  selectedItemList: any = [];
  currentChatUserId: string = '';
  currentChatUserOnline: boolean = false;
  userFullName: string = '';
  _hubConnection: HubConnection;
  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private activeModel: NgbActiveModal,
    private activeOffcanvas: NgbActiveOffcanvas,
    private authService: AuthService,
    private notificationService : PushnotificationService
  ) {
    
    this.authData = this.commonService.getAuthData();
    this.chatFormGroup = this.formBuilder.group({
      txtMessage: ['']
    });
  }

  createConnection() {  
    this._hubConnection = new HubConnectionBuilder()  
      .withUrl(baseUrl + '/chat'
      // , {skipNegotiation: true}
      )  
      .build();  

    this._hubConnection.serverTimeoutInMilliseconds = 1000 * 60 * 10; // for  10 minute;
    // this._hubConnection.keepAliveIntervalInMilliseconds = 59000;
  }

  private startConnection(): void {  
    this._hubConnection  
    .start()  
    .then(() => {  
      this._hubConnection.invoke('SetActiveThread', this.chatThreadId.toString() + '_' + this._userId.toString(), this._hubConnection.connectionId?.toString())
      console.log('Hub connection started');  
    })  
    .catch((err : any) => {  
      console.log('Error while establishing connection, retrying...');
    });
}

private stopStartConnection(): void{
  if(this._hubConnection.state == 'Connected'){
    this._hubConnection.stop().then(()=>{
      this.startConnection();
    })
  }
  else{
    this.startConnection();
  }
}

  private sendMessage(message: any) {  
    if(this._hubConnection == undefined || this._hubConnection == null || this._hubConnection.state == "Disconnected"){
      this.registerOnServerEvents();  
      this.startConnection();
    }
    message.sendTo = this.msgSendTo;
    message.connectionId = this._hubConnection.connectionId;
    this._hubConnection.invoke('SendEventMessageToUser', JSON.stringify(message));
    this.threadRepliesList.push(message);
    this.cdr.detectChanges();
            this.scrollToBottom();
  } 
  
  private registerOnServerEvents(): void {  
    this._hubConnection.on('ReceiveEventMessage', (data: any) => {  
      var myMsg = JSON.parse(data);
      // if(myMsg.userId != this._userId && this.currentChatUserId == myMsg.userId){
      //   this.threadRepliesList.push(myMsg);
      //   this.cdr.detectChanges();
      //       this.scrollToBottom();
      // }
      if(this._hubConnection.connectionId != myMsg.connectionId){
        this.threadRepliesList.push(myMsg);
        this.notificationService.showNotification('Message from '+ myMsg.fromFullName +' - '+ myMsg.eventTitle, {body: myMsg.text});
        this.cdr.detectChanges();
            this.scrollToBottom();
      }
    }); 
    
    this._hubConnection.on('ReceiveActiveUsers', (newActiveUsers: any) => {  
      
      if(this.chatForBuyer && this.threadUsers.length > 0){
        this.threadUsers = this.threadUsers.map((user:any) =>{ 
          let onlineuser = newActiveUsers.find((usr:any) =>usr == user.vendorId.toString())
          if(onlineuser){
           user.isOnline = true;
          }else{
            user.isOnline = false;
          }
         return user})
      }

      let isOnlineUser = newActiveUsers.find((usr:any) =>usr == this.currentChatUserId.toString());
      this.currentChatUserOnline = (isOnlineUser == undefined || isOnlineUser == null || isOnlineUser == false) ? false : true;
    }); 

    this._hubConnection.on('Call_GetActiveUserIds', (newActiveUsers: any) => {  
      this._hubConnection.invoke('GetActiveUserIds');
    }); 
  }

  private getActiveUsers(): void {  
    this._hubConnection.invoke('GetActiveUserIds')
  }  

  ngOnInit() {
console.log("this is user token",this.QP_UserToken);
let authDatatoset:any={
  accessToken: "",
  expireInSeconds: 3600,
  shouldResetPassword: false,
  userId: this.QP_UserId,
  userRole: this.QP_UserRole,
  refreshToken: "",
  refreshTokenExpireInSeconds: 86400,
  isAzureLogin: false
}
if(this.authData==null){
  localStorage.setItem(this.authLocalStorageToken,JSON.stringify(authDatatoset));
}
    this.createConnection();  
    this.registerOnServerEvents();  
    this.startConnection();

    this.isCloseButtonVisible = this.isIFrame ? false : true
    this._userId = this.authData?.userId ? this.authData?.userId : 0;
    this._userRole = this.authData?.userRole ? this.authData?.userRole : '';

    if (this._userId <= 0 && this.QP_UserId > 0) {
      this._userId = this.QP_UserId;
    }

    if (this._userRole == '' && this.QP_UserRole != '') {
      this._userRole = this.QP_UserRole;
    }

    // var authModel : any;
    //   authModel.accessToken = this.QP_UserToken;
    //   authModel.userId = this._userId;
    //   authModel.userRole = this._userRole;
    //   authModel.expireInSeconds = 0;
    //   authModel.shouldResetPassword = false;
    //   authModel.refreshToken = '';
    //   authModel.refreshTokenExpireInSeconds = 0;
    //   this.authService.setAuthFromLocalStorage(authModel);

    this.currentChatUserId = this.msgSendTo == undefined || this.msgSendTo == null ? '' : this.msgSendTo.toString();
    
    if (this.chatForBuyer) {
      this.getUserList()
    }
    else {
      this.loadThreadChat(this.chatThreadId);
    }
    setTimeout(() => {
      this.getActiveUsers();  
    }, 800);
    
    this.refreshChatQueue()
  }

  close() {

    this.isModel ? this.activeModel.close() : this.activeOffcanvas.close();
    this.modalService.dismissAll();
  }

  openModalMailBox() {
    const modelRef = this.modalService.open(MailBoxComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });

    modelRef.componentInstance.emailTo = this._emailToReply;
    modelRef.componentInstance.emailFrom = this._userEmail;
    modelRef.result.then(
      (result) => {
        this.sendThreadReply(result);
      },
      (err) => {
        if (err) {
          this.cdr.detectChanges();
        }
      }
    );
  }

  openModalAndFillMailBox(mailDto: ThreadReplyDto) {
    const modelRef = this.modalService.open(MailBoxViewComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });

    modelRef.componentInstance.mailDto = mailDto;

    modelRef.result.then(
      (err) => {
        console.log('Detail', err);
      },
      (data) => {
        if (data) {
          this.cdr.detectChanges();
        }
      }
    );
  }

  openFileUploadPopUp() {
    const modelRef = this.modalService.open(ChatFileuploadComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });

    modelRef.result.then(
      (result) => {
        result.forEach((file: File) => {
          let fileUrl: any = this.uploadFileApi(this.chatThreadId, file);
        });
      },
      (err) => {
        if (err) {
          this.cdr.detectChanges();
        }
      }
    );
  }

  openChat(user: ThreadUserDto) {
    this.currentChatUserId = user.vendorId.toString();
    this.chatThreadId = user.threadId;
    this.msgSendTo = user.vendorId.toString();
    this.stopStartConnection();
    this.loadThreadChat(user.threadId);
  }

  downloadFile(url: string) {
    this.commonService.downloadFile(url);
  }

  loadThreadChat(threadId: string) {

    this.chatMessageText = '';
    this.eventService.getThreadByThreadId(threadId).subscribe({
      next: (output: any) => {
        let resp: any;
        resp = output;
        this.eventService.getRepliesByThreadId(threadId, 1, 10).subscribe({
          next: (result: any) => {
            this.threadRepliesList = result.data.reverse();
            this.primaryList = this.threadRepliesList;
            this.cdr.detectChanges();
            this.scrollToBottom();
          }, error: (err: any) => {

          }
        });

        let onlineuser = this.threadUsers.find((usr:any) =>this.currentChatUserId == usr.vendorId.toString())?.isOnline;
        this.currentChatUserOnline = (onlineuser == undefined || onlineuser == null || onlineuser == false) ? false : true;

        this.threadFor = resp.data.threadFor;
        this.showProfileFlag = true;
        this.chatTitle = resp.data.threadTitle;
        this.eventId = resp.data.eventId;
        if (resp.data.isClosed != null && resp.data.isClosed != undefined)
          this.isChatClosed = resp.data.isClosed;
        if (this._userRole == 'Buyer') {
          this._userEmail = resp.data.buyerEmail;
          this._emailToReply = resp.data.vendorEmail;
          this.userFullName = resp.data.userName;
        }
        else {
          this._userEmail = resp.data.vendorEmail;
          this._emailToReply = resp.data.buyerEmail;
          this.userFullName = resp.data.vendorName;
        }
        this.getCCMailUsers()

      }, error: (err: any) => {

      }
    });
  }


  getUserList() {
    this.eventService.getThreadsByEventId(this.eventId).subscribe({
      next: (result: any) => {
        this.threadUsers = result.data;
        for (let i = 0; i < this.threadUsers.length; i++) {
          this.threadUsers[i].shortName = this.threadUsers[i].shortName.slice(0, 3);
          this.threadUsers[i].isOnline = false;
        }
        if (this.chatThreadId != "" && this.chatThreadId != undefined) {
          this.loadThreadChat(this.chatThreadId);
        }
      }, error: () => { }
    });
  }

  sendReply() {
    let replyObj: ThreadReplyDto = {
      threadId: '',
      eventId: 0,
      messageType: 'T',
      // text: this.chatFormGroup.get('txtMessage')?.value,
      // this.chatFormGroup.get('txtMessage')?.setValue("");
      // this.chatFormGroup.setValue({ "txtMessage": '' });
      text: this.chatMessageText,
      userId: 0,
      userRole: '',
      closeThread: false,
      openThread: false
    };

    this.chatMessageText = '';
    if (replyObj.text != undefined && replyObj.text != "") {
      this.sendThreadReply(replyObj);
    }
  }

  openDiscontinueChatBox() {
    const modelRef = this.modalService.open(ChatDiscontinueComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });

    modelRef.result.then(
      (remark) => {
        let replyObj: ThreadReplyDto = {
          threadId: '',
          eventId: 0,
          messageType: 'T',
          text: remark,
          userId: 0,
          userRole: '',
          closeThread: true,
          openThread: false
        };

        if (replyObj.text != undefined && replyObj.text != "") {
          this.isChatClosed = true;
          this.sendThreadReply(replyObj);
          this.cdr.detectChanges();
        }
      },
      (err) => {
        if (err) {
          this.cdr.detectChanges();
        }
      }
    );
  }

  openContinueChatBox() {
    const modelRef = this.modalService.open(ChatContinueComponentComponent, {
      centered: true,
      size: 'lg',
      scrollable: true,
    });

    modelRef.result.then(
      (remark) => {
        let replyObj: ThreadReplyDto = {
          threadId: '',
          eventId: 0,
          messageType: 'T',
          text: remark,
          userId: 0,
          userRole: '',
          closeThread: false,
          openThread: true
        };

        if (replyObj.text != undefined && replyObj.text != "") {
          this.isChatClosed = false;
          this.sendThreadReply(replyObj);
          this.cdr.detectChanges();
        }
      },
      (err) => {
        if (err) {
          this.cdr.detectChanges();
        }
      }
    );
  }

  sendThreadReply(replyDto: ThreadReplyDto) {
    replyDto.threadId = this.chatThreadId;
    replyDto.eventId = this.eventId;
    replyDto.userId = this._userId;
    replyDto.userRole = this._userRole;
    replyDto.shortName = '';
    replyDto.threadFor = this.threadFor;
    replyDto.shortName = this.firstLetterOfWord(this.userFullName);
    replyDto.replyDateTime = formatDate(new Date(), 'dd MMM yyyy hh:mm:ss a', 'en');
    this.sendMessage(replyDto);

    // this.eventService.sendReply(replyDto).subscribe({
    //   next: (result: any) => {
    //     let response: string = result;
    //     this.refreshChatReplies(this.chatThreadId);
    //   },
    //   error: (err) => {
    //     let errorMsg: string = err;
    //   }
    // })
  }

  firstLetterOfWord(value: string): string {
    if (!value) {
      return '';
    }

    return value
      .split(' ')
      .map(word => word.charAt(0))
      .join('');
  }

  refreshChatReplies(threadId: string) {
    this.eventService.getRepliesByThreadId(threadId, 1, 10).subscribe({
      next: (result: any) => {
        this.threadRepliesList = result.data.reverse();
        this.primaryList = this.threadRepliesList;
        this.cdr.detectChanges();
        this.scrollToBottom();

      }, error: () => {

      }
    })
  }

  uploadFile() {
    let node = document.createElement('input');
    node.type = 'file';
    node.accept = 'image/png, image/jpeg, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    node.onchange = (ev: any) => {

      let fileUrl: any = this.uploadFileApi(this.chatThreadId, ev.target.files[0]);
      this.chatFormGroup.get('attached_file')?.setValue(fileUrl);
    };
    node.click();
  }

  async uploadFileApi(id: string, file: File) {
    let resp: any;
    this.eventService.uploadFileThread(id, file)
      .subscribe({
        next: (result: any) => {
          resp = result;
          if (result.success) {
            let fileType: string;
            if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg') {
              fileType = 'I';
            }
            else {
              fileType = 'F';
            }
            let replyObj: ThreadReplyDto = {
              threadId: '',
              eventId: 0,
              messageType: fileType,
              userId: 0,
              userRole: '',
              fileURL: result.data,
              fileName: file.name,
              closeThread: false,
              openThread: false
            };

            this.sendThreadReply(replyObj);
          }
        },
        error: (err: any) => {

        },
      });
    return resp;
  }

  onScrollUp(ev: any) {
    this.pageIndex += 1;
    this.pageSize = 10;

    this.direction = "scroll up";

    this.eventService.getRepliesByThreadId(this.chatThreadId, this.pageIndex, this.pageSize).subscribe({
      next: (result: any) => {
        this.appendItems(result.data);
      }, error: (error) => {
        let err = error;
      }
    });
  }

  appendItems(dataList: any) {
    this.addItems("push", dataList);

  }

  addItems(_method: string, dataList: any) {

    for (let i = 0; i < dataList.length; ++i) {
      if (_method === 'push') {
        this.primaryList.reverse().push(dataList[i]);
      }
      // else if( _method === 'unshift'){
      //   this.threadRepliesList.unshift(dataList[i]);
      // }
    }
    if (dataList.length > 0) {
      this.threadRepliesList = this.primaryList.reverse();
    }
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }


  continueDiscontinueCondition() {

    this.authData?.userRole == 'Requester/Technical'

  }

  refreshChatQueue() {
    this.eventService.refreshChatQueue().subscribe({
      next: (result: any) => {

      }, error: () => { }
    });
  }

  getCCMailUsers() {
    this.eventService.getCCMailUsers(this.eventId).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.ccMailUserList = result.data
          this.dropList = result.data.map((val: any) => {
            return { value: val.userId, label: val.userName };
          });
          this.selectedItemList = this.ccMailUserList.filter((val: any) => val.isSelected).map((val: any) => val.userId.toString())
          this.cdr.detectChanges()
        } else {

        }

      }, error: (err: any) => {

      }
    });
  }


  updateCCMailUserLoader: boolean = false
  updateCCMailUsers() {

    if (this.updateCCMailUserLoader) {
      return
    }

    this.updateCCMailUserLoader = true
    let payload: any = this.ccMailUserList.filter((val: any) => this.selectedItemList.includes(val.userId.toString())).map((val: any) => {
      val.isSelected = true;
      return val;
    })

    this.eventService.saveCCMailUsers(this.eventId, payload).subscribe({
      next: (result: IDefaultResponseDto<any>) => {
        if (result.success) {
          this.commonService.showToaster("CC mail users saved successfully", true)

        } else {
          this.commonService.showToaster(result.errorDetail, false)
        }
        this.updateCCMailUserLoader = false
        this.cdr.detectChanges();

      }, error: (err: any) => {
        this.updateCCMailUserLoader = false
        this.cdr.detectChanges();

      }
    });
  }
}
