import React, { useState } from 'react';
import {FaUser} from 'react-icons/fa'
import logo from './logo.svg';
import './App.css';
import Login from './components/auth/Login';
import Account from './components/auth/Account';
import PrintUsers from './components/containers/PrintUsers';
import PrintMyRecipes from './components/containers/PrintMyRecipes';
import StandardModal from './components/containers/StandardModal';
import auth from './firebase/firebaseAuth';
import {testAddDocument} from './firebase/firebaseFirestore';
import PrintMyExercises from './components/containers/PrintMyExercises';
function App() {
  //Binding///////////////////////////////////////////////////////
  const userCollection = auth?.currentUser ? `users/${auth.currentUser.email}` : "users/guest";
  const [message, setMessage] = useState('Empty');
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [isMainModalOpen, setMainModalOpen] = useState(false);
  const [isRecipeModalOpen, setRecipeModalOpen] = useState(false);
  const [isExerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [email, setEmail] = useState(auth?.currentUser?.email);

  const handleOpenAccountModal = () => setAccountModalOpen(true);
  const handleCloseAccountModal = () => setAccountModalOpen(false);
  const handleSetEmail = () => setEmail(auth?.currentUser?.email);
  const handleOpenMainModal = () => setMainModalOpen(true);
  const handleCloseMainModal = () => setMainModalOpen(false);
  const handleOpenRecipeModal = () => setRecipeModalOpen(true);
  const handleCloseRecipeModal = () => setRecipeModalOpen(false);
  const handleOpenExerciseModal = () => setExerciseModalOpen(true);
  const handleCloseExerciseModal = () => setExerciseModalOpen(false);

  //Exporting///////////////////////////////////////////////////////
  return (
    <div className="flex flex-col items-center justify-normal min-h-screen bg-zinc-800" >
      <button className="absolute top-5 right-5 "><FaUser className=" w-5 h-5 center fill-white" onClick={handleOpenAccountModal}></FaUser></button>

      <h1 className="text-neutral-100">Completed:</h1>
      <h1 className="text-neutral-100">Login, Registration, modals, addDoc, printUsers, printMyRecipes</h1>
      <h1 className="text-4xl font-bold text-neutral-100">Testing Modal</h1>
      <button className="recipe-button" onClick={handleOpenRecipeModal}>recipes </button>
      <button className="exercise-button" onClick={handleOpenExerciseModal}>exercises </button>
      {/*Handle Login Logic*/}
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
      {/*End Handle Login Logic */}

      {/*Testing Modal */}
      <StandardModal isOpen={isRecipeModalOpen} onClose={handleCloseRecipeModal}>
        {auth?.currentUser ? (
          <PrintMyRecipes path={userCollection}></PrintMyRecipes>
        ):(
          <p>must be logged in.</p>
        )}
      </StandardModal>
      <StandardModal isOpen={isExerciseModalOpen} onClose={handleCloseExerciseModal}>
        {auth?.currentUser ? (
          <PrintMyExercises path={userCollection}></PrintMyExercises>
        ):(
          <p>must be logged in.</p>
        )}
      </StandardModal>
      {/*End Testing Modal */}

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