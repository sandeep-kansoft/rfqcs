import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSelectTemplateComponent } from './technical-select-template.component';

describe('TechnicalSelectTemplateComponent', () => {
  let component: TechnicalSelectTemplateComponent;
  let fixture: ComponentFixture<TechnicalSelectTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalSelectTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSelectTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
