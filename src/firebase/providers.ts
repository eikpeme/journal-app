import { AuthError, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { FirebaseAuth } from './config';
import { AuthParams } from '../store/auth';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async() => {
  try {
    const result = await signInWithPopup( FirebaseAuth, googleProvider );
    // const credentials = GoogleAuthProvider.credentialFromResult( result );
    const { uid, email, displayName, photoURL } = result.user;
    
    return {
      ok: true,
      uid,
      email,
      displayName,
      photoURL,
    }
  } catch( error ) {
    const authError = error as AuthError;
    const errorCode = authError.code;
    const errorMessage = authError.message;

    return {
      ok: false,
      errorCode,
      errorMessage,
    }
  }
}

export const registerUserWithEmailAndPassword = async({ displayName, email, password}: AuthParams) => {
  try {
    const resp = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
    const { uid, photoURL } = resp.user;
    console.log(resp);

    await updateProfile(FirebaseAuth.currentUser!, {
      displayName
    });

    return {
      ok: true,
      uid,
      photoURL,
      displayName,
      email,
      password,
    }
  } catch (error) {
    console.log(error);
    const authError = error as AuthError;
    return { ok: false, errorMessage: authError.message};
  }
}

export const signInUserWithEmailAndPassword = async({ email, password }: AuthParams) => {
  try {
    const resp = await signInWithEmailAndPassword(FirebaseAuth, email, password);
    const { uid, displayName, photoURL } = resp.user;

    return {
      ok: true,
      uid,
      displayName,
      email,
      photoURL,
      password,
    }

  } catch (error) {
    console.log(error);
    
    const authError = error as AuthError;
    return {
      ok: false,
      errorMessage: authError.message,
    }
  }
}

export const signOutUser = async() => {
  try {
    await signOut( FirebaseAuth );
    return {
      ok: true,
    }
  } catch (error) {
    const authError = error as AuthError;
    return {
      ok: false,
      messageError: authError.message,
    }
  }
}
