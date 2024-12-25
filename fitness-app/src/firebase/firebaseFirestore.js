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
export const updateDocument = async (collectionName, data) => {
    try{
        const path = `users/${auth?.currentUser.email}/${collectionName}`;
        const oldId = data.id;
        var docRef = doc(db, path, data.id);
        await deleteDoc(docRef);
        data.id = data.name;
        docRef = doc(db, path, data.id);

        await setDoc(docRef, data);
        alert(`Successfully updated ${oldId} to ${data.name}`);
    } catch (e) {
        console.error("Error adding doc: ", e);
    }
};
export const initializeUser = async (email) => {
    try{
        const guestRecipes = await getDocuments('users/guest/recipes');
        const guestExercises = await getDocuments('users/guest/exercises');

        guestRecipes.forEach((recipe)=>{
            console.log("users/guest/recipe: ", recipe);
            saveAsNew('recipes', recipe);
            //addToEmail('recipes', recipe, email);
        });
        guestExercises.forEach((exercise)=>{
            console.log("users/guest/exercise: ", exercise);
            saveAsNew('exercises', exercise);
            //addToEmail('exercise', exercise, email);
        });
        alert("all done initializing!");
    } catch (e) {
        console.error("Error adding doc: ", e);
    } finally {
    //auth.signOut();
    }
};
export const saveAsNew = async (collectionName, data) => {
    try{
        const path = `users/${auth?.currentUser?.email}/${collectionName}`;
        var q = query(collection(db, path), where("id", "==", data.name));
        var qSnapShot = await getDocs(q);

        if(!qSnapShot.empty){
            //console.log("qSnapShot is not empty", qSnapShot.docs );
            data.id = data.id + "+";
            data.name = data.name + "+";
        }
        await setDoc(doc(db, path, data.id), data);
        //alert(`Successfully added ${data.id}`);
        console.log("Doc written with ID: ", data.id);
    } catch (e) {
        //alert(`Error adding ${data.id}: ${e}`);
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