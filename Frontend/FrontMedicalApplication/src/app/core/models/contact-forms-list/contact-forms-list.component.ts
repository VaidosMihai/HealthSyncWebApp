import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification-service.service';

interface ContactFormSubmission {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: Date;
  comments: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
  submissionDate: Date;
  checked?: boolean;
}

@Component({
  selector: 'app-contact-forms-list',
  templateUrl: './contact-forms-list.component.html',
  styleUrls: ['./contact-forms-list.component.css']
})
export class ContactFormsListComponent implements OnInit {
  contactForms: ContactFormSubmission[] = [];

  constructor(private http: HttpClient, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchContactForms();
  }

  fetchContactForms(): void {
    this.notificationService.getContactForms().subscribe(
      data => {
        this.contactForms = data;
        this.loadCheckedStatus();
      },
      error => console.error('Error fetching contact forms', error)
    );
  }

  toggleChecked(form: ContactFormSubmission): void {
    form.checked = !form.checked;
    this.saveCheckedStatus();
  }

  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  deleteForm(form: ContactFormSubmission): void {
    this.contactForms = this.contactForms.filter(f => f.id !== form.id);
    this.saveCheckedStatus();
    this.notificationService.deleteContactForm(form.id).subscribe(
      () => console.log(`Form with id ${form.id} deleted`),
      error => console.error(`Error deleting form with id ${form.id}`, error)
    );
  }

  saveCheckedStatus(): void {
    const checkedForms = this.contactForms.filter(form => form.checked);
    localStorage.setItem('checkedContactForms', JSON.stringify(checkedForms));
  }

  loadCheckedStatus(): void {
    const storedCheckedForms = localStorage.getItem('checkedContactForms');
    if (storedCheckedForms) {
      const checkedForms = JSON.parse(storedCheckedForms) as ContactFormSubmission[];
      this.contactForms.forEach(form => {
        const checkedForm = checkedForms.find(f => f.id === form.id);
        if (checkedForm) {
          form.checked = true;
        }
      });
    }
  }
}
