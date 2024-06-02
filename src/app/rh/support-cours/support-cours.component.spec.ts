import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportCoursComponent } from './support-cours.component';

describe('SupportCoursComponent', () => {
  let component: SupportCoursComponent;
  let fixture: ComponentFixture<SupportCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportCoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
