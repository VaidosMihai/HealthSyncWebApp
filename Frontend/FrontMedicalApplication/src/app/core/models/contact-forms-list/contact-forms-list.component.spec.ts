import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFormsListComponent } from './contact-forms-list.component';

describe('ContactFormsListComponent', () => {
  let component: ContactFormsListComponent;
  let fixture: ComponentFixture<ContactFormsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactFormsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
