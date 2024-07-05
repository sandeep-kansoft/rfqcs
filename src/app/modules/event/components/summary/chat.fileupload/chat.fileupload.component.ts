import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../event.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-chat.fileupload',
  templateUrl: './chat.fileupload.component.html',
  styleUrls: ['./chat.fileupload.component.scss']
})
export class ChatFileuploadComponent {
  
  constructor(
    private modalService: NgbActiveModal,
    private templateModel: NgbModal,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private commonService: CommonService
  ) {
    
  }

  files: File[] = [];

onSelect(event: any) {
  this.files.push(...event.addedFiles);
}

onRemove(event: any) {
  this.files.splice(this.files.indexOf(event), 1);
}

  closeModel() {
    this.modalService.close();
  }

  sendFiles()
  {
    this.modalService.close(this.files);
  }
}
