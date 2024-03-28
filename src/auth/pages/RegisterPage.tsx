import { Link as RouterLink } from 'react-router-dom';
import { Alert, Button, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../layout/AuthLayout';
import { useForm } from '../../hooks';
import { FormEvent, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { startCreatingUserWithEmailAndPassword } from '../../store/auth';
import { FormData, formValidations } from '.';

const formData: FormData = {
  email: 'cristian@gmail.com',
  password: '123123',
  displayName: 'Cristian Ramirez',
}

export const RegisterPage = () => {

  const dispatch = useAppDispatch();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { status, errorMessage } = useAppSelector(state => state.auth);
  const isCheckingAuthentication = useMemo(() => status === 'checking', [status]);

  const {
    email, password, displayName, onInputChange,
    isFormValid, emailValid, passwordValid, displayNameValid
  } = useForm(formData, formValidations);
  
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitted(true);

    console.log(isFormValid);
    
    if ( !isFormValid ) return;

    console.log('dispatching');
    
    dispatch(startCreatingUserWithEmailAndPassword({ displayName, email, password }));
  }

  return (
    <AuthLayout title='Register'>
      <form onSubmit={ onSubmit } className='animate__animated animate__fadeIn animate__faster'>
        <Grid container>
          <Grid item xs={ 12 } sx={{ mt: 2 }}>
            <TextField
              label='Full Name'
              type='text'
              placeholder='Your Name'
              fullWidth
              name='displayName'
              value={ displayName }
              onChange={onInputChange }
              error={ !!displayNameValid && formSubmitted }
              helperText={ displayNameValid }
            />
          </Grid>
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
              error={ !!emailValid && formSubmitted }
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
              error={ !!passwordValid && formSubmitted }
              helperText={ passwordValid }
            />
          </Grid>
          <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={ 12 } display={ errorMessage ? '' : 'none'}>
              <Alert severity='error'>
                { errorMessage }
              </Alert>
            </Grid>
            <Grid item xs={ 12 }>
              <Button type='submit' variant='contained' fullWidth disabled={ isCheckingAuthentication }>
                Create Account
              </Button>
            </Grid>
          </Grid>
          <Grid container direction='row' justifyContent='end'>
            <Typography sx={{ mr: 1 }}>Have an account?</Typography>
            <Link component={ RouterLink } color='inherit' to='/auth/login'>
              Login
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  )
}

