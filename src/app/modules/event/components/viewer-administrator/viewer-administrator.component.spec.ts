import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerAdministratorComponent } from './viewer-administrator.component';

describe('ViewerAdministratorComponent', () => {
  let component: ViewerAdministratorComponent;
  let fixture: ComponentFixture<ViewerAdministratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerAdministratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
