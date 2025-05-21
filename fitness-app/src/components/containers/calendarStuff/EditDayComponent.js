//New
import React from 'react';
import { useState, useEffect } from 'react';
import { FaDumpsterFire, FaHammer, FaPaintBrush, FaPaintRoller, FaUpload, FaWrench } from 'react-icons/fa';
import { dayDataManager } from '../../../firebase/dayDataManager';

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
    useEffect(() => {
        setLocalRecipes(recipes);
    }, [recipes]);
    const handleRecipeChange = async (recipeId, slot) => {
        dayManager.addRecipeToDay(isoDate, recipeId, slot)
        const updated = [...localRecipes]
        updated[slot - 1] = recipeId;
        setLocalRecipes(updated);
    };

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
            <h3 className='font-bold text-sm mb-2'>{myDay}</h3>

            <div>
                <p className="text-sm font-medium mb-1">Recipes:</p>
                {[...Array(5)].map((_, i) => (
                    <select
                        key={i}
                        className="w-full border p-1 mb-1 rounded"
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

            <div>
                <p className="text-sm font-medium mt-3 mb-1">Exercises:</p>
                {[...Array(5)].map((_, i) => (
                    <select
                        key={i}
                        className="w-full border p-1 mb-1 rounded"
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
            {/**Repeat Area */}
            <div
                className='border text-center rounded-md h-[400px]'
            >
                <h3 className='color-grey text-xl m-5'>Repeat Area Under Construction</h3>
                <div
                    className='flex border rounded-md justify-around overflow-x-auto'

                >
                    <div className='w-min border rounded-md m-1 p-1'>
                        Mon
                    </div>
                    <div className='w-min border rounded-md m-1 p-1'>
                        Tue 
                    </div>
                    <div className='w-min border rounded-md m-1 p-1'>
                        Wed
                    </div>
                    <div className='w-min border rounded-md m-1 p-1'>
                        Thur
                    </div>
                    <div className='w-min border rounded-md m-1 p-1'>
                        Fri
                    </div>
                    <div className='w-min border rounded-md m-1 p-1'>
                        Sat
                    </div>
                    <div className='w-min border rounded-md m-1 p-1'>
                        Sun
                    </div>
                </div>
                {/*Construction Area*/}
                <div 
                className='w-full h-[300px] flex justify-around items-center border'>
                    <FaHammer className='mb-20 center text-5xl'></FaHammer>
                    <FaPaintRoller className='mt-20 center text-5xl'></FaPaintRoller>
                    <FaWrench className='mb-20 center text-5xl'></FaWrench>
                    <FaDumpsterFire className='mt-20 center text-5xl'></FaDumpsterFire>
                </div>

            </div>
        </div>
    );
};

export default EditDayComponent;