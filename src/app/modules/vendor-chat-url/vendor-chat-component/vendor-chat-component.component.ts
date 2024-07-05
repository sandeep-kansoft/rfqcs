import { Component } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from '../../event/components/summary/chat/chat.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-vendor-chat-component',
  templateUrl: './vendor-chat-component.component.html',
  styleUrls: ['./vendor-chat-component.component.scss']
})
export class VendorChatComponentComponent {

  threadId: string = "";
  refId: number = 0;
  title: string = "";
  userId: number = 0;
  userRole: string = "";
  userHash: string = "";
  HashSequence: string = "key|command|user|refid";
  readonly: boolean = false;
  msgSendTo: number;

  constructor(
    private modalService: NgbModal,
    private activeCanvas: NgbOffcanvas,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  public ngOnInit() {
    // this.openChatPopUp("ECA098DC-10D9-4E87-8CA8-1D9DA905933B",181,"test");
    // this.openChatDrawer("ECA098DC-10D9-4E87-8CA8-1D9DA905933B",181,"test");
    this.route.queryParams.subscribe(params => {
      this.threadId = params['threadId'];
      this.refId = params['refId'];
      this.title = params['title'];
      this.userId = params['userId'];
      this.userRole = params['userRole'];
      this.userHash = params['userHash'];
      this.readonly = params['readonly'] == 'true' ? true : false;
      this.msgSendTo = params['msgSendTo'] == null || params['msgSendTo'] == '' ? 0 : params['msgSendTo'];
    });

    const hashVal = this.GenerateHashKey(this.userId, this.refId);
    if (this.userHash != hashVal) {
      this.router.navigate(['/error/404']);
    }
  };

  GenerateHashKey(UserId: number, RefId: number): string {
    var hashVarsSeq: string[];
    var hash_string: string = "";
    hashVarsSeq = this.HashSequence.split('|');
    hashVarsSeq.forEach(str => {
      if (str == "key") {
        hash_string = hash_string + "wxfrSS578X56RFQ";
        hash_string = hash_string + '|';
      }
      else if (str == "command") {
        hash_string = hash_string + "open_Chat";
        hash_string = hash_string + '|';
      }
      else if (str == "user") {
        hash_string = hash_string + UserId;
        hash_string = hash_string + '|';
      }
      else if (str == "refid") {
        hash_string = hash_string + RefId;
      }
    });

    const hashedPass = crypto.SHA512(hash_string).toString(crypto.enc.Hex);
    return hashedPass;
  }

  openChatPopUp(threadId: string, refId: number, title: string) {
    debugger;
    const modelRef = this.modalService.open(ChatComponent, {
      centered: true,
      fullscreen: true,
      scrollable: true,
    });

    modelRef.componentInstance.eventId = refId;
    modelRef.componentInstance.chatThreadId = threadId;
    modelRef.componentInstance.chatForBuyer = false;
    modelRef.componentInstance.isModel = false;
    modelRef.componentInstance.eventName = title;
    modelRef.componentInstance.QP_UserId = this.userId;
    modelRef.componentInstance.QP_UserRole = this.userRole;
    modelRef.componentInstance.readonly = this.readonly;
    modelRef.componentInstance.msgSendTo = this.msgSendTo;
    modelRef.result.then(
      (err) => {

      },
      (data) => {
        if (data) {

        }
      }
    );
  }

  openChatDrawer(threadId: string, refId: number, title: string) {
    const modelRef = this.activeCanvas.open(ChatComponent, {
      position: 'end',
      ariaLabelledBy: 'offcanvas-basic-title',
    });
    modelRef.componentInstance.eventId = refId;
    modelRef.componentInstance.chatThreadId = threadId;
    modelRef.componentInstance.chatForBuyer = false;
    modelRef.componentInstance.isModel = false;
    modelRef.componentInstance.eventName = title;
    modelRef.componentInstance.QP_UserId = this.userId;
    modelRef.componentInstance.QP_UserRole = this.userRole;
    modelRef.componentInstance.readonly = this.readonly;
    modelRef.componentInstance.msgSendTo = this.msgSendTo;
  }
}
