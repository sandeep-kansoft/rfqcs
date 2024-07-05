import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegretModelComponent } from './regret-model.component';

describe('RegretModelComponent', () => {
  let component: RegretModelComponent;
  let fixture: ComponentFixture<RegretModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegretModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegretModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
