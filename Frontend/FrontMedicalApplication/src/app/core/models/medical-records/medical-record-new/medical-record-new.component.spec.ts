import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordNewComponent } from './medical-record-new.component';

describe('MedicalRecordNewComponent', () => {
  let component: MedicalRecordNewComponent;
  let fixture: ComponentFixture<MedicalRecordNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicalRecordNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
