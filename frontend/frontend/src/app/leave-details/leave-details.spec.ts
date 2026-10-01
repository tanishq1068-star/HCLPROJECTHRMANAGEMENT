import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveDetails } from './leave-details';

describe('LeaveDetails', () => {
  let component: LeaveDetails;
  let fixture: ComponentFixture<LeaveDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
