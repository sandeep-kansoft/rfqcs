import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAwardCsComponent } from './my-award-cs.component';

describe('MyAwardCsComponent', () => {
  let component: MyAwardCsComponent;
  let fixture: ComponentFixture<MyAwardCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAwardCsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAwardCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
