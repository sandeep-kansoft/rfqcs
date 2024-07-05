import { Component, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { EventService } from '../../event.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import {
  IInvitationTemplate,
  IRfqDataDtoById,
  IRfqDetailDataDto,
  PublishChecklistResponseDto,
  TabDataDto,
} from '../../event.interface';
import { IDefaultResponseDto } from '../../event.interface';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
})
export class PublishComponent {
  @Input() eventId: number;
  @Input() rfqDetail: IRfqDetailDataDto;
  @Input() publishMailData: any;
  @Output() updateMailData = new EventEmitter<{
    type: string;
    data: string;
  }>();
  tabList: any = [];
  isLoading: boolean = false;
  publishEventLoader: boolean = false;
  invitationDropDown: IInvitationTemplate[];
  invitationLoader: boolean;
  publishEventData: PublishChecklistResponseDto;
  publishFormGroup: FormGroup;
  isTemplateAddPage: boolean = true;
  invalidate: boolean = false;
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

  constructor(
    private eventService: EventService,
    private commonServices: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getInvitationTemplate();
    this.publishFormInit();
    this.getPublishCheckList();

    // this.publishFormGroup.get('subject')?.valueChanges.subscribe(val => {
    //   this.updateMailData.emit({ type: "subject", data: val })
    // })

    // this.publishFormGroup.get('body')?.valueChanges.subscribe(val => {
    //   this.updateMailData.emit({ type: "body", data: val })

    // })

    // this.publishFormGroup.get('template')?.valueChanges.subscribe(val => {
    //   let template = this.publishFormGroup.get('template')?.value
    //   let index = this.invitationDropDown.findIndex(item => template == item.templateName)
    //   if (index != -1) {
    //     this.publishFormGroup.get('subject')?.setValue(this.invitationDropDown[index].mailSubject)
    //     this.publishFormGroup.get('body')?.setValue(this.invitationDropDown[index].mailBody)
    //   }
    // })

  }

  publishFormInit() {
    this.publishFormGroup = this.fb.group({
      template: [''],
      subject: [this.publishMailData.subject ? this.publishMailData.subject : '', Validators.required],
      body: [this.publishMailData.body ? this.publishMailData.body : '', Validators.required],
    });
    this.cdr.detectChanges()
  }

  nextButtonHandler() {
    this.invalidate = true;
    if (this.publishFormGroup.valid) {
      this.isTemplateAddPage = false;
    } else {
    }
  }

  getErrorMessage(controlName: string) {
    if (!this.invalidate) {
      return '';
    }

    let control: AbstractControl<any, any> | null =
      this.publishFormGroup.get(controlName);
    let err = '';
    if (control?.errors?.required) {
      err = 'Field is Required';
    }
    return err;
  }

  validateBeforePublish() {
    return (
      this.publishEventData.priceBid == 'Yes' &&
      this.publishEventData.vendors == 'Yes' &&
      this.publishEventData.scheduled == 'Yes'
    );
  }

  publishEvent() {
    if (!this.publishEventLoader) {
      let isValid: boolean = this.validateBeforePublish();
      // let isAllChecked = this.tabList.every((val: any) => val.value == 'Yes');
      if (isValid) {
        this.commonServices
          .showAlertForWarning('Are you sure', 'You want to publish this event')
          .then((res) => {
            if (res) {
              if (!this.publishEventLoader) {
                this.publishEventApi();
              }
            }
          });
      } else {
        this.commonServices.showToaster("You can't publish this event.", false);
      }
    }
  }
  publishEventApi() {
    console.log("this is rfq detail",this.rfqDetail)
    this.publishEventLoader = true;
this.commonServices.setGlobalLoaderStatus(true);
    let payload = {
      eventId: this.eventId,
      templateName: '',
      mailSubject: this.publishFormGroup.get('subject')?.value,
      mailBody: this.publishFormGroup.get('body')?.value,
    };

    this.eventService.publishEventApi(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonServices.setGlobalLoaderStatus(false);
          this.commonServices.showToaster('Event published successfully', true);
          this.publishEventLoader = false;
          if(this.rfqDetail.eventType=="3"){
            this.router.navigate(['/Event/ReverseAuction']);
          }
          else{
          this.router.navigate(['/Event/RFQList']);
          }
        } else {
          this.commonServices.setGlobalLoaderStatus(false);
          this.publishEventLoader = false;
          this.commonServices.showToaster(result.errorDetail, false);
        }
      },
      error: (err) => {
        this.commonServices.setGlobalLoaderStatus(false);
        this.publishEventLoader = false;
        this.commonServices.showToaster(err.ErrorDetail, false);
      },
    });
  }

  getPublishCheckList() {
    this.isLoading = true;
    this.eventService.getpublishChecklistApi(this.eventId).subscribe({
      next: (result: IDefaultResponseDto<PublishChecklistResponseDto>) => {
        if (result.success) {
          this.isLoading = false;
          this.publishEventData = result.data;
          this.cdr.detectChanges();
        } else {
          this.commonServices.showToaster(result.errorDetail, false)
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  resetHandler() {
    this.publishFormGroup.get('template')?.setValue('');
    this.publishFormGroup.get('body')?.setValue('');
    this.publishFormGroup.get('subject')?.setValue('');
    this.cdr.detectChanges();
  }

  onCkEditorReady(editor: any): boolean {
    const result = true;

    return result;
  }

  getInvitationTemplate() {
    this.invitationLoader = true;
    this.eventService.getInvitationTemplate(this.eventId).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.invitationDropDown = result.data.templates;



          let template = this.publishFormGroup.get('template')?.value
          this.publishFormGroup.get('subject')?.setValue(this.invitationDropDown[0].mailSubject)
          this.publishFormGroup.get('body')?.setValue(this.invitationDropDown[0].mailBody)



          this.cdr.detectChanges();
        } else {
          this.commonServices.showToaster(result.errorDetail, false)
        }

      },
      error: (err) => {
        this.invitationLoader = false;
      },
    });
  }
}
