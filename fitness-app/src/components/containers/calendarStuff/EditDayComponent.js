//New
import React from 'react';
import { useState, useEffect } from 'react';
import { FaDumpsterFire, FaHammer, FaPaintBrush, FaPaintRoller, FaUpload, FaWrench } from 'react-icons/fa';
import { dayDataManager } from '../../../firebase/dayDataManager';
import RepeatDayComponent from './RepeatDayComponent';

const EditDayComponent = ({
    email,
    date,
    recipes = [],
    exercises = [],
    onRecipeChange,
    onExerciseChange,
}) => {
    const isoDate = new Date(date).toISOString().split('T')[0];
    let myDay = new Date(date);//IMPORTANT: For some rease myDay is set to day before
    //myDay.setDate(myDay.getDate())//So, we set it to the next day
    myDay.setHours(0, 0, 0, 0);
    myDay = myDay.toDateString();// so we actually stringify the correct day.
    const dayManager = new dayDataManager(email);
    const [recipeOptions, setRecipeOptions] = useState([]);
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const [localRecipes, setLocalRecipes] = useState(recipes);
    const [localExercises, setLocalExercises] = useState(exercises);
    const handleRecipeChange = async (recipeId, slot) => {
        dayManager.addRecipeToDay(isoDate, recipeId, slot)
        const updated = [...localRecipes]
        updated[slot - 1] = recipeId;
        setLocalRecipes(updated);
    };

    useEffect(() => {
        setLocalRecipes(recipes);
    }, [recipes]);
    useEffect(() => {
        setLocalExercises(exercises)
    }, [exercises]);

    const handleExerciseChange = async (exerciseId, slot) => {
        dayManager.addExerciseToDay(isoDate, exerciseId, slot)
        const updated = [...localExercises]
        updated[slot - 1] = exerciseId;
        setLocalExercises(updated);
    };
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const recipes = await dayManager.getRecipeIds();
                const exercises = await dayManager.getExerciseIds();
                //console.log("Fetched recipes:", recipes);
                //console.log("Fetched exercises:", exercises);
                setRecipeOptions(recipes);
                setExerciseOptions(exercises);
            } catch (err) {
                console.error("Failed to fetch options:", err);
            }
        };
        fetchOptions();
    }, [email])

    return (
        <div className='border p-4 rounded shadow mb-4'>
            <h3 className='text-center font-bold text-2xl mb-2'>{myDay}</h3>

            <div className='py-5 px-10'>
                <p className="text-center text-xl font-medium mb-1">Recipes:</p>
                {[...Array(5)].map((_, i) => (
                    <select
                        key={i}
                        className="text-lg w-full border p-2 mb-2 rounded recipe-gradient"
                        value={localRecipes[i] || ''}
                        onChange={(e) => handleRecipeChange(e.target.value, i + 1)}
                    >
                        <option value="">-- Select Recipe --</option>
                        {recipeOptions.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                ))}
            </div>

            <div className='py-5 px-10'>
                <p className="text-center text-xl font-medium mt-3 mb-1">Exercises:</p>
                {[...Array(5)].map((_, i) => (
                    <select
                        key={i}
                        className="text-lg w-full border p-2 mb-2 rounded exercise-gradient color-white"
                        value={localExercises[i] || ''}
                        onChange={(e) => handleExerciseChange(e.target.value, i + 1)}
                    >
                        <option value="">-- Select Exercise --</option>
                        {exerciseOptions.map((e) => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
                ))}
            </div>
            <RepeatDayComponent
                date={date}
                recipes={recipes}
                exercises={exercises}
                dayDataManager={dayManager}
            ></RepeatDayComponent>
        </div>
    );
};

export default EditDayComponent;