import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { IReasonDataDto, IRfqcsResultDataDto } from '../../event.interface';
import { EventService } from '../../event.service';

@Component({
  selector: 'app-reason-modal',
  templateUrl: './reason-modal.component.html',
  styleUrls: ['./reason-modal.component.scss']
})
export class ReasonModalComponent {
  
  @Input() type:string
  remarks:string='';
  reasonId:number=0;
  reasonName:string;
  inValidate: boolean = false;
  loading:boolean=false;
  reasonList:IReasonDataDto[] = [];

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private activeModel: NgbActiveModal,
    private eventService:EventService
  ) {}

  close() {
    this.activeModel.dismiss();
  }

  public ngOnInit() 
  {
    this.getReasonServiceCall();
  }

  save() {
    debugger;
    if (this.remarks && this.remarks != '' && this.reasonId!=0) {
      let item = this.reasonList.filter((val:any)=>val.reasonId==this.reasonId);
      
      let payLoad={
        ReasonId:this.reasonId,
        ReasonName:item[0].reasonName,
        Remarks:this.remarks
      }
      this.activeModel.dismiss(payLoad);
    } else {
      this.inValidate = true;
      this.cdr.detectChanges();
    }
  }

   //Common service for currencies
   getReasonServiceCall() {
    this.loading = true;
    this.eventService.getReasonByType(this.type).subscribe({
      next: (result: IRfqcsResultDataDto) => {
        if (result.success) {
          this.loading = false;
          this.reasonList = result.data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  getTypeText(){

    switch(this.type)
    {
      case 'Terminate':
        return 'Terminate'
    }

  }


}
