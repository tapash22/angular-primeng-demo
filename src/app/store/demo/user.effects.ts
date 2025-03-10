import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../user.service'; 
import { loadUsers, loadUsersSuccess, addUser, addUserSuccess } from './user.actions';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),  // listen for loadUsers action
      switchMap(() => {
        console.log('Dispatching loadUsers action');
        return this.userService.getUsers().pipe(
          map((users) => {
            console.log('Users received:', users);
            return loadUsersSuccess({ users });
          })
        );
      })
    )
  );

  // Add User Effect
  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addUser),
      switchMap(({ user }) =>
        this.userService.addUser(user).pipe(map(newUser => addUserSuccess({ user: newUser })))
      )
    )
  );
}
