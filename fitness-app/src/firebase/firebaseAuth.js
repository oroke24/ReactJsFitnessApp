import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail} from 'firebase/auth';
import app from './firebaseConfig';

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
                alert(`Verify Email First (Sending another link to ${email}`);
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

export const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
    .then (() => {
        alert(`check ${email} for verification link.`);
        sendEmailVerification(auth.currentUser)
        .then(()=>{
            const currentTime = new Date().getTime();
            lastVerificationTime = currentTime;
        })
        .catch((error)=>{console.error("Error sending verification link, ", error)});
        auth.signOut();
    })
    .catch((e)=>{
        alert(`${email} already used.`);
    });
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
        alert(`Error occured, email not recognized`)
        console.error("Error sending password reset email.");
    });
};

export default auth;