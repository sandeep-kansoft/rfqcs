import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAllCsComponent } from './admin-all-cs.component';

describe('AdminAllCsComponent', () => {
  let component: AdminAllCsComponent;
  let fixture: ComponentFixture<AdminAllCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAllCsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAllCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
