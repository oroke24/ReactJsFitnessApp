import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, deleteUser} from 'firebase/auth';
import app from './firebaseConfig';
import { initializeUser } from './firebaseFirestore';
import { collection, waitForPendingWrites } from 'firebase/firestore';

const auth = getAuth(app);
let lastVerificationTime = null;
const VERIFICATION_COOLDOWN = 60000; //1 minute

export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
    .then (()=>{
        if(!auth.currentUser.emailVerified){
            const currentTime = new Date().getTime();
            if(lastVerificationTime && currentTime -lastVerificationTime < VERIFICATION_COOLDOWN){
                alert(`Either accept email link or wait ${Math.floor((VERIFICATION_COOLDOWN - (currentTime - lastVerificationTime))/1000)} seconds to send another link`);
            }else{
                alert(`Verify Email First. Sending another link to ${email}`);
                sendEmailVerification(auth.currentUser)
                .then(()=>{
                    lastVerificationTime = currentTime;
                })
                .catch((error)=>{
                    console.error("Error sending verification email.", error);
                });
            }
            auth.signOut();
        }
        console.log("success signing ", email, " in.");
    })
    .catch((e)=>{
        alert(`Incorrect email/password combo!`);
        console.error("Error signing in, e: ", e);
    });
};

export const register = async (email, password) => {
    const create = await createUserWithEmailAndPassword(auth, email, password)
    .then (() => {
        alert(`check ${email} for verification link (might take a few minutes).`);
        sendEmailVerification(auth.currentUser)
        .then(()=>{
            const currentTime = new Date().getTime();
            lastVerificationTime = currentTime;
            initializeUser();
        })
        .catch((error)=>{console.error("Error sending verification link, ", error)});
    })
    .catch((e)=>{
        alert(`${email} already used.`);
    })
    return create;
};

export const logout = () => {
    return signOut(auth);
};

export const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
    .then(() =>{
        alert(`Password reset email sent to ${email} if it exists.`);
    })
    .catch((error) => {
        alert(`Error occured, email not recognized`);
        console.error("Error sending password reset email.");
    });
};
export const deleteAccount = async () => {
    try{
        console.log("in deleteAccount");
        await auth.currentUser.delete();
        alert("Goodbye for now!");
        await auth.signOut();
        window.location.reload();
    }catch(error){console.error("Error Deleting account: ", error)}
}

export default auth;