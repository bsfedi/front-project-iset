import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeRattrapageComponent } from './demande-rattrapage.component';

describe('DemandeRattrapageComponent', () => {
  let component: DemandeRattrapageComponent;
  let fixture: ComponentFixture<DemandeRattrapageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeRattrapageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeRattrapageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
