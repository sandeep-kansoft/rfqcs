import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICustomFilterDataDto } from '../../services/common.interface';

@Component({
  selector: 'app-filter-view',
  templateUrl: './filter-view.component.html',
  styleUrls: ['./filter-view.component.scss'],
})
export class FilterViewComponent {
  @Output() onFilterAllFieldEmitter = new EventEmitter<object>();
  @Output() closeFilterEmitter = new EventEmitter<object>();
  @Input() customFilter: ICustomFilterDataDto;
  customFilterHere: ICustomFilterDataDto;
  constructor(){

  }



  public ngOnInit() {
    this.customFilterHere=JSON.parse(JSON.stringify(this.customFilter));
  }

  onFilterAllField(event: any) {
    this.onFilterAllFieldEmitter.emit(event);
  }

  closeFilter(type: any) {
    this.closeFilterEmitter.emit(type);

    // switch (type) {
    //   case 'rangeName':
    //     break;
    //   case 'custom':
    //     break;
    //   case 'department':
    //     break;
    //   case 'site':
    //     break;

    //   default:
    //     break;
    // }

    // this.closeFilterEmitter.emit();
  }
}
