import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../store/demo/user.model';
import { Store } from '@ngrx/store';
import { selectAllUsers } from '../store/demo/user.selectors';
import { loadUsers } from '../store/demo/user.actions';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  users$: Observable<User[]>;

  constructor(private store: Store) {
    this.users$ = this.store.select(selectAllUsers);
  }

  ngOnInit() {
    this.store.dispatch(loadUsers());
  }
}
