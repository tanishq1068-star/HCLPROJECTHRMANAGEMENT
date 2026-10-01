import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddJobOpening } from './add-job-opening';

describe('AddJobOpening', () => {
  let component: AddJobOpening;
  let fixture: ComponentFixture<AddJobOpening>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddJobOpening],
    }).compileComponents();

    fixture = TestBed.createComponent(AddJobOpening);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
