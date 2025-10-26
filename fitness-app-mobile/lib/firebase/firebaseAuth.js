import app from './firebaseConfig';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser as deleteAuthUser,
} from 'firebase/auth';

// Use default React Native auth (in-memory persistence in Expo Go)
const auth = getAuth(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
};

// Delete the currently signed-in auth account
export const deleteAccount = async () => {
  try {
    if (!auth.currentUser) return;
    await deleteAuthUser(auth.currentUser);
  } catch (e) {
    console.error('Error deleting auth account:', e);
    throw e;
  }
};
export default auth;
