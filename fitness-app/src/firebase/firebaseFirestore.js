import {getFirestore, collection, addDoc, getDocs, query, where} from 'firebase/firestore';
import app from './firebaseConfig';

const db = getFirestore(app);
/*
export const testAddDocument = async () =>{
    const dataObject = {
        email:'myNewEmail',
    }
    addDocument("users", dataObject);
}
*/
export const addDocument = async (collectionName, data) => {
    try{
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log("Doc written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding doc: ", e);
    }
};

export const getDocuments = async (collectionName) =>{
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
            
   // const querySnapshot = await getDocs(collection(db, collectionName));
   // return querySnapshot.docs.map(doc => doc.data());
};

export const queryDocuments = async (collectionName, field, value) => {
    const q = query(collection(db, collectionName), where(field, "==", value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
};

export default db;