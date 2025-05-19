//New
import React from 'react';
import { FaUpload } from 'react-icons/fa';
import { dayDataManager } from '../../../firebase/dayDataManager';

const EditDayComponent = ({
    email,
    date,
    recipes = [],
    exercises = [],
    onRecipeChange,
    onExerciseChange,
    recipeOptions = [],
    exerciseOptions = []
}) => {
    const isoDate = new Date(date).toISOString().split('T')[0];
    const formattedDate = new Date(date).toDateString();
    const dayManager = new dayDataManager(email);

    return (
        <div className='border p-4 rounded shadow mb-4'>
            <h3 className='font-bold text-sm mb-2'>{formattedDate}</h3>

            <div>
                <p className="text-sm font-medium mb-1">Recipes:</p>
                {[...Array(5)].map((_, i) => (
                    <select
                        key={i}
                        className="w-full border p-1 mb-1 rounded"
                        value={recipes[i] || ''}
                        onChange={(e) => onRecipeChange(i + 1, e.target.value)}
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
                        onChange={(e) => onExerciseChange(i + 1, e.target.value)}
                    >
                        <option value="">-- Select Exercise --</option>
                        {exerciseOptions.map((e) => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
                ))}
            </div>
            <button 
            onClick={() => dayManager.addRecipeToDay(isoDate, "cheese", 1)}>
                Test button (Should only add cheese in slot 1) for {date}
            </button>
        </div>
    );
};

export default EditDayComponent;

/*old
import React from 'react';

const EditDayComponent = ({ date, recipes=[], exercises = []}) => {
    let myDate = new Date(date);
    myDate = myDate.toDateString();
    return (
        <div className='border p-4 rounded shadow mb-4'>
            <h3 className='font-bold text-sm mb-2'>{myDate}</h3>
            <div>
                <p className="text-sm">Recipes:</p>
                {recipes.map((r, i) => <div key={i}> {r}</div>)}
            </div>
            <div>
                <p className="text-sm">Exercises:</p>
                {exercises.map((e, i) => <div key={i}>{e}</div>)}
            </div>
        </div>
    );
};

export default EditDayComponent;
*/