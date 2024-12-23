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

      <h1 className="text-4xl font-bold text-neutral-100">FitnessApp</h1>
      <div className="row max-w-[80vh] text-center overflow-auto">
        <button className="recipe-button text-3xl m-5 p-10" onClick={handleOpenRecipeModal}>recipes </button>
        <button className="exercise-button text-3xl m-5 p-10" onClick={handleOpenExerciseModal}>exercises </button>
      </div>

      {/*Testing Modal*/}
      {/*End Testing Modal */}

      {/*Login Logic*/}
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
      {/*End Login Logic */}

      {/*Modals */}
      <StandardModal isOpen={isRecipeModalOpen} onClose={handleCloseRecipeModal}>
        <PrintMyRecipes path={userCollection} onClose={handleCloseRecipeModal}></PrintMyRecipes>
      </StandardModal>
      <StandardModal isOpen={isExerciseModalOpen} onClose={handleCloseExerciseModal}>
          <PrintMyExercises path={userCollection}></PrintMyExercises>
      </StandardModal>
      {/*End Modals */}

      <StandardModal></StandardModal>
    </div>
  );
}

export default App;