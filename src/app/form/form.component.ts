import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCounter } from '../store/counter.selectors';
import { decrement, increment, reset } from '../store/counter.actions';

@Component({
  selector: 'app-form',
  imports: [FormsModule,CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  @Output() formSubmitted = new EventEmitter<any>(); 

  counter$ : Observable<number>

  constructor(private store: Store){
    this.counter$ = this.store.select(selectCounter)
  }

  increment() {
    this.store.dispatch(increment());
  }

  decrement() {
    this.store.dispatch(decrement());
  }

  reset() {
    this.store.dispatch(reset());
  }
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
    this.formSubmitted.emit(this.userObj);
  }
}
