import React, { useState } from 'react';
import {FaUser} from 'react-icons/fa'
import logo from './logo.svg';
import './App.css';
import Login from './components/auth/Login';
import Account from './components/auth/Account';
import StandardModal from './components/containers/StandardModal';
import auth from './firebase/firebaseAuth';

function App() {
  //Binding///////////////////////////////////////////////////////
  const [message, setMessage] = useState('');
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [isMainModalOpen, setMainModalOpen] = useState(false);


  const handleOpenAccountModal = () => setAccountModalOpen(true);
  const handleCloseAccountModal = () => setAccountModalOpen(false);

  const handleOpenMainModal = () => setMainModalOpen(true);
  const handleCloseMainModal = () => setMainModalOpen(false);

  //Exporting///////////////////////////////////////////////////////
  return (
    <div className="flex flex-col items-center justify-normal min-h-screen bg-zinc-800" >
      <FaUser className="absolute top-5 right-5 w-5 h-5 fill-white" onClick={handleOpenAccountModal}></FaUser>

      <h1 className="text-neutral-100">Completed:</h1>
      <h1 className="text-neutral-100">Login</h1>
      <h1 className="text-4xl font-bold text-neutral-100">Testing Modal</h1>
      <button
        onClick={handleOpenMainModal}
      >
        Test Modal
      </button>
      <StandardModal 
      isOpen={isAccountModalOpen} 
      onClose={handleCloseAccountModal}
      >
        {auth?.currentUser ? (
          <Account onmessage={setMessage} auth={auth} onClose={handleCloseAccountModal}></Account>
        ) : (
          <Login onmessage={setMessage} onClose={handleCloseAccountModal}></Login>
        )}
      </StandardModal>

      {/*Testing Modal */}
      <StandardModal isOpen={isMainModalOpen} onClose={handleCloseMainModal}>
          <button
          className="absolute top-0 right-0"
          onClick={handleCloseMainModal}
          >
            close
          </button>
        <div className="text-center">
          <h3 className="text-xl font-semibold">Modal Content</h3>
          <p className="text-gray-600 mt-4">You can put anything here</p>
        </div>
      </StandardModal>
      {/*End Modal */}

      {/* <Login onmessage={setMessage} /> */} 
      <StandardModal></StandardModal>
    </div>
  );
}

export default App;

/* //template code (comes with create-react-app)
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
*/