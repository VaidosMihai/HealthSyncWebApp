import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalRecordListComponent } from './medical-record-list.component';
import { MedicalRecordService } from '../../../services/medical-record.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('MedicalRecordListComponent', () => {
  let component: MedicalRecordListComponent;
  let fixture: ComponentFixture<MedicalRecordListComponent>;
  let medicalRecordService: jasmine.SpyObj<MedicalRecordService>;

  beforeEach(async () => {
    const medicalRecordServiceSpy = jasmine.createSpyObj('MedicalRecordService', ['getMedicalRecords']);

    await TestBed.configureTestingModule({
      declarations: [MedicalRecordListComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MedicalRecordService, useValue: medicalRecordServiceSpy }
      ]
    }).compileComponents();

    medicalRecordService = TestBed.inject(MedicalRecordService) as jasmine.SpyObj<MedicalRecordService>;

    fixture = TestBed.createComponent(MedicalRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medical records on init', () => {
    const medicalRecords = [{ medicalRecordId: 1, patientId: 1, appointmentId: 1, dateRecorded: new Date(), diagnosis: 'Test', notes: '' }];
    medicalRecordService.getMedicalRecords.and.returnValue(of(medicalRecords));

    component.ngOnInit();

    expect(component.medicalRecords).toEqual(medicalRecords);
  });

  it('should handle error while loading medical records', () => {
    spyOn(console, 'error');
    medicalRecordService.getMedicalRecords.and.returnValue(throwError('Error loading medical records'));

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading medical records', 'Error loading medical records');
  });
});
