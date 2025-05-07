import React, { useState } from 'react';
import {FaBurn, FaCut, FaDumbbell, FaFire, FaGasPump, FaHollyBerry, FaStore, FaSubway, FaUser, FaUtensilSpoon} from 'react-icons/fa'
import './containers.css';
import Login from '../auth/Login';
import Account from '../auth/Account';
import PrintMyRecipes from './PrintMyRecipes';
import StandardModal from './StandardModal';
import auth from '../../firebase/firebaseAuth';
import PrintMyExercises from './PrintMyExercises';
import { initializeUser } from '../../firebase/firebaseFirestore';

const Home = () => {
    //BINDING///////////////////////////////////
    const userCollection = auth?.currentUser ? `users/${auth.currentUser.email}` : "users/guest";
    const [message, setMessage] = useState('Empty');
    const [isMainModalOpen, setMainModalOpen] = useState(false);
    const [isAccountModalOpen, setAccountModalOpen] = useState(false);
    const [isRecipeModalOpen, setRecipeModalOpen] = useState(false);
    const [isExerciseModalOpen, setExerciseModalOpen] = useState(false);
    const [isAboutUsModalOpen, setAboutUsModalOpen] = useState(false);
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
    const handleOpenAboutUsModal = () => setAboutUsModalOpen(true);
    const handleCloseAboutUsModal = () => setAboutUsModalOpen(false);

    //EXPORTING///////////////////////////////////
    return (
      <div>
        {/*Static Background*/}
        <div className='dark-light-gradient h-screen overflow-auto'>
        <div className="flex flex-col items-center justify-normal w-full min-h-screen overflow-y-auto">

          {/*Title */}
          <h1 className="mt-5 text-5xl font-bold text-neutral-100">Fit Cards</h1>
          
          {/*User Button */}
          <button className="mt-10 text-2xl flex items-center justify-center"
              onClick={handleOpenAccountModal}>
                {auth.currentUser//if logged in
                ?//show email
                auth.currentUser.email
                ://else say...
                "Login/Register"
                }
                <FaUser
                  className="text-6xl center fill-white">
                </FaUser>
          </button>
          {/*About Us Button */}
            <button
              className='mt-5'
              onClick={handleOpenAboutUsModal}
            >
              About Us
            </button>
            
          
          {/*Buttons Container*/}
          <div className=" mt-20 w-full text-center overflow-auto">
            {/*Recipe Button*/}
            <button
              className="recipe-button w-11/12 recipe-gradient m-5"
              onClick={handleOpenRecipeModal}
            >
              <div className='color-darkslategrey flex justify-between items-center text-4xl p-10' >
                <FaGasPump></FaGasPump>
                <strong>Recipes</strong>
                <FaUtensilSpoon></FaUtensilSpoon>
              </div>
            </button>
            {/*Exercise Button*/}
            <button
              className="exercise-button w-11/12 exercise-gradient m-5"
              onClick={handleOpenExerciseModal}
            >
              <div className='flex justify-between items-center text-4xl p-10'>
                <FaFire></FaFire>
                <strong>Exercises</strong>
                <FaDumbbell></FaDumbbell>
              </div>
            </button>
          {/*Coming Soon Section Buttons */}
          <div className='mt-10 color-white text-3xl'>
              <div className='text-opacity-50'>
                Coming Soon
              </div>
              <button className='bg-white opacity-80 bg-opacity-70 mt-5 w-11/12 p-10'>
                Calendar for scheduling routines
              </button>
              <button className='bg-white opacity-60 bg-opacity-60 mt-5 w-11/12 p-10'>
                A 7 day meal/routine forecast
              </button>
              <button className='bg-white opacity-30 bg-opacity-40 mt-5 w-11/12 p-10'>
                Friends and card sharing
              </button>
              <button className='bg-white opacity-30 bg-opacity-20 mt-5 w-11/12 p-10'>
                 Customizeable Card preview styles
              </button>
            </div>
          </div>
          </div>

          {/*End Buttons*/}

          {/*Testing Modal*/}
          {/*End Testing Modal */}

          {/*Modals */}

          {/*Login modal*/}
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

          {/*recipes modal */}
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

          {/*exercises modal */}
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

          {/*About us modal */}
          <StandardModal
            isOpen={isAboutUsModalOpen}
            onClose={handleCloseAboutUsModal}
          >
          <div className='flex justify-center'
          >
          <p>
            About Us: 
            <br/><br/>
            This is a place to store recipes and exercises.<br/>
            The idea is that you get two decks of cards, a recipe deck and an exercise deck. 
            <br/><br/><br/>
            What makes this different? 
            <br/><br/>
            Its all FREE! And, you're making (and sharing) your own cards. It's a bottom-up approach, where you create to inspire .
            So, get started and check out all the cool free features (like aiRevamp in the editing areas)!<br/>
            <br/><br/>
            (Coming Soon: Calendar, Agenda, Groups (for syncing schedules and goals with friends).)
          </p>
          </div>
          <div className='p-5 text-4xl w-full flex items-center justify-center'>
            Stay Fit<br/>
            <FaBurn></FaBurn>
          </div>
          </StandardModal>

          {/*End Modals */}

        </div>
      </div>
    );
};

export default Home;
