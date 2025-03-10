import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { User } from '../store/demo/user.model';
import { addUser } from '../store/demo/user.actions';

@Component({
  selector: 'app-user-form',
  imports: [NgIf, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  name = '';
  email = '';
  constructor(private store: Store) {}

  onSubmit() {
    const user: User = { id: Math.floor(Math.random() * 1000), name: this.name, email: this.email };
    this.store.dispatch(addUser({ user }));
    this.name = '';
    this.email = '';
  }
}
