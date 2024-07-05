import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDetailPopComponent } from './po-detail-pop.component';

describe('PoDetailPopComponent', () => {
  let component: PoDetailPopComponent;
  let fixture: ComponentFixture<PoDetailPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoDetailPopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoDetailPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
