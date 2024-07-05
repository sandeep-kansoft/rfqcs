import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewEditorComponent } from './overview-editor.component';

describe('OverviewEditorComponent', () => {
  let component: OverviewEditorComponent;
  let fixture: ComponentFixture<OverviewEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverviewEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
