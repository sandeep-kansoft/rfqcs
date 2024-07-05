import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IRfqDetailDataDto } from '../../event.interface';

@Component({
  selector: 'app-viewer-administrator',
  templateUrl: './viewer-administrator.component.html',
  styleUrls: ['./viewer-administrator.component.scss']
})
export class ViewerAdministratorComponent {
  
  @Input() rfqDetail: IRfqDetailDataDto;

  @Output() updateCheckList$ = new EventEmitter();


  updateCheckList() {
    this.updateCheckList$.emit();
  }

}
