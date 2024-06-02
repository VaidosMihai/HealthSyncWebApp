import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification-service.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contactinfo',
  templateUrl: './contactinfo.component.html',
  styleUrls: ['./contactinfo.component.css']
})
export class ContactinfoComponent implements OnInit {
  contactForm: FormGroup;

  locations = [
    { title: 'Bucharest', description: 'Strada Lipscani, Nr. 27, Bucharest' },
    { title: 'Cluj Napoca', description: 'Bulevardul Eroilor, Nr. 21, Cluj Napoca' },
    { title: 'Timisoara', description: 'Piața Victoriei, Nr. 3, Timisoara' },
    { title: 'Brasov', description: 'Strada Republicii, Nr. 12, Brasov' },
    { title: 'Miercurea Ciuc', description: 'Strada Petőfi Sándor, Nr. 1, Miercurea Ciuc' },
  ];

  constructor(private fb: FormBuilder, private notificationService: NotificationService) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z]*$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      comments: [''],
      agreeTerms: [false, Validators.requiredTrue],
      agreePrivacy: [false, Validators.requiredTrue],
      agreeMarketing: [false]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const formValues = this.contactForm.value;
      this.notificationService.sendEmail(formValues).subscribe(
        response => {
          console.log('Email sent successfully', response);
          alert('Your contact information has been submitted successfully!');
        },
        (error: HttpErrorResponse) => {
          console.error('Error sending email', error);
          alert('Your contact information has been submitted successfully!');
        }
      );
    } else {
      alert('Please correct the errors in the form.');
    }
  }
  
}
