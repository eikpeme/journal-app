import { fireEvent, render, screen } from '@testing-library/react';
import { Dispatch, UnknownAction, configureStore } from '@reduxjs/toolkit';
import { Provider, UseDispatch } from 'react-redux';

import { LoginPage } from '../../../auth/pages/LoginPage';
import { authSlice } from '../../../store/auth/authSlice';
import { MemoryRouter } from 'react-router-dom';
import { notAuthenticatedState } from '../../fixtures/authFixture';
import { FormData } from '../../../auth/pages/formValidations';

const mockStartGoogleSignIn = vi.fn();
const mockStartSignInUserWithEmailAndPassword = vi.fn();

vi.mock('../../../store/auth/thunks', () => ({
  startGoogleSignIn: () => mockStartGoogleSignIn,
  startSignInUserWithEmailAndPassword: ({ email, password }: FormData) => {
    return () => mockStartSignInUserWithEmailAndPassword({ email, password});
  },
}));

vi.mock('react-redux', async(importOriginal) => {
  const module = await importOriginal<typeof import('react-redux')>();
  return {
    ...module,
    useDispatch: () => (fn: UseDispatch<Dispatch<UnknownAction>>) => fn()
  }
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  preloadedState: {
    auth: notAuthenticatedState
  },
});

describe('Tests on <LoginPage /> component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  })

  test('should show the component', () => {
    render(
      <Provider store={ store }>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByText('Login').length).toBeGreaterThanOrEqual(1);
  });

  describe('#onGoogleSignIn', () => {
    test('should call startGoogleSignIn', () => {
      render(
        <Provider store={ store }>
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </Provider>
      );

      const googleBtn = screen.getByLabelText('google-btn');
      fireEvent.click(googleBtn);

      expect(mockStartGoogleSignIn).toHaveBeenCalled();
    });
  });

  describe('#onSubmit', () => {
    test('should call startSignInUserWithEmailAndPassword', () => {
      const email = 'cristian@gmail.com';
      const password = 'abcabc';

      render(
        <Provider store={ store }>
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </Provider>
      );

      const emailField = screen.getByRole('textbox', { name: 'Email' });
      fireEvent.change(emailField, { target: { name: 'email', value: email } });

      const passwordField = screen.getByTestId('password');
      fireEvent.change(passwordField, { target: { name: 'password', value: password }});

      const loginForm = screen.getByLabelText('submitForm');
      fireEvent.submit(loginForm);

      expect(mockStartSignInUserWithEmailAndPassword).toHaveBeenCalledWith({
        email,
        password,
      });
    });
  });
});
