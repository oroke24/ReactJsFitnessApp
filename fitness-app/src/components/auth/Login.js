import React, { useState } from 'react';
import auth, { login, register, forgotPassword } from '../../firebase/firebaseAuth';

const Login = ({ onmessage, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () =>{
        try{
            await register(email, password);
        }catch(error){
            console.error("Error Registering");
        }
    };
    const handleLogin = async () => {
       try{
            await login(email, password);
            onmessage('Logged in successfully');
            onClose();
       } catch (error){
        onmessage(error.message);
       }
    };
    const handleForgotPassword = async () => {
        try{
            await forgotPassword(email);
       }catch(error){
            console.error("Error Resetting password.")
       }
    };
    return(
        <div className='flex-auto'>
            <h3>Login/Register</h3>
            {/*Input Area*/}
            <div className='mt-3 flex justify-center'>
            <input
                className='w-full'
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className='w-full'
                type='password'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            {/*Button Area*/}
            <div className='flex justify-center'>
            <button className='w-full p-3 mt-2'
                onClick={handleLogin}>
                    Login
            </button>
            </div>
            <div className='flex mt-3 justify-center'>
                <button onClick={handleRegister}>Register these credentials?</button>
            </div>
            <div className='flex mt-3 justify-center'>
                <button onClick={handleForgotPassword}>Forgot Password?</button>
            </div>
        </div>
    );
};
export default Login;