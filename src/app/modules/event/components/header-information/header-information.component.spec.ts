import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInformationComponent } from './header-information.component';

describe('HeaderInformationComponent', () => {
  let component: HeaderInformationComponent;
  let fixture: ComponentFixture<HeaderInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
