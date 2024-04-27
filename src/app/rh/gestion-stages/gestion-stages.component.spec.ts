import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionStagesComponent } from './gestion-stages.component';

describe('GestionStagesComponent', () => {
  let component: GestionStagesComponent;
  let fixture: ComponentFixture<GestionStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionStagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
