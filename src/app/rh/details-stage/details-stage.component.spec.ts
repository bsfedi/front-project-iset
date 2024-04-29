import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsStageComponent } from './details-stage.component';

describe('DetailsStageComponent', () => {
  let component: DetailsStageComponent;
  let fixture: ComponentFixture<DetailsStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsStageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
