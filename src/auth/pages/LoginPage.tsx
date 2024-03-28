import { FormEvent, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Google } from '@mui/icons-material'
import { Alert, Button, Grid, Link, TextField, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useForm } from '../../hooks';
import { AuthLayout } from '../layout/AuthLayout';
import { startGoogleSignIn, startSignInUserWithEmailAndPassword } from '../../store/auth';
import { FormData, formValidations } from '.';

const formData: FormData = {
  email: 'cristian@gmail.com',
  password: '123123',
}

const loginFormValidations = {
  email: formValidations.email,
  password: formValidations.password,
}

export const LoginPage = () => {

  const { status, errorMessage } = useAppSelector( state => state.auth );
  const dispatch = useAppDispatch();

  const {
    email, password, onInputChange, isFormValid,
    emailValid, passwordValid
  } = useForm(formData, loginFormValidations);

  const isAuthenticating = useMemo(() => status === 'checking', [status]);

  const onSubmit = ( event: FormEvent<HTMLFormElement> ) => {
    event.preventDefault();

    if (!isFormValid) return;

    dispatch(startSignInUserWithEmailAndPassword({ email, password }));
  }

  const onGoogleSignIn = () => {
    dispatch( startGoogleSignIn() );
  }

  return (
    <AuthLayout title='Login'>
      <form aria-label='submitForm' onSubmit={ onSubmit } className='animate__animated animate__fadeIn animate__faster'>
        <Grid container>
          <Grid item xs={ 12 } sx={{ mt: 2 }}>
            <TextField
              label='Email'
              type='email'
              placeholder='email@example.com'
              fullWidth
              autoComplete='email'
              name='email'
              value={ email }
              onChange={ onInputChange }
              error={ !!emailValid }
              helperText={ emailValid }
            />
          </Grid>
          <Grid item xs={ 12 } sx={{ mt: 2 }}>
            <TextField
              label='Password'
              type='password'
              placeholder='Password'
              fullWidth
              autoComplete='current-password'
              name='password'
              value={ password }
              onChange={ onInputChange }
              error={ !!passwordValid }
              helperText={ passwordValid }
              inputProps={{
                'data-testid': 'password'
              }}
            />
          </Grid>
          <Grid item sx={{ mb: 2, mt: 1 }} display={ errorMessage ? '' : 'none' } xs={ 12 }>
            <Alert severity='error'>
              { errorMessage }
            </Alert>
          </Grid>
          <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={ 12 } sm={ 6 }>
              <Button type='submit' variant='contained' fullWidth disabled={ isAuthenticating }>
                Login
              </Button>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <Button
                onClick={ onGoogleSignIn }
                variant='contained'
                fullWidth
                disabled={ isAuthenticating }
                aria-label='google-btn'
              >
                <Google />
                <Typography sx={{ ml: 1 }}>Google</Typography>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction='row' justifyContent='end'>
            <Link component={ RouterLink } color='inherit' to='/auth/register'>
              Create new account
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  )
}

