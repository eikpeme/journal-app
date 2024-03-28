import { PayloadAction } from '@reduxjs/toolkit';
import { authSlice, checkingCredentials, login, logout } from '../../../store/auth/authSlice';
import { authenticatedState, demoUser, initialState, notAuthenticatedState } from '../../fixtures/authFixture';

describe('Tests on authSlice', () => {
  test('should return the initialState and name it as auth', () => {
    expect(authSlice.name).toBe('auth');
    const state = authSlice.reducer(initialState, {} as PayloadAction);
    expect(state).toEqual(initialState);
  });

  test('should do the authentication', () => {
    const state = authSlice.reducer(initialState, login(demoUser));

    expect(state).toEqual(authenticatedState);
  });

  test('should do the logout without message', () => {
    const state = authSlice.reducer(authenticatedState, logout({errorMessage: ''}));

    expect(state).toEqual(notAuthenticatedState);
  });

  test('should do the logout with a message', () => {
    const errorMessage = 'something';

    const state = authSlice.reducer(authenticatedState, logout({ errorMessage }));

    expect(state).toEqual({...notAuthenticatedState, errorMessage})
  });

  test('should change the status to checking', () => {
    const state = authSlice.reducer(authenticatedState, checkingCredentials());

    expect(state.status).toBe('checking');
  });
});