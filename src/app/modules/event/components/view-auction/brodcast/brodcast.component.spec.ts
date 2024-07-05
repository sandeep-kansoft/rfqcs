import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrodcastComponent } from './brodcast.component';

describe('BrodcastComponent', () => {
  let component: BrodcastComponent;
  let fixture: ComponentFixture<BrodcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrodcastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
