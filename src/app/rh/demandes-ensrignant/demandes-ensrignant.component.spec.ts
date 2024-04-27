import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesEnsrignantComponent } from './demandes-ensrignant.component';

describe('DemandesEnsrignantComponent', () => {
  let component: DemandesEnsrignantComponent;
  let fixture: ComponentFixture<DemandesEnsrignantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandesEnsrignantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandesEnsrignantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
