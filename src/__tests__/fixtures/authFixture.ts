import { AuthState } from '../../store/auth'

export const demoUser = {
  uid: '123123',
  email: 'cristian@gmail.com',
  displayName: 'Cristian',
  photoURL: 'https://demo.jpg',
  password: '123123',
}

export const emptyUser = {
  uid: undefined,
  email: undefined,
  displayName: undefined,
  photoURL: undefined,
}

export const initialState: AuthState = {
  status: 'checking',
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  errorMessage: '',
}

export const authenticatedState: AuthState = {
  status: 'authenticated',
  ...demoUser,
  errorMessage: '',
}

export const notAuthenticatedState: AuthState = {
  status: 'not-authenticated',
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  errorMessage: '',
}
