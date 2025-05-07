import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAccount, logout } from '../../firebase/firebaseAuth';
import '../containers/loading.css'
import { deleteUser } from '../../firebase/firebaseFirestore';

const Account = ({ onmessage, auth, onClose }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
       try{
            onmessage(`Logged in as ${auth.currentUser.email}`);
            onClose();
            logout(auth);
            window.location.reload();

       } catch (error){
        onmessage(error.message);
       }
    };
    const handleDeleteUser = async () =>{
        try{
            const confirmDelete = await window.confirm("Delete account forever?");
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
