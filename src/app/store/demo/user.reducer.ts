import { createReducer, on } from '@ngrx/store';
import { User } from './user.model'; 
import { loadUsersSuccess, addUserSuccess } from './user.actions';

export interface UserState {
  users: User[];
}

export const initialState: UserState = {
  users: [],
};

export const userReducer = createReducer(
  initialState,
  on(loadUsersSuccess, (state, { users }) => ({ ...state, users })),
  on(addUserSuccess, (state, { user }) => ({ ...state, users: [...state.users, user] }))
);
