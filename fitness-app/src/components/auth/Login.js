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
    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
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
            <h3 className='text-center'>Login/Register</h3>
            {/* Form (wrap inputs and login for best browser security/auto-fill) */}
            <form className='w-full mt-3' onSubmit={handleSubmit}>
                {/*Input Area*/}
                <div className='w-full flex flex-col items-center gap-2'>
                    <input
                        className='w-3/4'
                        id='email'
                        name='email'
                        type='email'
                        inputMode='email'
                        autoComplete='email'
                        autoCapitalize='none'
                        autoCorrect='off'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className='w-3/4'
                        id='password'
                        name='password'
                        type='password'
                        autoComplete='current-password'
                        autoCapitalize='none'
                        autoCorrect='off'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {/*Button Area*/}
                <div className='flex justify-center'>
                    <button className='w-3/4 p-3 mt-2' type='submit'>
                        Login
                    </button>
                </div>
            </form>
            <div className='flex mt-3 justify-center'>
                <button type='button' onClick={handleRegister}>Register these credentials?</button>
            </div>
            <div className='flex mt-3 justify-center'>
                <button type='button' onClick={handleForgotPassword}>Forgot Password?</button>
            </div>
        </div>
    );
};
export default Login;