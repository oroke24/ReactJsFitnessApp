import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import auth from '../lib/firebase/firebaseAuth';

export default function useAuthStatus() {
  const [user, setUser] = useState<User | null>(null);
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
