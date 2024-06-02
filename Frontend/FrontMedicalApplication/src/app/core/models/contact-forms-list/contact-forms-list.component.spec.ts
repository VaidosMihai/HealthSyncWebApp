import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactFormsListComponent } from './contact-forms-list.component';
import { NotificationService } from '../../services/notification-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('ContactFormsListComponent', () => {
  let component: ContactFormsListComponent;
  let fixture: ComponentFixture<ContactFormsListComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['getContactForms', 'deleteContactForm']);

    await TestBed.configureTestingModule({
      declarations: [ContactFormsListComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    fixture = TestBed.createComponent(ContactFormsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contact forms on init', () => {
    const contactForms = [{ id: 1, firstName: 'John', lastName: 'Doe', phone: '1234567890', email: 'john.doe@example.com', dob: new Date(), comments: 'Test comment', agreeTerms: true, agreePrivacy: true, agreeMarketing: false, submissionDate: new Date() }];
    notificationService.getContactForms.and.returnValue(of(contactForms));

    component.ngOnInit();

    expect(component.contactForms).toEqual(contactForms);
  });

  it('should handle error while loading contact forms', () => {
    spyOn(console, 'error');
    notificationService.getContactForms.and.returnValue(throwError('Error loading contact forms'));

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching contact forms', 'Error loading contact forms');
  });

  it('should toggle checked status', () => {
    const contactForm = { id: 1, firstName: 'John', lastName: 'Doe', phone: '1234567890', email: 'john.doe@example.com', dob: new Date(), comments: 'Test comment', agreeTerms: true, agreePrivacy: true, agreeMarketing: false, submissionDate: new Date(), checked: false };
    component.contactForms = [contactForm];

    component.toggleChecked(contactForm);

    expect(contactForm.checked).toBeTrue();
  });

  it('should delete contact form', () => {
    const contactForm = { id: 1, firstName: 'John', lastName: 'Doe', phone: '1234567890', email: 'john.doe@example.com', dob: new Date(), comments: 'Test comment', agreeTerms: true, agreePrivacy: true, agreeMarketing: false, submissionDate: new Date(), checked: false };
    component.contactForms = [contactForm];
    notificationService.deleteContactForm.and.returnValue(of());

    component.deleteForm(contactForm);

    expect(component.contactForms.length).toBe(0);
    expect(notificationService.deleteContactForm).toHaveBeenCalledWith(contactForm.id);
  });

  it('should handle error while deleting contact form', () => {
    spyOn(console, 'error');
    const contactForm = { id: 1, firstName: 'John', lastName: 'Doe', phone: '1234567890', email: 'john.doe@example.com', dob: new Date(), comments: 'Test comment', agreeTerms: true, agreePrivacy: true, agreeMarketing: false, submissionDate: new Date(), checked: false };
    component.contactForms = [contactForm];
    notificationService.deleteContactForm.and.returnValue(throwError('Error deleting contact form'));

    component.deleteForm(contactForm);

    expect(console.error).toHaveBeenCalledWith(`Error deleting form with id ${contactForm.id}`, 'Error deleting contact form');
  });
});
