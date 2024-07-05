import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent implements OnInit {
  isDarkTheme!: boolean;
  @Input() title: string;
  @Input() bodyContent: string;

  constructor(
    public modal: NgbActiveModal,
    private commonservices: CommonService
  ) {}

  ngOnInit(): void {}

  close(type: string) {
    this.modal.close(type);
  }

  isMobileView() {
    return this.commonservices.isMobileBrowser;
  }
}
