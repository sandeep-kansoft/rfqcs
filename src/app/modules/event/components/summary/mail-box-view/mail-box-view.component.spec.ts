import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailBoxViewComponent } from './mail-box-view.component';

describe('MailBoxViewComponent', () => {
  let component: MailBoxViewComponent;
  let fixture: ComponentFixture<MailBoxViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailBoxViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailBoxViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
