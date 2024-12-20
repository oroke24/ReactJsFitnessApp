import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import app from './firebaseConfig';

const auth = getAuth(app);

export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
    .then (()=>{
        alert(`Welcome ${email}!`);
        console.log("success signing ", email, " in.");
    })
    .catch((e)=>{
        alert(`Incorrect email/password combo!`);
        console.error("Error signing in, e: ", e);
    });
};

export const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
    .then (()=>{
        alert(`Welcome ${email}!`);
        console.log("success registering ", email, " in.");
    })
    .catch((e)=>{
        alert(`Incorrect email/password combo!`);
        console.error("Error signing in, e: ", e);
    });
};

export const logout = () => {
    return signOut(auth);
};

export default auth;