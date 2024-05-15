import { Component, OnInit } from '@angular/core';

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
  styleUrl: './contactinfo.component.css'
})
export class ContactinfoComponent implements OnInit {
  locations = [
    { title: 'Bucharest', description: 'The capital of Romania' },
    { title: 'Cluj Napoca', description: 'Known for its universities' },
    { title: 'Timisoara', description: 'Cultural hub in western Romania' },
    { title: 'Brasov', description: 'Surrounded by the Carpathian Mountains' },
    { title: 'Constanta', description: 'Major port city on the Black Sea' },
    { title: 'Miercurea Ciuc', description: 'Located in eastern Transylvania' },
    { title: 'Satu Mare', description: 'City near the Hungarian border' },
    { title: 'Iasi', description: 'Known for its cultural heritage' },
    { title: 'Craiova', description: 'Economic center in southwestern Romania' }
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

  constructor() { }

  ngOnInit(): void { }

  onSubmit(): void {
    console.log('Form Data:', this.contactForm);
    alert('Your contact information has been submitted successfully!');
    // Implement form submission logic here, e.g., send the data to a backend server
  }
}