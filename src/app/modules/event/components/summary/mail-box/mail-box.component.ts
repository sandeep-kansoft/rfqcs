import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThreadReplyDto } from '../../../event.interface';

@Component({
  selector: 'app-mail-box',
  templateUrl: './mail-box.component.html',
  styleUrls: ['./mail-box.component.scss']
})
export class MailBoxComponent {

  @Input() emailTo: string;
  @Input() emailFrom: string;
  invalidate: boolean = false

  ckEditorConfig: any = {
    toolbar: [
      [
        'Source',
        'Templates',
        'Bold',
        'Italic',
        'Underline',
        'Strike',
        'Subscript',
        'Superscript',
        '-',
        'CopyFormatting',
        'RemoveFormat',
      ],
      [
        'Cut',
        'Copy',
        'Paste',
        'PasteText',
        'PasteFromWord',
        '-',
        'Undo',
        'Redo',
      ],
      ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'],
      [
        'NumberedList',
        'BulletedList',
        '-',
        'Outdent',
        'Indent',
        '-',
        'Blockquote',
        'CreateDiv',
        '-',
        'JustifyLeft',
        'JustifyCenter',
        'JustifyRight',
        'JustifyBlock',
        '-',
        'BidiLtr',
        'BidiRtl',
      ],
      ['Link', 'Unlink', 'Anchor'],
      [
        'Image',
        'Table',
        'HorizontalRule',
        'Smiley',
        'SpecialChar',
        'PageBreak',
        'Iframe',
      ],
      ['Styles', 'Format', 'Font', 'FontSize'],
      ['TextColor', 'BGColor'],
      ['Maximize', 'ShowBlocks'],
    ],
  };

  showCC: boolean = false;
  showBCC: boolean = false;

  mailFormGroup: FormGroup;

  constructor(private modalService: NgbActiveModal,
    private fb: FormBuilder) {
    this.mailFormGroup = this.fb.group({
      compose_to: ['', [Validators.required]],
      compose_cc: ['', Validators.compose([
        this.validateMultipleEmails
      ])],
      compose_bcc: ['', Validators.compose([
        this.validateMultipleEmails
      ])],
      compose_subject: ['', [Validators.required, Validators.maxLength(200)]],
      compose_body: ['', Validators.required]
    });

  }

  validateMultipleEmails(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!control.value) {
      return null
    }
    const emails = control.value.replaceAll(' ', '').split(',');
    for (const email of emails) {
      if (!email.match(emailRegex)) {
        return { invalidEmail: true };
      }
    }
    return null;
  }

  ngOnInit() {
    this.mailFormGroup.get('compose_to')?.setValue(this.emailTo);
  }

  save() {
    this.invalidate = true
    if (this.mailFormGroup.valid) {
      let replyObj: ThreadReplyDto = {
        messageType: 'E',
        emailFrom: this.emailFrom,
        emailTo: this.mailFormGroup.get('compose_to')?.value,
        emailCC: this.mailFormGroup.get('compose_cc')?.value,
        emailBCC: this.mailFormGroup.get('compose_bcc')?.value,
        emailSubject: this.mailFormGroup.get('compose_subject')?.value,
        emailBody: this.mailFormGroup.get('compose_body')?.value,
        mailAttachmentList: [],
        closeThread: false
      }
      this.modalService.close(replyObj);
    } else {

    }
  }

  close() {
    this.modalService.dismiss()
  }

  ngOnit() {

  }

  displayCC() {
    this.showCC = !this.showCC;
  }

  displayBCC() {
    this.showBCC = !this.showBCC;
  }

  onCkEditorReady(editor: any): boolean {
    const result = true;

    return result;
  }

}
