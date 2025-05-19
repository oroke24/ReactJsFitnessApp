//New
import React from 'react';
import {useState, useEffect} from 'react';
import { FaUpload } from 'react-icons/fa';
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
    myDay.setDate(myDay.getDate())//So, we set it to the next day
    myDay = myDay.toDateString();// so we actually stringify the correct day.
    const dayManager = new dayDataManager(email);
    const [recipeOptions, setRecipeOptions] = useState([]);
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const handleRecipeChange = async  (recipeId, slot) => {
        dayManager.addRecipeToDay(isoDate, recipeId, slot)
    };
    const handleExerciseChange = async  (exerciseId, slot) => {
        dayManager.addExerciseToDay(isoDate, exerciseId, slot)
    };
    useEffect(() => {
        const fetchOptions = async () => {
            try{
                const recipes = await dayManager.getRecipeIds();
                const exercises = await dayManager.getExerciseIds();
                //console.log("Fetched recipes:", recipes);
                //console.log("Fetched exercises:", exercises);
                setRecipeOptions(recipes);
                setExerciseOptions(exercises);
            }catch(err){
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
                        value={recipes[i] || ''}
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
                        value={exercises[i] || ''}
                        onChange={(e) => handleExerciseChange(e.target.value, i + 1)}
                    >
                        <option value="">-- Select Exercise --</option>
                        {exerciseOptions.map((e) => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
                ))}
            </div>
        </div>
    );
};

export default EditDayComponent;