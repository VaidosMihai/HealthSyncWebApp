import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientListComponent } from './patient-record-list.component';

describe('PatientRecordListComponent', () => {
  let component: PatientListComponent;
  let fixture: ComponentFixture<PatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
