import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-child',
  imports: [CommonModule,FormsModule],
  templateUrl: './child.component.html',
  styleUrl: './child.component.css'
})
export class ChildComponent {
  // private _message = '';

  // @Input() set message(value: string) {
  //   this._message = value.toUpperCase(); // Modify input value if needed
  // }

  // get message(): string {
  //   return this._message;
  // }
  formData = {
    name: '',
    password: ''
  };

  @Output() formSubmitted = new EventEmitter<{ name: string; password: string }>();

  submitForm() {
    console.log('Child Form Submitted:', this.formData);
    this.formSubmitted.emit(this.formData); // Send form data to parent
  }
}
