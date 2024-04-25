import { ComponentFixture, TestBed } from '@angular/core/testing';

import { allStudentsComponent } from './all-consultants.component';

describe('allStudentsComponent', () => {
  let component: allStudentsComponent;
  let fixture: ComponentFixture<allStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [allStudentsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(allStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
