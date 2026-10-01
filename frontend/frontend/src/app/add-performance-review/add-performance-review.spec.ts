import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPerformanceReview } from './add-performance-review';

describe('AddPerformanceReview', () => {
  let component: AddPerformanceReview;
  let fixture: ComponentFixture<AddPerformanceReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPerformanceReview],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPerformanceReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
