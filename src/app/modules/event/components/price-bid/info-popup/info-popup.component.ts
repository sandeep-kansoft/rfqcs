import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../event.service';

@Component({
  selector: 'app-info-popup',
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.scss']
})
export class InfoPopupComponent {
  loading:boolean=false;
  @Input() eventTransId:number;
  TechnicalSpecification:string
  constructor(
   
    public modal: NgbActiveModal,
    private eventService: EventService,
   
  ) {
   
  }

  public ngOnInit(){
    this.getTechnicalSpecification()
  }


  getTechnicalSpecification() {
    this.loading = true;
    this.eventService.getTechnicalSpecification(this.eventTransId).subscribe({
      next: (result: any) => {
        this.loading = false;
        this.TechnicalSpecification=result.data;
        
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  closeModel() {
    this.modal.dismiss();
  }
}
