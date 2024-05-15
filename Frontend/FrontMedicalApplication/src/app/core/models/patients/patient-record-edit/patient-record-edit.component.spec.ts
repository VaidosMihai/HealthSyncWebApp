import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRecordEditComponent } from './patient-record-edit.component';

describe('PatientRecordEditComponent', () => {
  let component: PatientRecordEditComponent;
  let fixture: ComponentFixture<PatientRecordEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientRecordEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientRecordEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
