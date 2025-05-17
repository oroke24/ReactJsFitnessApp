import React, { useState } from 'react';
import Home from './components/containers/Home';
import { FaRoute } from 'react-icons/fa';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import EditRecipe from './components/containers/EditRecipe';
import EditExercise from './components/containers/EditExercise';
import RecipeBasic from './components/containers/cardStyles/RecipeBasic';
import ExerciseBasic from './components/containers/cardStyles/ExerciseBasic';
import Calendar from './components/containers/calendarStuff/Calendar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/editRecipe/:id" element={<EditRecipe/>}></Route>
        <Route path="/recipeBasic/:id" element={<RecipeBasic/>}></Route>
        <Route path="/editExercise/:id" element={<EditExercise/>}></Route>
        <Route path="/exerciseBasic/:id" element={<ExerciseBasic/>}></Route>
        <Route path="/calendar" element={<Calendar/>}></Route>
      </Routes>
    </Router>
  );
};


export default App;