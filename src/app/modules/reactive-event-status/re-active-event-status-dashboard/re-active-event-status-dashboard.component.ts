import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReActiveEventStatusService } from '../re-active-event-status.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-re-active-event-status-dashboard',
  templateUrl: './re-active-event-status-dashboard.component.html',
  styleUrls: ['./re-active-event-status-dashboard.component.scss']
})
export class ReActiveEventStatusDashboardComponent {

  resultStatus = ''
  errorMessage = ''
  key = ''
  constructor(private route: ActivatedRoute, private router: Router, private reactiveEventSerive: ReActiveEventStatusService, private commonServices: CommonService) { }




  ngOnInit() {
    this.commonServices.globalLoader.next(true);
    this.route.queryParams.subscribe(params => {

      try {
        this.key = params['key'];
        if (this.key) {
          this.SendReactivationLinkApi()
        } else {
          this.commonServices.showToaster('Invalid Fields', false)
        }
      } catch (error) {
        this.commonServices.globalLoader.next(false);
        this.errorMessage = 'Sorry, changing the URL is not allowed.'
      }
    });
  }

  SendReactivationLinkApi(){
      this.resultStatus = '';
      this.errorMessage = ''
      this.reactiveEventSerive.getCsApproveRejectStatus(this.key).subscribe({
        next: (result) => {
          // console.log("result is", result)
          this.commonServices.globalLoader.next(false);
          if (result.Success) {
            this.resultStatus = result.Data
          } else {
            this.errorMessage = result.ErrorDetail
          }
  
        }, error: (err) => {
          this.errorMessage = err.ErrorDetail
          this.commonServices.globalLoader.next(false);
        }
      })
    
  }
}
