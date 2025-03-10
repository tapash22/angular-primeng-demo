import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

// Feature selector
export const selectUserState = createFeatureSelector<UserState>('users');

// Selector for users
export const selectAllUsers = createSelector(selectUserState, (state) => state.users);
