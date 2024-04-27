import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererSallesComponent } from './gerer-salles.component';

describe('GererSallesComponent', () => {
  let component: GererSallesComponent;
  let fixture: ComponentFixture<GererSallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GererSallesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GererSallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
