import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionOrientationComponent } from './gestion-orientation.component';

describe('GestionOrientationComponent', () => {
  let component: GestionOrientationComponent;
  let fixture: ComponentFixture<GestionOrientationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionOrientationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionOrientationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
