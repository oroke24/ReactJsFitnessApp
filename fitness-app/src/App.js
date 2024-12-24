import React, { useState } from 'react';
import Home from './components/containers/Home';
import { FaRoute } from 'react-icons/fa';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import EditRecipe from './components/containers/EditRecipe';
import EditExercise from './components/containers/EditExercise';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/editRecipe/:id" element={<EditRecipe/>}></Route>
        <Route path="/editExercise/:id" element={<EditExercise/>}></Route>
      </Routes>
    </Router>
  );
};


export default App;