import {
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgbActiveModal,
  NgbActiveOffcanvas,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { PurchaseRequistionServiceService } from '../purchase-requistion-service.service';
@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.scss'],
})
export class CreateAuctionComponent {
  formGroup!: FormGroup;
  @Input() PrId: number;
  @Input() type: string;
  @Input() prtraN_ID: number;
  @Input() remQty: number;
  @Input() isModel: boolean = false;
  inValidate: boolean = false;
  isLoading: boolean = false;
  isAuctionModelVisible: boolean = false


  constructor(
    public fb: FormBuilder,
    private prservice: PurchaseRequistionServiceService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
    public activeOffcanvas: NgbActiveOffcanvas,
    public activeModel: NgbActiveModal,
    private router: Router,
    private closeAllModel: NgbModal
  ) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      description: ['',[Validators.required]],
      type: ['REWAUC'],
      mode: ['Both'],
    });
  }

/**
 * This function creates an auction for a purchase request and navigates to the event dashboard upon
 * success.
 */
  createAuctionByPR() {
    this.isLoading = true;
    let values = this.formGroup.value;
    const payload: any = {
      pR_ID: this.PrId,
      type: values.type,
      eventName: values.name,
      eventDescription: values.description,
      eventColorCode: values.mode,
      remQty: this.remQty,
    };

    this.prservice.CreateAuctionByPR(payload).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonService.showToaster(
            'Auction created successfully',
            true
          );
          this.router.navigate(['/Event/EventDashboard'], {
            state: { EventId: result.data },
          });

          this.cdr.detectChanges();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
        }
        this.cancelButtonClick();
        // this.activeOffcanvas.dismiss();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

/**
 * The function checks if the form is valid and creates an auction based on the Pr or Prline.
 */
  formSubmitHandler() {
    this.inValidate =true
    if (!this.isLoading) {
      if (this.formGroup.valid) {
        if (this.type === 'PR') {
          this.createAuctionByPR();
        } else {
          this.createAuctionByPRLine();
        }
      }
    }
  }

/**
 * This function creates an auction based on a purchase request line and submits it to the server for
 * processing.
 */
  createAuctionByPRLine() {
    this.isLoading = true;
    let values = this.formGroup.value;
    const payload: any = {
      pR_ID: this.PrId,
      type: values.type,
      prtraN_ID: this.prtraN_ID,
      eventName: values.name,
      eventDescription: values.description,
      eventColorCode: values.mode,
    };

    this.prservice.CreateAuctionByPRLine(payload).subscribe({
      next: (result: any) => {
        /* Read more about isConfirmed, isDenied below */
        this.cancelButtonClick();
        if (result.success) {
          this.router.navigate(['/Event/EventDashboard'], {
            state: { EventId: result.data },
          });
          this.commonService.showToaster('Auction created successfully', true);
          this.closeAllModel.dismissAll();
        } else {
          this.commonService.showToaster(result.errorDetail, false);
          this.cancelButtonClick();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

 /**
  * The function handles the click event of a cancel button and closes a modal or offcanvas depending
  * on the value of a boolean variable.
  */
  cancelButtonClick() {
    this.isModel ? this.activeModel.close() : this.activeOffcanvas.close();
  }

  /**
   * This function checks if a specific control in a form group is invalid.
   * @param {string} controlName - a string representing the name of the form control that needs to be
   * validated.
   * @returns a boolean value. It checks if the control with the given controlName is invalid
   */
  getValidation(controlName: string) {
    let control: AbstractControl<any, any> | null =
      this.formGroup.get(controlName);
    return this.inValidate && control?.invalid;
  }
}
