import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MedicalRecordEditComponent } from './medical-record-edit.component';
import { MedicalRecordService } from '../../../services/medical-record.service';
import { MedicalRecordDto } from '../../../dtos/medical-record.dto';

describe('MedicalRecordEditComponent', () => {
  let component: MedicalRecordEditComponent;
  let fixture: ComponentFixture<MedicalRecordEditComponent>;
  let medicalRecordService: jasmine.SpyObj<MedicalRecordService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    medicalRecordService = jasmine.createSpyObj('MedicalRecordService', ['getMedicalRecordByAppointmentId', 'updateMedicalRecord', 'createMedicalRecord']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = {
      snapshot: {
        params: { appointmentId: 1 }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [MedicalRecordEditComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MedicalRecordService, useValue: medicalRecordService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        DatePipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values when appointmentId is provided', () => {
    const medicalRecord: MedicalRecordDto = {
      medicalRecordId: 1,
      patientId: 1,
      dateRecorded: new Date('2024-05-25T14:30:00'),
      diagnosis: 'Diagnosis',
      notes: 'Notes',
      appointmentId: 1
    };

    medicalRecordService.getMedicalRecordByAppointmentId.and.returnValue(of(medicalRecord));

    component.ngOnInit();

    expect(component.medicalRecordForm.value).toEqual({
      patientId: medicalRecord.patientId,
      date: '2024-05-25',
      time: '14:30',
      diagnosis: medicalRecord.diagnosis,
      notes: medicalRecord.notes
    });
    expect(component.medicalRecordId).toEqual(medicalRecord.medicalRecordId);
  });

  it('should call createMedicalRecord on submit when medicalRecordId is undefined', () => {
    component.medicalRecordId = undefined;
    component.medicalRecordForm.setValue({
      patientId: 1,
      date: '2024-05-25',
      time: '14:30',
      diagnosis: 'Diagnosis',
      notes: 'Notes'
    });

    const medicalRecordData: MedicalRecordDto = {
      patientId: 1,
      dateRecorded: new Date('2024-05-25T14:30:00'),
      diagnosis: 'Diagnosis',
      notes: 'Notes',
      appointmentId: 1,
      medicalRecordId: undefined
    };

    medicalRecordService.createMedicalRecord.and.returnValue(of(medicalRecordData));

    component.onSubmit();

    expect(medicalRecordService.createMedicalRecord).toHaveBeenCalledWith(medicalRecordData);
    expect(router.navigate).toHaveBeenCalledWith(['/medical-records']);
  });

  it('should call updateMedicalRecord on submit when medicalRecordId is defined', () => {
    component.medicalRecordId = 1;
    component.medicalRecordForm.setValue({
      patientId: 1,
      date: '2024-05-25',
      time: '14:30',
      diagnosis: 'Diagnosis',
      notes: 'Notes'
    });

    const medicalRecordData: MedicalRecordDto = {
      patientId: 1,
      dateRecorded: new Date('2024-05-25T14:30:00'),
      diagnosis: 'Diagnosis',
      notes: 'Notes',
      appointmentId: 1,
      medicalRecordId: 1
    };

    medicalRecordService.updateMedicalRecord.and.returnValue(of(medicalRecordData));

    component.onSubmit();

    expect(medicalRecordService.updateMedicalRecord).toHaveBeenCalledWith(1, medicalRecordData);
    expect(router.navigate).toHaveBeenCalledWith(['/medical-records']);
  });

  it('should handle error when fetching medical record', () => {
    spyOn(console, 'error');
    medicalRecordService.getMedicalRecordByAppointmentId.and.returnValue(throwError('Error fetching medical record'));

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching medical record:', 'Error fetching medical record');
  });

  it('should handle error when creating medical record', () => {
    spyOn(console, 'error');
    component.medicalRecordId = undefined;
    component.medicalRecordForm.setValue({
      patientId: 1,
      date: '2024-05-25',
      time: '14:30',
      diagnosis: 'Diagnosis',
      notes: 'Notes'
    });

    medicalRecordService.createMedicalRecord.and.returnValue(throwError('Error creating medical record'));

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error creating medical record:', 'Error creating medical record');
  });

  it('should handle error when updating medical record', () => {
    spyOn(console, 'error');
    component.medicalRecordId = 1;
    component.medicalRecordForm.setValue({
      patientId: 1,
      date: '2024-05-25',
      time: '14:30',
      diagnosis: 'Diagnosis',
      notes: 'Notes'
    });

    medicalRecordService.updateMedicalRecord.and.returnValue(throwError('Error updating medical record'));

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error updating medical record:', 'Error updating medical record');
  });

  it('should combine date and time correctly', () => {
    const date = '2024-05-25';
    const time = '14:30';
    const combinedDateTime = component.combineDateTime(date, time);
    expect(combinedDateTime).toEqual(new Date('2024-05-25T14:30:00'));
  });

  it('should split date and time correctly', () => {
    const dateTime = new Date('2024-05-25T14:30:00');
    const splitDateTime = component.splitDateTime(dateTime);
    expect(splitDateTime).toEqual({ date: '2024-05-25', time: '14:30' });
  });
});
