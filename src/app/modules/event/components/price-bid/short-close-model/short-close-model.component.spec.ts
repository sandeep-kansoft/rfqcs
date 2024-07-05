import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortCloseModelComponent } from './short-close-model.component';

describe('ShortCloseModelComponent', () => {
  let component: ShortCloseModelComponent;
  let fixture: ComponentFixture<ShortCloseModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortCloseModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortCloseModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
