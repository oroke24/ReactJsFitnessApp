import React, { useState } from 'react';
import {FaUser} from 'react-icons/fa'
import './containers.css';
import Login from '../auth/Login';
import Account from '../auth/Account';
import PrintUsers from './PrintUsers';
import PrintMyRecipes from './PrintMyRecipes';
import StandardModal from './StandardModal';
import auth from '../../firebase/firebaseAuth';
import {testAddDocument} from '../../firebase/firebaseFirestore';
import PrintMyExercises from './PrintMyExercises';

const Home = () => {
    //BINDING///////////////////////////////////
    const userCollection = auth?.currentUser ? `users/${auth.currentUser.email}` : "users/guest";
    const [message, setMessage] = useState('Empty');
    const [isMainModalOpen, setMainModalOpen] = useState(false);
    const [isAccountModalOpen, setAccountModalOpen] = useState(false);
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

    //EXPORTING///////////////////////////////////
    return (
      <div>
        <div className="flex flex-col items-center justify-normal min-h-screen bg-zinc-800">
          {/*User Button */}
          <button className="absolute top-5 right-5 ">
            <FaUser
              className=" w-5 h-5 center fill-white"
              onClick={handleOpenAccountModal}
            ></FaUser>
          </button>

          <h1 className="text-4xl font-bold text-neutral-100">FitnessApp</h1>
          
          {/*Buttons Container*/}
          <div className="row w-[90vh] text-center overflow-auto">
            {/*Recipe Button*/}
            <button
              className="recipe-button text-3xl m-5 p-10"
              onClick={handleOpenRecipeModal}
            >
              recipes{" "}
            </button>
            {/*Exercise Button*/}
            <button
              className="exercise-button text-3xl m-5 p-10"
              onClick={handleOpenExerciseModal}
            >
              exercises{" "}
            </button>
          </div>
          {/*End Buttons*/}

          {/*Testing Modal*/}
          {/*End Testing Modal */}

          {/*Handle Login Logic*/}
          <StandardModal
            isOpen={isAccountModalOpen}
            onClose={handleCloseAccountModal}
          >
            {auth?.currentUser ? (
              <Account
                onmessage={setMessage}
                auth={auth}
                onClose={handleCloseAccountModal}
              ></Account>
            ) : (
              <Login
                onmessage={setMessage}
                onClose={handleCloseAccountModal}
              ></Login>
            )}
          </StandardModal>
          {/*End Handle Login Logic */}

          {/*Modals */}
          <StandardModal
            isOpen={isRecipeModalOpen}
            onClose={handleCloseRecipeModal}
          >
            {auth?.currentUser ? (
              <PrintMyRecipes path={userCollection}></PrintMyRecipes>
            ) : (
              <p>must be logged in.</p>
            )}
          </StandardModal>
          <StandardModal
            isOpen={isExerciseModalOpen}
            onClose={handleCloseExerciseModal}
          >
            {auth?.currentUser ? (
              <PrintMyExercises path={userCollection}></PrintMyExercises>
            ) : (
              <p>must be logged in.</p>
            )}
          </StandardModal>
          {/*End Modals */}

          <StandardModal></StandardModal>
        </div>
      </div>
    );
};

export default Home;
