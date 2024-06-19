import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheDesVoeuxComponent } from './fiche-des-voeux.component';

describe('FicheDesVoeuxComponent', () => {
  let component: FicheDesVoeuxComponent;
  let fixture: ComponentFixture<FicheDesVoeuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FicheDesVoeuxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FicheDesVoeuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
