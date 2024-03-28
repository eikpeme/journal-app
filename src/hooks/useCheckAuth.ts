import { useCallback, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { FirebaseAuth } from "../firebase/config";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login, logout } from "../store/auth";
import { startLoadingNotes } from "../store/journal/thunks";

export const useCheckAuth = () => {
  console.log("in here");
  const { status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const validate = useCallback(() => {
    onAuthStateChanged(FirebaseAuth, async (user) => {
      if (status === "authenticated") {
        if (!user) return;
        return dispatch(startLoadingNotes());
      }

      if (status === "checking") {
        if (!user) return dispatch(logout({}));

        const { uid, displayName, email, photoURL } = user!;
        return dispatch(login({ uid, displayName, email, photoURL }));
      }
    });
  }, [dispatch, status]);

  useEffect(() => {
    validate();
  }, [validate]);

  return {
    status,
  };
};
