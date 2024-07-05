import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { baseUrl } from 'src/app/shared/constants/urlconfig';
import { BroadcastTemplatDto, ReadMessageDto, ThreadReplyDto } from '../../../event.interface';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from '../../../event.service';
import { formatDate } from '@angular/common';
import { NgbActiveModal, NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PermissionEnums } from 'src/app/shared/services/permission-interface';

@Component({
  selector: 'app-brodcast',
  templateUrl: './brodcast.component.html',
  styleUrls: ['./brodcast.component.scss']
})
export class BrodcastComponent {
  
  @ViewChild('scrollChatMe') private myScrollContainer: ElementRef;
  
  broadcastMessageList: ThreadReplyDto[] = [];
  primaryList: ThreadReplyDto[] = [];
  _userId: number;
  _userRole: string;
  authData: AuthModel | null | undefined;
  broadcastText: string = '';
  templateList:BroadcastTemplatDto[] = [];
  @Input() rfqDetail: any;
  @Input() readOnly: boolean = false;
  selectedTemplate: number = 0;
  userFullName: string = '';
  readDto : ReadMessageDto = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
    private eventService: EventService,
    private activeModel: NgbActiveModal,
    private activeOffcanvas: NgbActiveOffcanvas
  ) {
    this.authData = this.commonService.getAuthData();
  }
  
  ngOnInit() {

    this._userId = this.authData?.userId ? this.authData?.userId : 0;
    this._userRole = this.authData?.userRole ? this.authData?.userRole : '';

    if(this.commonService._hubConnection == undefined || this.commonService._hubConnection == null){
      this.commonService.createConnection();
    }
    if(this.commonService._hubConnection.state == "Disconnected" && this._userId){
      this.commonService.startConnection(this._userId);
      this.commonService.registerOnServerEvents();
      this.registerOnServerEvents();
    }
    else{
      this.stopStartConnection();
    }

    this.getMessagesTemplate();
    this.getOldMessages();

    this.readDto = {
      UserId:this._userId,
      UserRole:this._userRole,
      EventId:this.rfqDetail.eventid,
      ThreadId:this.rfqDetail.bCastThreadId,
      ThreadFor:'BCAST'
    }
    this.commonService.MarkMessageAsRead(this.readDto).subscribe({
      next : (res)=>{},
      error : (err) =>{
        
      }
    });
  }

  close() {
    this.activeOffcanvas.dismiss();
  }

  private stopStartConnection(): void{
  if(this.commonService._hubConnection.state == 'Connected'){
    this.commonService._hubConnection.stop().then(()=>{
      this.commonService.startConnection(this._userId);
      this.commonService.registerOnServerEvents();
      this.registerOnServerEvents();
    })
  }
  else{
    this.commonService.startConnection(this._userId);
    this.commonService.registerOnServerEvents();
    this.registerOnServerEvents();
  }
}

sendBroadcast() {
  let BroadcastObj: ThreadReplyDto = {
    threadId: this.rfqDetail.bCastThreadId,
    eventId: this.rfqDetail.eventid,
    messageType: 'T',
    text: this.broadcastText,
    userId: this._userId,
    userRole: this._userRole,
    closeThread: false,
    openThread: false,
    threadFor: 'BCAST',
    shortName: this.firstLetterOfWord(this.userFullName),
    replyDateTime: formatDate(new Date(), 'dd MMM yyyy hh:mm:ss a', 'en')
  };

  if (BroadcastObj.text != undefined && BroadcastObj.text != "") {
    this.broadcastText = '';
    this.sendMessage(BroadcastObj);
  }
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

private sendMessage(message: any) {
  if(this.commonService._hubConnection == undefined || this.commonService._hubConnection == null){
    this.commonService.createConnection();
  }
  if(this.commonService._hubConnection.state == "Disconnected" && this._userId){
    this.commonService.startConnection(this._userId);
    this.commonService.registerOnServerEvents();
    this.registerOnServerEvents();
  }
  message.connectionId = this.commonService._hubConnection.connectionId;
  this.commonService._hubConnection.invoke('SendAuctionBCastMessage', JSON.stringify(message));
  this.broadcastMessageList.push(message);
  this.cdr.detectChanges();
  this.scrollToBottom();
} 
  
  private registerOnServerEvents(): void {  
    this.commonService._hubConnection.on('AuctionBCastMessageReceived', (data: any) => {  
      var myMsg = JSON.parse(data);
      if(this.rfqDetail.bCastThreadId == myMsg.threadId){
        this.broadcastMessageList.push(myMsg);
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  private getOldMessages():void{
    this.broadcastText = '';
    let eventDtl = this.rfqDetail;

    this.eventService.getThreadByThreadId(this.rfqDetail.bCastThreadId).subscribe({
      next: (output: any) => {
        let resp: any;
        resp = output;
        
        this.userFullName = resp.data.userName;

      }, error: (err: any) => {

      }
    });

    this.eventService.getOldBroadcastMsg(this.rfqDetail.bCastThreadId,1,50).subscribe({
      next: (output: any) => {
        let resp: any;
        resp = output;
        this.broadcastMessageList = resp.data.reverse();
            this.primaryList = this.broadcastMessageList;
            this.cdr.detectChanges();
            this.scrollToBottom();

      }, error: (err: any) => {
        let errorText = err;
      }
    });
  }

  private getMessagesTemplate():void{
    this.broadcastText = '';
    this.eventService.getAllBroadcastTemplates().subscribe({
      next: (output: any) => {
        this.templateList = output.data;
      }, error: (err: any) => {
        let errorText = err;
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  onTemplateSelection() {
    let item=  this.templateList.find((val)=>val.templateId == this.selectedTemplate)
    if(item){
      this.broadcastText = item.templateText??'';
    }
    this.selectedTemplate = 0;
  }

  downloadFile(url: string) {
    this.commonService.downloadFile(url);
  }

  permissionEnum = PermissionEnums
  checkPermission(key: string) {
    return this.commonService.checkPermission(key)
  }


}
