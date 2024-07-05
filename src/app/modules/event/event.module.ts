import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RfqAuctionListComponent } from './rfq-auction-list/rfq-auction-list.component';
import { EventRoutingModule } from './event-routing.module';
import { ExcelModule, GridModule } from '@progress/kendo-angular-grid';
import {
  NgbActiveModal,
  NgbActiveOffcanvas,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventDashboardComponent } from './event-dashboard/event-dashboard.component';
import { SummaryComponent } from './components/summary/summary.component';
import { TechnicalComponent } from './components/technical/technical.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { PriceBidComponent } from './components/price-bid/price-bid.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { CollaborationComponent } from './components/collaboration/collaboration.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { PublishComponent } from './components/publish/publish.component';
import { CreatRfqAuctionComponent } from './creat-rfq-auction/creat-rfq-auction.component';
import { EventPrLinesComponent } from './event-pr-lines/event-pr-lines.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TechnicalParameterActionPopupComponent } from './components/technical/technical-parameter-action-popup/technical-parameter-action-popup.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { IntlModule } from '@progress/kendo-angular-intl';
//import { PrLinesDetailComponent } from './creat-rfq-auction/pr-lines-detail/pr-lines-detail.component';
import { SingleInputModalComponent } from './components/single-input-modal/single-input-modal.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PriceBidPopUpComponent } from './components/price-bid/price-bid-pop-up/price-bid-pop-up.component';
import { AddVendorsComponent } from './components/vendors/add-vendors/add-vendors.component';
import { TechnicalUploadDocumentComponent } from './components/technical/technical-upload-document/technical-upload-document.component';
import { TechnicalSelectTemplateComponent } from './components/technical/technical-select-template/technical-select-template.component';
import { PrLinesDetailComponent } from './creat-rfq-auction/pr-lines-detail/pr-lines-detail.component';
import { OtherChargesPopUpComponent } from './components/price-bid/other-charges-pop-up/other-charges-pop-up.component';
import { BuyerDocumentsComponent } from './components/buyer-documents/buyer-documents.component';
import { ViewCSComponent } from './components/view-cs/view-cs.component';
import { AddSubItemsComponent } from './components/price-bid/add-sub-items/add-sub-items.component';
import { AddManPowerItemComponent } from './components/price-bid/add-man-power-item/add-man-power-item.component';
import { BidOptimizationComponent } from './components/view-cs/bid-optimization/bid-optimization.component';
import { AddChargesComponent } from './components/view-cs/add-charges/add-charges.component';
import { CsApprovalMailComponent } from './components/view-cs/cs-approval-mail/cs-approval-mail.component';
import { ChatComponent } from './components/summary/chat/chat.component';
import { MailBoxComponent } from './components/summary/mail-box/mail-box.component';
import { ReasonModalComponent } from './components/reason-modal/reason-modal.component';
import { UserComponent } from './components/user/user.component';
import { CsApprovalComponent } from './components/cs-approval/cs-approval.component';
import { VendorChargesComponent } from './components/price-bid/vendor-charges/vendor-charges.component';
import { VendorChargesEditComponent } from './components/price-bid/vendor-charges/vendor-charges-edit/vendor-charges-edit.component';
import { TechnicalParameterVendorActionComponentComponent } from './components/technical/technical-parameter-vendor-action-component/technical-parameter-vendor-action-component.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { TermsAndConditionVendorDeviationComponent } from './components/terms-and-conditions/terms-and-condition-vendor-deviation/terms-and-condition-vendor-deviation.component';
import { TermsAndConditionDeviateReasonComponent } from './components/terms-and-conditions/terms-and-condition-deviate-reason/terms-and-condition-deviate-reason.component';
import { SubmitBidPopUpComponent } from './components/price-bid/vendor-charges/submit-bid-pop-up/submit-bid-pop-up.component';
import { MailBoxViewComponent } from './components/summary/mail-box-view/mail-box-view.component';
import { ChatFileuploadComponent } from './components/summary/chat.fileupload/chat.fileupload.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { PrModalComponent } from './components/summary/pr-modal/pr-modal.component';
import { SkuModalComponent } from './components/summary/sku-modal/sku-modal.component';
import { CsItemListPopupComponent } from './components/cs-item-list-popup/cs-item-list-popup.component';
import { BuyerDocumentUploadComponent } from './components/buyer-documents/buyer-document-upload/buyer-document-upload.component';
import { VendorAnalysisComponent } from './components/vendor-analysis/vendor-analysis.component';
import { CopyeventModalComponent } from './event-dashboard/copyevent-modal/copyevent-modal.component';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { MyAwardCsComponent } from './my-award-cs/my-award-cs.component';
// import { PreviewDocumentPopupComponent } from './components/preview-document-popup/preview-document-popup.component';

import { Select2Module } from 'ng-select2-component';
import { PreviewDocumentPopupComponent } from './components/preview-document-popup/preview-document-popup.component';
import { ViewAuctionComponent } from './components/view-auction/view-auction.component';
import { GoToAuctionComponent } from './components/go-to-auction/go-to-auction.component';
import { AuctionSettingFormComponent } from './components/view-auction/auction-setting-form/auction-setting-form.component';
import { VendorAnalysisLineItemInformationComponent } from './components/vendor-analysis/vendor-analysis-line-item-information/vendor-analysis-line-item-information.component';
import { VendorAnalysisHeaderInformationComponent } from './components/vendor-analysis/vendor-analysis-header-information/vendor-analysis-header-information.component';
import { TaxPopUpComponent } from './components/price-bid/vendor-charges/tax-pop-up/tax-pop-up.component';
import { NextRoundComponentPopUpComponent } from './next-round-component-pop-up/next-round-component-pop-up.component';
import { LineInformationComponent } from './components/line-information/line-information.component';
import { HeaderInformationComponent } from './components/header-information/header-information.component';
import { ChatDiscontinueComponent } from './components/summary/chat.discontinue/chat.discontinue.component';
import { PdfTabComponent } from './components/pdf-tab/pdf-tab.component';
import { InfoPopupComponent } from './components/price-bid/info-popup/info-popup.component';
import { CsApprovalUploadDocumentComponent } from './components/cs-approval/cs-approval-upload-document/cs-approval-upload-document.component';
import { ChatContinueComponentComponent } from './components/summary/chat.continue.component/chat.continue.component.component';
import { VendorAddSubItemsComponent } from './components/price-bid/vendor-charges/vendor-add-sub-items/vendor-add-sub-items.component';
import { ViewAuctionDetailsForVendorsComponent } from './components/view-auction/view-auction-details-for-vendors/view-auction-details-for-vendors.component';
import { SingleDropdownComponentComponent } from './components/single-dropdown-component/single-dropdown-component.component';
import { CsAppovalSubmitPopupComponent } from './components/cs-approval/cs-appoval-submit-popup/cs-appoval-submit-popup.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { PriceBidPoHistoryComponent } from './components/price-bid/price-bid-po-history/price-bid-po-history.component';
import { PdfTabLineInformationComponent } from './components/pdf-tab/pdf-tab-line-information/pdf-tab-line-information.component';
import { PdfTabHeaderInformationComponent } from './components/pdf-tab/pdf-tab-header-information/pdf-tab-header-information.component';
import { TransferBuyerComponent } from './components/collaboration/transfer-buyer/transfer-buyer.component';
import { CsLinesComponent } from './my-award-cs/cs-lines/cs-lines.component';
import { ShortCloseModelComponent } from './components/price-bid/short-close-model/short-close-model.component';
import { AddVendorEmailPopupComponent } from './components/vendors/add-vendor-email-popup/add-vendor-email-popup.component';
import { ReverseAuctionSettingsComponent } from './components/reverse-auction-settings/reverse-auction-settings.component';
import { RevereAuctionSettingsPopupComponent } from './components/reverse-auction-settings/revere-auction-settings-popup/revere-auction-settings-popup.component';
import { ReverseAuctionListComponent } from './reverse-auction-list/reverse-auction-list.component';
import { ViewerAdministratorComponent } from './components/viewer-administrator/viewer-administrator.component';
import { ViewerComponent } from './components/viewer-administrator/viewer/viewer.component';
import { AdminstratorComponent } from './components/viewer-administrator/adminstrator/adminstrator.component';
import { BrodcastComponent } from './components/view-auction/brodcast/brodcast.component';
import { ViewAuctionDisqualificationDetailsPopupComponent } from './components/view-auction/view-auction-disqualification-details-popup/view-auction-disqualification-details-popup.component';

import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
const components = [
  RfqAuctionListComponent,
  EventDashboardComponent,
  SummaryComponent,
  TechnicalComponent,
  TermsAndConditionsComponent,
  PriceBidComponent,
  VendorsComponent,
  CollaborationComponent,
  ScheduleComponent,
  PublishComponent,
  UserComponent,
  CreatRfqAuctionComponent,
  EventPrLinesComponent,
  TechnicalParameterActionPopupComponent,
  //PrLinesDetailComponent,
  SingleInputModalComponent,
  PriceBidPopUpComponent,
  PrLinesDetailComponent,
  SingleInputModalComponent,
  AddVendorsComponent,
  TechnicalUploadDocumentComponent,
  TechnicalSelectTemplateComponent,
  OtherChargesPopUpComponent,
  BuyerDocumentsComponent,
  ViewCSComponent,
  AddSubItemsComponent,
  AddManPowerItemComponent,
  BidOptimizationComponent,
  AddChargesComponent,
  CsApprovalMailComponent,
  ChatComponent,
  MailBoxComponent,
  ReasonModalComponent,
  CsApprovalComponent,
  VendorChargesComponent,
  VendorChargesEditComponent,
  TechnicalParameterVendorActionComponentComponent,

  TermsAndConditionVendorDeviationComponent,
  TermsAndConditionDeviateReasonComponent,
  SubmitBidPopUpComponent,
  CsItemListPopupComponent,
  PrModalComponent,
  SkuModalComponent,
  BuyerDocumentUploadComponent,
  VendorAnalysisComponent,
  CopyeventModalComponent,
  MyAwardCsComponent,
  PreviewDocumentPopupComponent,
  MailBoxViewComponent,
  ChatFileuploadComponent,
  GoToAuctionComponent,
  ViewAuctionComponent,
  AuctionSettingFormComponent,
  VendorAnalysisLineItemInformationComponent,
  VendorAnalysisHeaderInformationComponent,
  TaxPopUpComponent,
  NextRoundComponentPopUpComponent,
  LineInformationComponent,
  HeaderInformationComponent,
  PdfTabComponent,
  CsApprovalUploadDocumentComponent,
  ChatDiscontinueComponent,
  InfoPopupComponent,
  ChatContinueComponentComponent,
  VendorAddSubItemsComponent,
  ViewAuctionDetailsForVendorsComponent,
  SingleDropdownComponentComponent,
  CsAppovalSubmitPopupComponent, PriceBidPoHistoryComponent,
  PdfTabLineInformationComponent, PdfTabHeaderInformationComponent,
  TransferBuyerComponent, CsLinesComponent,ReverseAuctionSettingsComponent
];

@NgModule({
  declarations: [components, ShortCloseModelComponent, AddVendorEmailPopupComponent, RevereAuctionSettingsPopupComponent, ReverseAuctionListComponent, ViewerAdministratorComponent, ViewerComponent, AdminstratorComponent, BrodcastComponent, ViewAuctionDisqualificationDetailsPopupComponent ],
  imports: [
    CommonModule,
    EventRoutingModule,
    GridModule,
    InfiniteScrollModule,
    NgbModule,
    InlineSVGModule,
    ExcelModule,
    NgxSkeletonLoaderModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    DateInputsModule,
    FormsModule,
    InputsModule,
    LabelModule,
    IntlModule,
    GridModule,
    DropDownsModule,
    InlineSVGModule,
    CKEditorModule,
    NgxDropzoneModule,
    PDFExportModule,
    InfiniteScrollModule,
    Select2Module,
    ChartsModule,
    SharedDirectivesModule
  ],
  exports: [components],
  providers: [DatePipe, NgbActiveOffcanvas, NgbActiveModal],
})
export class EventModule { }
