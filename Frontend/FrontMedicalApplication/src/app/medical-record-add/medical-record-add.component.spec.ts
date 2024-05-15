import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordAddComponent } from './medical-record-add.component';

describe('MedicalRecordAddComponent', () => {
  let component: MedicalRecordAddComponent;
  let fixture: ComponentFixture<MedicalRecordAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicalRecordAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
