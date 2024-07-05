import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { ChangeDetectorRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbActiveModal,
  NgbActiveOffcanvas,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../event.service';


@Component({
  selector: 'app-cs-appoval-submit-popup',
  templateUrl: './cs-appoval-submit-popup.component.html',
  styleUrls: ['./cs-appoval-submit-popup.component.scss']
})
export class CsAppovalSubmitPopupComponent {
  @Input() title: string;
  @Input() placeholderName: string;
  @Input() value: string;
  inValidate: boolean = false;
  inValidateReason: boolean = false;
  @Input() RemarksCondition:boolean;
  @Input() vendorRankCondition:string;
  ReasonValue:string="";
  otherReasonValue:string;
  otherReason:boolean=false;
  csVendorSelectionReason:any;
  vendorReasonId: number
  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private activeModel: NgbActiveModal,
    private eventService: EventService,
  ) {}

  ngOnInit() {
    this.ReasonValue="";
    this.getCsVendorSelectionReason();
  }
  close() {
    this.activeModel.dismiss();
  }

  save() {
    if(this.RemarksCondition){
if(this.vendorRankCondition=='L1'){
  if (this.value && this.value != '') {
    // this.activeModel.dismiss(this.value);
    let obj={
      Remarks:this.value,
      vendorReason:'',
      vendorReasonId:0
    }
    this.activeModel.dismiss(obj);
  } else {
    this.inValidate = true;
    this.cdr.detectChanges();
  }
}
else{
  if (this.value && this.value != '' &&this.ReasonValue && this.ReasonValue !='') {
    if(this.ReasonValue==='0'){
      let obj={
        Remarks:this.value,
        vendorReason:this.otherReasonValue,
        VendorReasonId: Number(this.ReasonValue)
              }
              this.activeModel.dismiss(obj);
    }
   else{
    let obj={
      Remarks:this.value,
      vendorReason:'',
      VendorReasonId:Number(this.ReasonValue)
            }
            this.activeModel.dismiss(obj);
   }
  } else {
    this.inValidate = true;
    this.inValidateReason=true;
    this.cdr.detectChanges();
  }
 }
  
    }
   else{
    if (this.value && this.value != '' &&this.ReasonValue && this.ReasonValue !='') {
      if(this.ReasonValue==='0'){
        let obj={
          Remarks:this.value,
          vendorReason:this.otherReasonValue,
          VendorReasonId: Number(this.ReasonValue)
                }
                this.activeModel.dismiss(obj);
      }
     else{
      let obj={
        Remarks:this.value,
        vendorReason:'',
        VendorReasonId:Number(this.ReasonValue)
              }
              this.activeModel.dismiss(obj);
     }
    } else {
      this.inValidate = true;
      this.inValidateReason=true;
      this.cdr.detectChanges();
    }
   }
  }
  onOptionsSelected(Reason:any){
    if(Reason==='0'){
      this.otherReason=true;
    }
    else{
      this.otherReason=false;
    }
  }

  getCsVendorSelectionReason() {
    // this.loading = true;
    this.eventService.getCsVendorSelectionReason("CSVendorSelection").subscribe({
      next: (result: any) => {
        // this.loading = false;
        this.csVendorSelectionReason = result.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        // this.loading = false;
      },
    });
  }

}
