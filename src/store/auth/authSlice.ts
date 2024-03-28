import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated';
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  errorMessage: string;
}

const initialState: AuthState = {
  status: 'checking',
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  errorMessage: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.status = 'authenticated';
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.photoURL = payload.photoURL;
      state.errorMessage = '';
    },
    logout: (state, { payload }) => {
      state.status = 'not-authenticated';
      state.uid = '';
      state.email = '';
      state.displayName = '';
      state.photoURL = '';
      state.errorMessage = payload.errorMessage;
    },
    checkingCredentials: (state) => {
      state.status = 'checking';
    }
  }
});
       
export const { login, logout, checkingCredentials } = authSlice.actions;
