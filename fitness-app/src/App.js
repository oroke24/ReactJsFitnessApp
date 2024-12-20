import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/auth/Login';
import StandardModal from './components/containers/StandardModal';

function App() {
  //Binding///////////////////////////////////////////////////////
  //const [message, setMessage] = useState('');


  //Exporting////////////////////////////////////////////////////
  return (
    <div className="flex flex-col items-center justify-normal min-h-screen bg-zinc-800" >
      <h1 className="text-neutral-100">Completed:</h1>
      <h1 className="text-neutral-100">Login, Registration, Modal</h1>
      <h1 className="text-4xl font-bold text-neutral-100">Testing Firestore</h1>
        {/* Test Area*/} 
        {/* Current Test - Firestore*/} 



        {/* End Test Area*/} 
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

/* Testing Modal 
  //Binding...
  //const [isModalOpen, setModalOpen] = useState(false);
  //const handleOpenModal = () => setModalOpen(true);
  //const handleCloseModal = () => setModalOpen(false);

      //Exporting
      <button onClick={handleOpenModal}> Test Button </button>
      <StandardModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="text-center">
          <h3 className="text-xl font-semibold">Modal Content</h3>
          <p className="text-gray-600 mt-4">You can put anything here</p>
          <button
          onClick={handleCloseModal}
          >
            close
          </button>
        </div>
      </StandardModal>
    */

   /* Testing Login
        <Login onmessage={setMessage} /> 
   */