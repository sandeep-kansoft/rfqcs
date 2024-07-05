import { Component, Input } from '@angular/core';
import { ThreadReplyDto } from '../../../event.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mail-box-view',
  templateUrl: './mail-box-view.component.html',
  styleUrls: ['./mail-box-view.component.scss']
})
export class MailBoxViewComponent {

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
    readOnly: true
  };

  showCC: boolean = false;
  showBCC: boolean = false;

  @Input() mailDto: ThreadReplyDto;

  subject: string;
  mailBody: string;
  toMail: string;
  toCC: string;
  toBCC: string;

  constructor(private modalService: NgbActiveModal) {

  }

  close() {
    this.modalService.dismiss()
  }

  ngOnInit() {
    this.subject = this.mailDto.emailSubject ? this.mailDto.emailSubject : '';
    this.mailBody = this.mailDto.emailBody ? this.mailDto.emailBody : '';
    this.toMail = this.mailDto.emailTo ? this.mailDto.emailTo : '';
    this.toCC = this.mailDto.emailCC ? this.mailDto.emailCC : '';
    this.toBCC = this.mailDto.emailBCC ? this.mailDto.emailBCC : '';

    if (this.mailDto?.emailCC) {
      this.showCC = true
    }
    if (this.mailDto?.emailBCC) {
      this.showBCC = true
    }
  }

  onCkEditorReady(editor: any): boolean {
    const result = true;

    return result;
  }

  displayCC() {
    this.showCC = !this.showCC;
  }

  displayBCC() {
    this.showBCC = !this.showBCC;
  }

}
