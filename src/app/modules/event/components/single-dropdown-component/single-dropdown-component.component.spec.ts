import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDropdownComponentComponent } from './single-dropdown-component.component';

describe('SingleDropdownComponentComponent', () => {
  let component: SingleDropdownComponentComponent;
  let fixture: ComponentFixture<SingleDropdownComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleDropdownComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleDropdownComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
