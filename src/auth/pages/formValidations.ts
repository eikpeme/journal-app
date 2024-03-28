import { FormValidations } from '../../hooks';

export type FormData = {
  email: string;
  password: string;
  displayName?: string;
}

export type FormDataValidations = {
  email: [() => boolean, string],
  password: [() => boolean, string],
  displayName: [() => boolean, string],
}

export const formValidations: FormValidations<FormDataValidations> = {
  email: [(value: string) => value.includes('@'), 'Email has to contain an @'],
  password: [(value: string) => value.length >= 6, 'Password lenght must be greater than 6 letters'],
  displayName: [(value: string) => value.length >= 1, 'Name is required'],
}
