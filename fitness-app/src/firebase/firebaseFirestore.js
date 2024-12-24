import {getFirestore, collection, addDoc, getDocs, query, where, doc, deleteDoc, getDoc, setDoc} from 'firebase/firestore';
import app from './firebaseConfig';
import auth from './firebaseAuth';
import { FaVrCardboard } from 'react-icons/fa';

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
export const addDocument2 = async (collectionName, data) => {
    try{
        const q = query(collection(db, collectionName), where("name", "==", data.name));
        const qSnapShot = await getDocs(q);

        var docRef = doc(collection(db, collectionName), data.name);
       // var docSnap = await getDoc(docRef);

        console.log(qSnapShot," === ", data.id );
        if(!qSnapShot.empty){
            data.id = data.id + "+";
            data.name = data.name + "+";
        }
        const path = `users/${auth?.currentUser.email}/${collectionName}`;
        await setDoc(doc(db, path, data.id), data);
        console.log("Doc written with ID: ", data.id);
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
export const deleteDocument = async (collectionName, documentName) => {
    try{
        if(!auth?.currentUser){
            console.log("user not authenticated.");
            return;
        }
        //console.log("Full path to document:", `users/${auth.currentUser.email}/${collectionName}/${documentName}`);

        const path = `users/${auth?.currentUser.email}/${collectionName}`;
        //console.log("path", path);
        const docRef = doc(db, path, documentName);
        //console.log("doc to delete: ", docRef);
        await deleteDoc(docRef);
        alert(`${documentName} successfully deleted!`);
        console.log(`Doc with id: "${documentName}" deleted successfully.`);
    }catch(error){
        console.error("Error Deleting Doc: ", error);
    }
};
export default db;