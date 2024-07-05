import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFileuploadComponent } from './chat.fileupload.component';

describe('ChatFileuploadComponent', () => {
  let component: ChatFileuploadComponent;
  let fixture: ComponentFixture<ChatFileuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatFileuploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatFileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
