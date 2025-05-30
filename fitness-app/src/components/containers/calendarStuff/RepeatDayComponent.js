import React, { useState } from "react";
import { FaDumpsterFire, FaHammer, FaPaintRoller, FaWrench } from "react-icons/fa";
import {Toaster} from 'react-hot-toast';
import {toast} from 'react-hot-toast';
import '../loading.css';

const RepeatDayComponent = ({
    date,
    recipes = [],
    exercises = [],
    dayDataManager
}) => {
    const [selected, setSelected] = useState(1);
    const [loading, setLoading] = useState(false);

    const isoDate = new Date(date).toISOString().split('T')[0];
    const dayOfWeek = date.slice(0, 3);

    const handleChange = (e) => {
        setSelected(e.target.value);
    }

    const handleRepeat = async () => {
        const weeksToRepeat = parseInt(selected);
        //console.log(weeksToRepeat);
        if(!weeksToRepeat || weeksToRepeat <= 0) return;

        setLoading(true);

        for(let i=1; i <= weeksToRepeat; i++){
            const repeatDate = new Date(date);
            repeatDate.setDate(repeatDate.getDate() + i * 7);
            const repeatIsoDate = repeatDate.toISOString().split('T')[0];

            for(let [index, recipe] of recipes.entries()){
                await dayDataManager.addRecipeToDay(repeatIsoDate, recipe, index + 1);
                console.log("Adding Recipe: ", recipe, "slot: ", index + 1, "Date: ", repeatIsoDate)
            };
            for(let[index, exercise] of exercises.entries()){
                await dayDataManager.addExerciseToDay(repeatIsoDate, exercise, index + 1)
                console.log("Adding Exercise: ", exercise, "slot: ", index + 1, "Date: ", repeatIsoDate)
            };
        }
        toast.success(`Repeating every ${dayOfWeek} for ${weeksToRepeat} weeks.`);
        //console.log("Date: ", date);
        //console.log("isoDate: ", isoDate);
        setLoading(false);
    }

    return (
        <div>
            <Toaster position="bottom-center"/>
            {loading && (
                <div className="loading-screen">
                    <div className= "loading-spinner"></div>
                </div>
                )}
            {/**Repeat Area */}
            <div
                className='border text-center rounded-md min-h-[200px]'
            >
                <h3 className='text-xl m-5'>Repeat Area</h3>
                {/*Construction Area
                <div
                    className='w-full h-[300px] flex justify-around items-center border'>
                    <FaHammer className='mb-20 center text-5xl'></FaHammer>
                    <FaPaintRoller className='mt-20 center text-5xl'></FaPaintRoller>
                    <FaWrench className='mb-20 center text-5xl'></FaWrench>
                    <FaDumpsterFire className='mt-20 center text-5xl'></FaDumpsterFire>
                </div>
                */}
                {/**Repeat options */}
                <div
                    className="w-full flex justify-around">
                    <p>Repeat every {dayOfWeek} for the following
                        <select
                            value={selected}
                            onChange={handleChange}
                            className="border rounded mx-2 px-3 py-2">
                            {
                                Array.from({ length: 26 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))
                            }
                        </select> week(s).</p>
                </div>
                {/**Repeat Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleRepeat}
                        className="p-5 m-10 w-full"
                    >Set Repeat
                    </button>
                </div>
            </div>

        </div>
    );
}

export default RepeatDayComponent;