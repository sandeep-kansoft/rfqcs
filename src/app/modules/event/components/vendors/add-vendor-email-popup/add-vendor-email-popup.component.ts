import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../event.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { IAllVendorsEmailList } from '../../../event.interface';

@Component({
  selector: 'app-add-vendor-email-popup',
  templateUrl: './add-vendor-email-popup.component.html',
  styleUrls: ['./add-vendor-email-popup.component.scss']
})
export class AddVendorEmailPopupComponent {

  @Input() vendorId: number
  @Input() eventId: number
  @Input() vendorEmail: any
  @Input() eventStatus:any
  isLoading: boolean = false;
  isCheckBoxdisabled:boolean=false;
  isSaveLoading: boolean = false
  isSaveButtonDisabled: boolean = false
  isCancelButtonDisabled: boolean = false
  eventVendorEmailList: IAllVendorsEmailList[] = []
  eventVendorList: any = []
  constructor(private activeModal: NgbActiveModal, private eventService: EventService, private commonService: CommonService) {

  }

  ngOnInit() {
    console.log("this is event status",this.eventStatus);
    let eventVendorEmailListArray:any = this.vendorEmail.split(',').map((val: string) => {
      return { email: val, isChecked: false }
    });
    // this.eventVendorEmailList = Array.from(new Set(eventVendorEmailListArray.map(JSON.stringify))).map(JSON.parse as string);
    this.eventVendorEmailList = Array.from(new Set(eventVendorEmailListArray.map((obj:any) => JSON.stringify(obj)))).map((str:any) => JSON.parse(str) as typeof eventVendorEmailListArray[number]);
    console.log("this is email vendor list", this.eventVendorEmailList)
this.checkBoxConditionCheck();
    this.getVendorsEmailList()
  }

  eventStatusConditionCHeck(email:any){
    if(email.email== '' || email.email=="NULL"){
      return false;
    }
  else{
    return true;
  }
    // if(this.eventStatus=='Unpublished'){
    //   return true;
    // }
    // else{
    //   return false;
    // }
  }
checkBoxConditionCheck(){
  if(this.eventStatus=='Unpublished'){
      this.isCheckBoxdisabled=false;
    }
    else{
      this.isCheckBoxdisabled=true;
    }
}


  closeModal(type: string) {
    switch (type) {
      case "SAVE":
        this.activeModal.close()
        break;

      case "CLOSE":
        this.activeModal.dismiss()
        break;

      default:
        break;
    }
  }


  getVendorsEmailList() {
    this.isLoading = true
    this.isSaveButtonDisabled = true
    this.eventService.getEventVendorsEmail(this.eventId, this.vendorId).subscribe({
      next: (result) => {
        try {
          if (result.success) {
            this.eventVendorList = result?.data?.vendor
            let eventVendorlistempty=result.data
            console.log("eventVendorlistempty",eventVendorlistempty)
            console.log("this is checked vendor list", this.eventVendorList);
            console.log("this is event vendor email list",this.eventVendorEmailList);

            if(!eventVendorlistempty){
              for(let i=0;i<this.eventVendorEmailList.length;i++){
                this.eventVendorEmailList[i].isChecked = true;
              }
            }
             else{
                  for (let i = 0; i < this.eventVendorEmailList.length; i++) {
              for (let j = 0; j < this.eventVendorList.length; j++) {
                if (this.eventVendorEmailList[i].email == this.eventVendorList[j].emailid) {
                  this.eventVendorEmailList[i].isChecked = true;
                }
              }

            }
           }
          } else {
            this.commonService.showToaster(result.errorDetail, false)
          }

        } catch (error) {

        } finally {
          this.isLoading = false
          this.isSaveButtonDisabled = false
        }
      }, error: () => {
        this.isLoading = false
        this.isSaveButtonDisabled = false
      }
    })
  }

  saveVendorsEmailList() {
    if (this.isSaveLoading) {
      return
    }
let emailsSelected:any[]=[];
    this.isSaveLoading = true;
    this.isCancelButtonDisabled = true;
    this.isSaveButtonDisabled = true

    this.eventVendorEmailList.forEach((val)=>{
if(val.isChecked){
  emailsSelected.push(val.email)
}
    })
    let emailsSelectedInString=emailsSelected.join(',');
    console.log("final emails to send in string",emailsSelectedInString);
    this.eventService.saveEventVendorsEmail(emailsSelectedInString,this.eventId,this.vendorId).subscribe({
      next: (result) => {
        try {

          if (result.success) {
            this.closeModal('SAVE')
            this.commonService.showToaster('Vendor email updated successfully', true)
            // this.eventVendorList = result.data
          } else {
            this.commonService.showToaster(result.errorDetail, false)
          }

        } catch (error) {

        } finally {
          this.isSaveLoading = false;
          this.isCancelButtonDisabled = false;
          this.isSaveButtonDisabled = false
        }
      }, error: () => {
        this.isSaveLoading = false;
        this.isCancelButtonDisabled = false;
        this.isSaveButtonDisabled = false
      }
    })
  }



}
