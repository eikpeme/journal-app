import { signInUserWithEmailAndPassword, signInWithGoogle, signOutUser, registerUserWithEmailAndPassword } from '../../../firebase/providers';
import { checkingCredentials, login, logout } from '../../../store/auth';
import { checkingAuthentication, startCreatingUserWithEmailAndPassword, startGoogleSignIn, startSignInUserWithEmailAndPassword, startSignOutUser } from '../../../store/auth/thunks';
import { clearNotesLogout } from '../../../store/journal/journalSlice';
import { demoUser, emptyUser } from '../../fixtures/authFixture';

vi.mock('../../../firebase/providers');

describe('Tests on thunks', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const extraArgument = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks()
  });

  test('should invoke checkingCredentials', async() => {
    checkingAuthentication()(dispatch, getState, extraArgument);
    
    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
  });

  describe('#startGoogleSignIn', () => {
    test('should call checkingCredentials and login', async() => {
      const loginData = { ok: true, ...demoUser }
      vi.mocked(signInWithGoogle).mockResolvedValue(loginData)

      await startGoogleSignIn()(dispatch, getState, extraArgument);
      
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
      expect(dispatch).toHaveBeenCalledWith(login(loginData));
    });

    test('should call checkingCredentials and logout', async() => {
      const errorMessage = 'Firebase error auth/credentials';
      const loginData = { ok: false, ...emptyUser, errorCode: 'XYZ', errorMessage };

      vi.mocked(signInWithGoogle).mockResolvedValue(loginData);

      await startGoogleSignIn()(dispatch, getState, extraArgument);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
      expect(dispatch).toHaveBeenCalledWith(logout(loginData));
    });
  });

  describe('#startLoginWithEmailAndPassword', () => {
    test('should call checkingCredentials and a successful login', async() => {
      const loginData = { ok: true, ...demoUser }

      vi.mocked(signInUserWithEmailAndPassword).mockResolvedValue(loginData);

      await startSignInUserWithEmailAndPassword({ email: demoUser.email, password: demoUser.password})(dispatch, getState, extraArgument);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    });

    test('should call checkingCredentials and logout', async() => {
      const errorMessage = 'Firebase error auth/credentials';
      const loginData = { ok: false, ...emptyUser, errorMessage }
      
      vi.mocked(signInUserWithEmailAndPassword).mockResolvedValue(loginData);

      await startSignInUserWithEmailAndPassword({ email: demoUser.email, password: demoUser.password })(dispatch, getState, extraArgument);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
      expect(dispatch).toHaveBeenCalledWith(logout({ errorMessage }));
    });
  });

  describe('#startSignOutUser', () => {
    test('should call signOutUser, clearNotesLogout and logout', async() => {
      await startSignOutUser()(dispatch, getState, extraArgument);
      
      expect(signOutUser).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith(clearNotesLogout());
      expect(dispatch).toHaveBeenCalledWith(logout({}));
    });
  });

  describe('#startCreatingUserWithEmailAndPassword', () => {
    test('should call checking credentials and login', async() => {
      const loginData = { ok: true, ...demoUser }
      const { uid, displayName, email, photoURL } = demoUser;
      const formData = { email: demoUser.email, password: demoUser.password, displayName: demoUser.displayName }

      vi.mocked(registerUserWithEmailAndPassword).mockResolvedValue(loginData);

      await startCreatingUserWithEmailAndPassword(formData)(dispatch, getState, extraArgument);

      expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
      expect(registerUserWithEmailAndPassword).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(login({uid, displayName, email, photoURL}));
    });

    test('should call checking credentials and logout', async() => {
      const errorMessage = 'Firebase error';
      const loginData = { ok: false, ...emptyUser, errorMessage }
      const formData = { email: demoUser.email, password: demoUser.password, displayName: demoUser.displayName }

      vi.mocked(registerUserWithEmailAndPassword).mockResolvedValue(loginData);

      await startCreatingUserWithEmailAndPassword(formData)(dispatch, getState, extraArgument);

      expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
      expect(registerUserWithEmailAndPassword).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(logout({ errorMessage }));
    });
  });
  
});
