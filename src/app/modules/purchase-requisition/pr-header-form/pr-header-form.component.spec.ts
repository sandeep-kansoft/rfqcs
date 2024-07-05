import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrHeaderFormComponent } from './pr-header-form.component';

describe('PrHeaderFormComponent', () => {
  let component: PrHeaderFormComponent;
  let fixture: ComponentFixture<PrHeaderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrHeaderFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrHeaderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
