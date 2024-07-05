import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRfqListComponent } from './admin-rfq-list.component';

describe('AdminRfqListComponent', () => {
  let component: AdminRfqListComponent;
  let fixture: ComponentFixture<AdminRfqListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRfqListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRfqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
