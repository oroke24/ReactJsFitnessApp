// useAuthStatus.js
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '../firebase/firebaseAuth';

export default function useAuthStatus() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, authLoading };
}
