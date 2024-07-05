import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WonderLoaderComponent } from './wonder-loader.component';

describe('WonderLoaderComponent', () => {
  let component: WonderLoaderComponent;
  let fixture: ComponentFixture<WonderLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WonderLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WonderLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
