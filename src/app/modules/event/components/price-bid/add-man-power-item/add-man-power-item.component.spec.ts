import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManPowerItemComponent } from './add-man-power-item.component';

describe('AddManPowerItemComponent', () => {
  let component: AddManPowerItemComponent;
  let fixture: ComponentFixture<AddManPowerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddManPowerItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddManPowerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
