import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordEditComponent } from './medical-record-edit.component';

describe('MedicalRecordEditComponent', () => {
  let component: MedicalRecordEditComponent;
  let fixture: ComponentFixture<MedicalRecordEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicalRecordEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
