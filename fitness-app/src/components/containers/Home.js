import React, { useCallback, useEffect, useState } from 'react';
import { FaPlus, FaArrowRight, FaBurn, FaCalendar, FaCut, FaDumbbell, FaFire, FaGasPump, FaHollyBerry, FaStore, FaSubway, FaUser, FaUtensilSpoon, FaArrowDown, FaQuestionCircle, FaUserPlus, FaBug, FaGoogle } from 'react-icons/fa'
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
      <div className='dark-light-gradient h-dvh overflow-auto'>
        <div className="flex flex-col items-center justify-normal w-full min-h-screen overflow-y-auto">


          {/*Header Row */}
          <div className='px-5 pt-2 w-full flex justify-evenly items-center'>
            {/*Title */}
            <h1 className="flex-1 text-4xl font-bold text-neutral-100 flex items-center gap-3">
              Fit Cards
              <img
                src="/layer-group-solid.svg"
                alt="Fit Cards logo"
                className="inline-block"
                style={{ width: 36, height: 36 }}
              />
            </h1>
            <FaQuestionCircle className='text-3xl text-white me-5' onClick={handleOpenAboutUsModal} />
            {/*User Button */}
            <button className="text-xl flex items-center justify-center"
              onClick={handleOpenAccountModal}>
              {auth.currentUser//if logged in
                ?
                <FaUser className="text-3xl center fill-white" />
                :
                <div>
                  <FaUserPlus className='text-4xl center fill-white' />

                </div>
              }
            </button>
          </div>
          {/*About Us Button
          <div className='w-full text-center'>
            <FaQuestionCircle
              className='start text-white text-3xl'
              onClick={handleOpenAboutUsModal}
            />
          </div>
          */}

          {/*Buttons Container*/}
          <div className="mt-10 container text-center">
            {/**7 day forcast */}
            <h3 className='text-2xl font-bold text-center text-white'>7 Day Snapshot</h3>
            {auth?.currentUser && email ? (
              <WeeklySummary
                selectedDate={today}
                days={days}
                email={email}
              />
            ) :
              <div className="mt-5 container text-center flex overflow-x-auto space-x-4">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="ps-1 pt-7 flex flex-col items-center">
                    <h3 className='text-xl font-bold text-center text-gray-400 mb-1'>Day</h3>
                    <div className="w-[380px] h-[300px] foggy-background rounded-lg shadow animate-pulse"></div>
                  </div>
                ))}
              </div>
            }

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
              <div className="mt-5 container text-center flex overflow-x-auto space-x-4">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="ps-1 flex flex-col items-center">
                    <div className="w-[350px] h-[350px] recipe-gradient rounded-lg shadow animate-pulse"></div>
                  </div>
                ))}
              </div>
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
              <div className="mt-5 container text-center flex overflow-x-auto space-x-4">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="ps-1 flex flex-col items-center">
                    <div className="w-[350px] h-[350px] exercise-gradient rounded-lg shadow animate-pulse"></div>
                  </div>
                ))}
              </div>
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
            {/*Coming Soon and Known Bugs Section*/}
            <div className='my-10 color-white text-3xl'>
              {/*Coming Soon*/}
              <div className='text-opacity-50'>
                Coming Soon
              </div>
              <button className='bg-white opacity-80 bg-opacity-40 mt-5 w-11/12 p-10'>
                Snapshot Grocery List
              </button>
              {/**
              <button className='bg-white opacity-80 bg-opacity-40 mt-5 w-11/12 p-10'>
                Publicly visible days and cards
              </button>
               */}
            </div>
            <div className='my-10 color-white text-2xl'>
              {/*Known Bugs*/}
              <div className='mt-5 text-opacity-50'>
                <div className='flex flex-row justify-center'>
                  Known Bugs <FaBug className='ms-3'/>
                </div>
              </div>
              <button className='bg-red-500 opacity-80 bg-opacity-40 mt-5 w-11/12 p-10'>
                If you update a card name and that card is already in your routine, you will have to update the card slot in calendar to reflect accurate routine.
              </button>
            </div>
          </div>
        </div>

        {/*End Buttons*/}

        {/*---------End Main visible area-----------*/}
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
          <div className='flex justify-center p-10'
          >
            <p>
              About Us:
              <br /><br />
              The idea is that you get two decks of cards, a recipe deck and an exercise deck, the cards have options for downloading and sharing.  There is also a calendar that can use the cards.
              <br /><br />
              To access the calendar, click on one of the days in the 7 day snapshot. Once in the calendar you can assign up to 5 recipes and 5 exercises per day and then use the repeat area to duplicate that day for the following 1-26 weeks (half year).
              <br /><br /><br/>
              What makes this different?
              <br /><br />
              Its all FREE! And it's a bottom-up approach, where you create to inspire .
              So, get started!<br />
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
