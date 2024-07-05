import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewEditorCrudComponent } from './overview-editor-crud.component';

describe('OverviewEditorCrudComponent', () => {
  let component: OverviewEditorCrudComponent;
  let fixture: ComponentFixture<OverviewEditorCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverviewEditorCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewEditorCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
