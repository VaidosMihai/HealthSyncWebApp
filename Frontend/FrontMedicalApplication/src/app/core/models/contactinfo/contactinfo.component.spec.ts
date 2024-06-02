import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactinfoComponent } from './contactinfo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification-service.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContactinfoComponent', () => {
  let component: ContactinfoComponent;
  let fixture: ComponentFixture<ContactinfoComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['sendEmail']);

    await TestBed.configureTestingModule({
      declarations: [ContactinfoComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    fixture = TestBed.createComponent(ContactinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send email on form submit', () => {
    notificationService.sendEmail.and.returnValue(of({}));
    component.contactForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      dob: '1990-01-01',
      comments: 'Test comment',
      agreeTerms: true,
      agreePrivacy: true,
      agreeMarketing: false
    });

    component.onSubmit();

    expect(notificationService.sendEmail).toHaveBeenCalled();
  });

  it('should handle error on form submit', () => {
    spyOn(console, 'error');
    notificationService.sendEmail.and.returnValue(throwError('Error sending email'));
    component.contactForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      dob: '1990-01-01',
      comments: 'Test comment',
      agreeTerms: true,
      agreePrivacy: true,
      agreeMarketing: false
    });

    component.onSubmit();

    expect(console.error).toHaveBeenCalled();
  });

  it('should not submit invalid form', () => {
    spyOn(window, 'alert');
    component.contactForm.setValue({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dob: '',
      comments: '',
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Please correct the errors in the form.');
    expect(notificationService.sendEmail).not.toHaveBeenCalled();
  });
});
