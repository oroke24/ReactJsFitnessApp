import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAccount, logout } from '../../firebase/firebaseAuth';
import '../containers/loading.css'
import { deleteUser } from '../../firebase/firebaseFirestore';
import { clearDayDataManagerCache } from '../../firebase/singletonDayManager';

const Account = ({ onmessage, auth, onClose }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
       try{
            onmessage(`Logged in as ${auth.currentUser.email}`);
            clearDayDataManagerCache();
            onClose();
            logout(auth);
            window.location.reload();

       } catch (error){
        onmessage(error.message);
       }
    };
    const handleDeleteUser = async () =>{
        try{
            const confirmDelete = window.confirm("Delete account forever?");
            if(confirmDelete){
                setLoading(true);
                console.log("deleteUser, in firestore: ");
                await deleteUser();
                console.log("deleteAccount, in auth: ");
                deleteAccount();
                setLoading(false);
                //window.location.reload();
            }
        }catch(e){console.error('Error Deleting User: ', e)}
    }

    return(
        <div className='flex flex-col w-full overflow-y-auto'>
            {loading && (
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                </div>
            )}
            {/*Account info Div */}
            <div className='flex flex-col w-full items-center'>
                <h3 className='text-2xl'>Account</h3>
                <p>
                    Logged in as {auth.currentUser.email}
                </p>
                <button className='mt-10 text-3xl'
                onClick={handleLogout}>Logout</button>
                {/* Message me section */}
                <div className="mt-8 w-full max-w-md border border-gray-300 rounded-md p-4 flex flex-col items-center">
                    <p className="text-2xl mb-3">Message me</p>
                    <p className="text-center text-gray-300 mb-4">
                        Have feedback or need help? Send me an email and I’ll get back to you.
                    </p>
                    <a
                        href="mailto:fitcardshelp@gmail.com?subject=Fit%20Cards%20Support"
                        className="inline-flex items-center px-4 py-2 rounded-md font-bold"
                        style={{ backgroundColor: '#111827', color: '#ffffff', opacity: 0.95 }}
                    >
                        fitcardshelp@gmail
                    </a>
                </div>
                {/* Donate section */}
                <div className="mt-8 w-full max-w-md border border-gray-300 rounded-md p-4 flex flex-col items-center">
                    <p className="text-2xl mb-3">Want to donate?</p>
                    <p className="text-center text-gray-300 mb-4">
                        I made this app with one promise, no subscriptions, no fees — if you’d like to support it with a donation, I’d be grateful.
                    </p>
                    <a
                        href="https://buymeacoffee.com/fitcards"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-md font-bold"
                        style={{ backgroundColor: '#FFDD00', color: '#111827', opacity: 0.9 }}
                    >
                        ☕ Buy Me a Coffee
                    </a>
                </div>
            </div> 
            {/*Danger Zone Div */}
            <div className='mt-20 flex flex-col justify-center items-center'>
                <p className='text-red-500 text-center text-3xl'>Danger Zone</p>
                <button className='bg-red-500 mt-10'
                 onClick={()=>handleDeleteUser()}>Delete Account</button>
            </div>
        </div>
    );
};
export default Account;
