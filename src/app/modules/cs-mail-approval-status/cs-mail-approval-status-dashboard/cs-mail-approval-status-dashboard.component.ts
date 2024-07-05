import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CsMailApprovalStatusService } from '../cs-mail-approval-status.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-cs-mail-approval-status-dashboard',
  templateUrl: './cs-mail-approval-status-dashboard.component.html',
  styleUrls: ['./cs-mail-approval-status-dashboard.component.scss']
})
export class CsMailApprovalStatusDashboardComponent {
  constructor(private route: ActivatedRoute, private router: Router, private csMailApprovalSerive: CsMailApprovalStatusService, private commonServices: CommonService) { }

  payload: any = {
    AwardId: 0,
    Type: '',
    UserId: 0,
    level: '',
    Remarks: ' '
  }
  resultStatus = ''
  errorMessage = ''


  ngOnInit() {
    this.commonServices.globalLoader.next(true);
    this.route.queryParams.subscribe(params => {

      try {
        let payloadParam: any = {};
        payloadParam.AwardId = this.commonServices.decryptString(params['AwardId']);
        payloadParam.Type = this.commonServices.decryptString(params['Type'])
        payloadParam.UserId = this.commonServices.decryptString(params['UserId']);
        payloadParam.level = this.commonServices.decryptString(params['level']);
        payloadParam.Remarks = this.commonServices.decryptString(params['Remarks']);
        let isValid = Object.values(payloadParam).every(val => val != undefined && val != '' && val != null)
        if (isValid) {
          this.payload = payloadParam;
          this.getCsMailApprovalStatus()
        } else {
          this.commonServices.showToaster('Invalid Fields', false)
        }
      } catch (error) {
        this.commonServices.globalLoader.next(false);
        this.errorMessage = 'Sorry, changing the URL is not allowed.'
      }
    });
  }


  getCsMailApprovalStatus() {
    this.resultStatus = '';
    this.errorMessage = ''
    this.csMailApprovalSerive.getCsApproveRejectStatus(this.payload).subscribe({
      next: (result) => {
        // console.log("result is", result)

        this.commonServices.globalLoader.next(false);
        if (result.success) {
          this.resultStatus = result.data
        } else {
          this.errorMessage = result.errorDetail
        }

      }, error: () => {
        this.commonServices.globalLoader.next(false);
      }
    })
  }


}

// http://localhost:4200/#/CsMailApprovalStatus?awardid=10&type=test&userId=27043&level
