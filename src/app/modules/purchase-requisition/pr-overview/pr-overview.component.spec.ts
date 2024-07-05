import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrOverviewComponent } from './pr-overview.component';



describe('PrOverviewComponent', () => {
  let component: PrOverviewComponent;
  let fixture: ComponentFixture<PrOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
