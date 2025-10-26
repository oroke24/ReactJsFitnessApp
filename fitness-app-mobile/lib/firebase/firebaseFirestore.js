import { getFirestore, collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import app from './firebaseConfig';
import auth from './firebaseAuth';

// Export Firestore DB instance
const db = getFirestore(app);
export default db;

// Minimal cross-platform helpers
export const getDocuments = async (collectionPath) => {
  const snapshot = await getDocs(collection(db, collectionPath));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getDocumentIds = async (collectionPath) => {
  const snapshot = await getDocs(collection(db, collectionPath));
  return snapshot.docs.map((d) => d.id);
};

export const queryDocuments = async (collectionPath, field, value) => {
  const q = query(collection(db, collectionPath), where(field, '==', value));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((d) => d.data());
};

// Update or rename a document under the current user's collection to use data.name as the id
export const updateDocument = async (collectionName, data) => {
  try {
    const user = auth?.currentUser;
    if (!user?.email) {
      console.log('User not authenticated.');
      return;
    }
    const path = `users/${user.email}/${collectionName}`;
    const oldId = data.id;
    const targetId = data?.name || data?.id;
    if (!targetId) return;

    // If the id changed, delete the old doc first
    if (oldId && oldId !== targetId) {
      const oldRef = doc(db, path, oldId);
      try { await deleteDoc(oldRef); } catch (_) {}
    }

    data.id = targetId;
    const newRef = doc(db, path, targetId);
    await setDoc(newRef, data);
  } catch (e) {
    console.error('Error updating document:', e);
  }
};

// Initialize a new user's collections by copying from guest, mirroring the web
export const initializeUser = async () => {
  try {
    const user = auth?.currentUser;
    if (!user?.email) return;
    // Ensure a top-level user document exists like the web expects
    try {
      const userRef = doc(db, 'users', user.email);
      await setDoc(userRef, { email: user.email, createdAt: serverTimestamp() }, { merge: true });
    } catch (e) {
      console.error('Error creating top-level user doc:', e);
    }
    const guestRecipes = await getDocuments('users/guest/recipes');
    const guestExercises = await getDocuments('users/guest/exercises');

    for (const recipe of guestRecipes) {
      await updateDocument('recipes', recipe);
    }
    for (const exercise of guestExercises) {
      await updateDocument('exercises', exercise);
    }
  } catch (e) {
    console.error('Error initializing user data:', e);
  }
};

// Ensure the user's top-level doc exists; if not, initialize from guest
export const ensureUserInitialized = async () => {
  try {
    const user = auth?.currentUser;
    if (!user?.email) return;
    const userRef = doc(db, 'users', user.email);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await initializeUser();
    }
  } catch (e) {
    console.error('Error ensuring user is initialized:', e);
  }
};

// Delete a single document under the authenticated user's subcollection
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const user = auth?.currentUser;
    if (!user?.email) {
      console.log('User not authenticated.');
      return;
    }
    const path = `users/${user.email}/${collectionName}`;
    const ref = doc(db, path, documentId);
    await deleteDoc(ref);
    console.log(`Deleted ${collectionName}/${documentId}`);
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

// Delete all user-owned content and the user document, mirroring web behavior
export const deleteUser = async () => {
  try {
    const user = auth?.currentUser;
    if (!user?.email) {
      console.log('User is not authenticated');
      return false;
    }
    const userEmail = user.email;
    const collectionsToDelete = ['recipes', 'exercises'];
    for (const collectionName of collectionsToDelete) {
      const documents = await getDocuments(`users/${userEmail}/${collectionName}`);
      for (const d of documents) {
        await deleteDocument(collectionName, d.id);
      }
    }
    const userDocRef = doc(db, 'users', userEmail);
    await deleteDoc(userDocRef);
    return true;
  } catch (e) {
    console.error('Error deleting user data:', e);
    return false;
  }
};
