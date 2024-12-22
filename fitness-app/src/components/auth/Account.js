import React, { useState } from 'react';
import { logout } from '../../firebase/firebaseAuth';

const Account = ({ onmessage, auth, onClose }) => {

    const handleLogout = async () => {
       try{
            onmessage(`Logged in as ${auth.currentUser.email}`);
            onClose();
            logout(auth);
       } catch (error){
        onmessage(error.message);
       }
    };

    return(
        <div>
            <h3>Account</h3>
            <p
            >
                Logged in as {auth.currentUser.email}
            </p>
                
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};
export default Account;
