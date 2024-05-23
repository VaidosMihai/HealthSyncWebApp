import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification-service.service';
import { HttpErrorResponse } from '@angular/common/http';

interface ContactForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  comments: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

@Component({
  selector: 'app-contactinfo',
  templateUrl: './contactinfo.component.html',
  styleUrls: ['./contactinfo.component.css']
})
export class ContactinfoComponent implements OnInit {
  locations = [
    { title: 'Bucharest', description: 'Strada Lipscani, Nr. 27, Bucharest' },
    { title: 'Cluj Napoca', description: 'Bulevardul Eroilor, Nr. 21, Cluj Napoca' },
    { title: 'Timisoara', description: 'Piața Victoriei, Nr. 3, Timisoara' },
    { title: 'Brasov', description: 'Strada Republicii, Nr. 12, Brasov' },
    { title: 'Constanta', description: 'Bulevardul Tomis, Nr. 5, Constanta' },
    { title: 'Miercurea Ciuc', description: 'Strada Petőfi Sándor, Nr. 1, Miercurea Ciuc' },
    { title: 'Satu Mare', description: 'Strada Ștefan cel Mare, Nr. 4, Satu Mare' },
    { title: 'Iasi', description: 'Bulevardul Ștefan cel Mare, Nr. 10, Iasi' },
    { title: 'Craiova', description: 'Calea Unirii, Nr. 15, Craiova' }
  ];

  contactForm: ContactForm = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    comments: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  };

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void { }

  onSubmit(): void {
    console.log('Form Data:', this.contactForm);
    this.notificationService.sendEmail(
      this.contactForm.email, 
      'Contact Form Submission', 
      'Thank you for contacting us!'
    ).subscribe(
      response => {
        console.log('Email sent successfully', response);
        alert('Your contact information has been submitted successfully!');
      },
      (error: HttpErrorResponse) => {
        console.error('Error sending email', error);
        alert('There was an error submitting your contact information. Please try again.');
      }
    );
  }
}
