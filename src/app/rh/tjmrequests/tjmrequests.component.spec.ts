import { ComponentFixture, TestBed } from '@angular/core/testing';

import { tjmrequestsComponent } from './tjmrequests.component';

describe('tjmrequestsComponent', () => {
  let component: tjmrequestsComponent;
  let fixture: ComponentFixture<tjmrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [tjmrequestsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(tjmrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
