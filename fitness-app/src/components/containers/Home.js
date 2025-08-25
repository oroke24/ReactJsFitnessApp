import React, { useCallback, useState } from 'react';
import { FaPlus, FaArrowRight, FaBurn, FaCalendar, FaCut, FaDumbbell, FaFire, FaGasPump, FaHollyBerry, FaStore, FaSubway, FaUser, FaUtensilSpoon } from 'react-icons/fa'
import './containers.css';
import Login from '../auth/Login';
import Account from '../auth/Account';
import PrintMyRecipes from './PrintMyRecipes';
import StandardModal from './StandardModal';
import auth from '../../firebase/firebaseAuth';
import PrintMyExercises from './PrintMyExercises';
import { Link } from 'react-router-dom';
import { initializeUser } from '../../firebase/firebaseFirestore';
import useWeeklyData from '../../hooks/useWeeklyData';
import WeeklySummary from './calendarStuff/weeklySummary';
import PrintMyExercisesHorizontal from './PrintExercisesHorizontal';
import PrintMyRecipesHorizontal from './PrintRecipesHorizontal'
import useAuthStatus from '../../hooks/useAuthStatus';

const Home = () => {
  //BINDING///////////////////////////////////
  const userCollection = auth?.currentUser ? `users/${auth.currentUser.email}` : "users/guest";
  const email = auth?.currentUser ? `${auth.currentUser.email}` : "guest";
  const [myEmail] = useState(email);
  const [message, setMessage] = useState('Empty');
  const [isMainModalOpen, setMainModalOpen] = useState(false);
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [isRecipeModalOpen, setRecipeModalOpen] = useState(false);
  const [isExerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [isAboutUsModalOpen, setAboutUsModalOpen] = useState(false);
  //const [email, setEmail] = useState(auth?.currentUser?.email);

  const handleOpenAccountModal = () => setAccountModalOpen(true);
  const handleCloseAccountModal = () => setAccountModalOpen(false);
  //const handleSetEmail = () => setEmail(auth?.currentUser?.email);
  const handleOpenMainModal = () => setMainModalOpen(true);
  const handleCloseMainModal = () => setMainModalOpen(false);
  const handleOpenRecipeModal = () => setRecipeModalOpen(true);
  const handleCloseRecipeModal = () => setRecipeModalOpen(false);
  const handleOpenExerciseModal = () => setExerciseModalOpen(true);
  const handleCloseExerciseModal = () => setExerciseModalOpen(false);
  const handleOpenAboutUsModal = () => setAboutUsModalOpen(true);
  const handleCloseAboutUsModal = () => setAboutUsModalOpen(false);
  const [today] = useState(new Date());
  const days = useWeeklyData(today, email);
  //console.log("days:", days);
  //console.log("Email in from home: ", email);

  //EXPORTING///////////////////////////////////
  return (
    <div>
      {/*Static Background*/}
      <div className='dark-light-gradient h-screen overflow-auto'>
        <div className="flex flex-col items-center justify-normal w-full min-h-screen overflow-y-auto">


          {/*Header Row */}
          <div className='p-5 w-full flex justify-evenly items-center'>
            {/*Title */}
            <h1 className="flex-1 text-4xl font-bold text-neutral-100">Fit Cards</h1>
            {/*About Us Button */}
            <button
              className=''
              onClick={handleOpenAboutUsModal}
            >
              About Us
            </button>
            {/*User Button */}
            <button className="text-xl flex items-center justify-center"
              onClick={handleOpenAccountModal}>
              {/*auth.currentUser//if logged in
              ?//show email
              auth.currentUser.email
              ://else say...
              "Login/Register"
              */}
              <FaUser
                className="text-3xl center fill-white">
              </FaUser>
            </button>
          </div>

          {/*Buttons Container*/}
          <div className="mt-5 container text-center">
            {/**7 day forcast */}
            {auth?.currentUser && email && (
              <WeeklySummary
                selectedDate={today}
                days={days}
                email={email}
              />
            )}

            {/*Recipe and Exercise Buttons Container*/}
            {/*Recipe Button*/}
            <div className='flex mt-12'>
              <button
                className="flex-1 recipe-button recipe-gradient p-4 m-2"
                onClick={handleOpenRecipeModal}
              >
                <div className='color-black flex justify-evenly items-center text-xl' >
                  <FaGasPump></FaGasPump>
                  <strong>Recipes</strong>
                  <FaPlus></FaPlus>
                </div>
              </button>
            </div>
            <div className="p-2">
              {auth?.currentUser ? (
                <PrintMyRecipesHorizontal
                  path={userCollection}>
                </PrintMyRecipesHorizontal>
              ) : (
                ""
              )}
            </div>

            {/*Exercise Button*/}
            <div className='flex mt-12'>
              <button
                className="flex-1 exercise-button exercise-gradient p-4 m-2"
                onClick={handleOpenExerciseModal}
              >
                <div className='flex justify-evenly items-center text-xl'>
                  <FaFire></FaFire>
                  <strong>Exercises</strong>
                  <FaPlus></FaPlus>
                </div>
              </button>
            </div>
            <div className="color-white p-2">
              {auth?.currentUser ? (
                <PrintMyExercisesHorizontal
                  path={userCollection}
                ></PrintMyExercisesHorizontal>
              ) : (
                ""
              )}
            </div>

            {/*Calendar Button
            <Link
              to={auth?.currentUser ? "/calendar" : "/"}
              state={{ email: email }}
            >
              <button
                className="calendar-button calendar-gradient m-2 w-1/2">
                <div className='color-white flex justify-between items-center text-2xl p-5' >
                  <FaCalendar></FaCalendar>
                  <strong>Calendar</strong>
                  <FaArrowRight></FaArrowRight>
                </div>
              </button>
            </Link>
            */}
            {/*Coming Soon Section Buttons */}
            <div className='mt-10 color-white text-3xl'>
              <div className='text-opacity-50'>
                Coming Soon
              </div>
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
              <br /><br />
              This is a place to store recipes and exercises.<br />
              The idea is that you get two decks of cards, a recipe deck and an exercise deck.
              <br /><br /><br />
              What makes this different?
              <br /><br />
              Its all FREE! And, you're making (and sharing) your own cards. It's a bottom-up approach, where you create to inspire .
              So, get started and check out all the cool free features (like aiRevamp in the editing areas)!<br />
              <br /><br />
              (Coming Soon: Calendar, Agenda, Groups (for syncing schedules and goals with friends).)
            </p>
          </div>
          <div className='p-5 text-4xl w-full flex items-center justify-center'>
            Stay Fit<br />
            <FaBurn></FaBurn>
          </div>
        </StandardModal>

        {/*End Modals */}

      </div>
    </div>
  );
};

export default Home;
