import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  imports: [FormsModule,CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  ageLimit: any = [
    {
      title: 'under_13',
      value: 13,
    },
    {
      title: 'up_13',
      value: 14,
    },
  ];

  selectedInterest: string = '';

  interests:any = [
    { title: 'Development', value: 'interest_development' },
    { title: 'Design', value: 'interest_design' },
    { title: 'Business', value: 'interest_business' }
  ];

  userObj: any = {
    name: '',
    email: '',
    password: '',
    age: '',
    bio: '',
    jobRole: '',
    interest: [] as string[],

  };

  onCheckboxChange(event: any, value: string) {
    if (event.target.checked) {
      this.userObj.interest.push(value);
    } else {
      this.userObj.interest = this.userObj.interest.filter((item: string) => item !== value);
    }
  }

  submitForm() {
    console.log('Selected Interests:', this.userObj);
  }
}
