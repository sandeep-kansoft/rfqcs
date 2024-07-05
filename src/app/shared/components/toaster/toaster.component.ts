import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
})
export class ToasterComponent implements OnInit {
  toaster: any = [];
  constructor(private commonService: CommonService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.commonService.currentToasterList$.subscribe({
      next: (toaster) => {
        this.toaster = toaster;
        this.cdr.detectChanges();
      },
    });
  }
  ngOnDestroy(): void {
    this.commonService.clearToaster();
  }
  closeToast(toast: any) {
    this.commonService.removeToaster(toast);
  }
  removeToaster(toast: any) {
    this.commonService.removeToaster(toast);
  }
}
