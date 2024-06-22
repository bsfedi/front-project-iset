import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDemandesComponent } from './student-demandes.component';

describe('MissionsComponent', () => {
  let component: StudentDemandesComponent;
  let fixture: ComponentFixture<StudentDemandesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentDemandesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StudentDemandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
