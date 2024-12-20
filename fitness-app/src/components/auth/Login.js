import React, { useState } from 'react';
import { login } from '../../firebase/firebaseAuth';
import { register } from '../../firebase/firebaseAuth';

const Login = ({ onmessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //Binding//////////////////////////////////////////////////
    const handleLogin = async () => {
       try{
            await login(email, password);
            onmessage('Logged in successfully');
       } catch (error){
        onmessage(error.message);
       }
    };
    const handleRegister = async () => {
       try{
            await register(email, password);
            onmessage('Registered successfully');
       } catch (error){
        onmessage(error.message);
       }
    };

    //Exporting//////////////////////////////////////////////////
    return(
        <div>
            <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type='password'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};
export default Login;