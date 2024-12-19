import React, { useState } from 'react';
import { login } from '../../firebase/firebaseAuth';

const Login = ({ onmessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
       try{
            await login(email, password);
            onmessage('Logged in successfully');
       } catch (error){
        onmessage(error.message);
       }
    };

    return(
        <div>
            <h3>Login</h3>
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
        </div>
    );
};
export default Login;