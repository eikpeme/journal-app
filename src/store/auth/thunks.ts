import { Action, ThunkAction } from '@reduxjs/toolkit';

import { checkingCredentials, login, logout } from '.'
import { RootState } from '..';
import { registerUserWithEmailAndPassword, signInUserWithEmailAndPassword, signInWithGoogle, signOutUser } from '../../firebase/providers';
import { clearNotesLogout } from '../journal/journalSlice';

export type AuthParams = {
  email: string;
  password: string;
  displayName?: string;
}

export const checkingAuthentication = (): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch) => {
    dispatch( checkingCredentials() );
  }
}

export const startGoogleSignIn = (): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch) => {
    dispatch( checkingCredentials() );
    const result = await signInWithGoogle();
    
    if ( !result.ok ) return dispatch( logout( result ) );

    dispatch( login( result ) )
  }
}

export const startCreatingUserWithEmailAndPassword = ({ displayName, email, password }: AuthParams): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch) => {
    dispatch(checkingCredentials());

    const { ok, uid, photoURL, errorMessage} = await registerUserWithEmailAndPassword({ displayName, email, password });

    if (!ok) return dispatch(logout({ errorMessage }));

    dispatch(login({ uid, displayName, email, photoURL }));
  }
}

export const startSignInUserWithEmailAndPassword = ({ email, password }:AuthParams): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async(dispatch) => {
    dispatch(checkingCredentials());
    const { ok, errorMessage } = await signInUserWithEmailAndPassword({ email, password });

    if (!ok) return dispatch(logout( { errorMessage } ));
  }
}

export const startSignOutUser = ():ThunkAction<void, RootState, unknown, Action<string>> => {
  return async(dispatch) => {
    await signOutUser();
    dispatch(clearNotesLogout());
    dispatch(logout({}));
  }
}
