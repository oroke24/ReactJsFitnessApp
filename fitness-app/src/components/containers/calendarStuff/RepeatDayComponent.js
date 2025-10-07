import React, { useState } from "react";
import { FaDumpsterFire, FaHammer, FaPaintRoller, FaWrench } from "react-icons/fa";
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import '../loading.css';

const RepeatDayComponent = ({
    date,
    recipes = [],
    exercises = [],
    dayDataManager
}) => {
    const [selected, setSelected] = useState(1);
    const [frequency, setFrequency] = useState("every");
    const [loading, setLoading] = useState(false);

    const isoDate = new Date(date).toISOString().split('T')[0];
    const dayOfWeek = date.slice(0, 3);

    const handleChange = (e) => {
        setSelected(e.target.value);
    }
    const handleFrequencyChange = (e) => {
        setFrequency(e.target.value);
    }

    const handleRepeat = async () => {
        const weeksToRepeat = parseInt(selected);
        //console.log(weeksToRepeat);
        if (!weeksToRepeat || weeksToRepeat <= 0) return;

        setLoading(true);

        const weekOffset = frequency === "every" ? 7 :14;

        for (let i = 1; i <= weeksToRepeat; i++) {
            const repeatDate = new Date(date);
            repeatDate.setDate(repeatDate.getDate() + i * weekOffset);
            const repeatIsoDate = repeatDate.toISOString().split('T')[0];

            const recipPromises = recipes.map((recipe, index) =>
                dayDataManager.addRecipeToDay(repeatIsoDate, recipe, index + 1)
            );
            const exercisePromises = exercises.map((exercise, index) =>
                dayDataManager.addExerciseToDay(repeatIsoDate, exercise, index + 1)
            );
            await Promise.all([...recipPromises, ...exercisePromises]);
            console.log(`Week ${i} added successfully: ${repeatIsoDate}`);
        }
        toast.success(`Scheduled ${weeksToRepeat} more ${dayOfWeek}(s) (${frequency.replace("-", " ")})`);
        //toast.success(`Repeating ${frequency === "every" ? "every" : "every other"} ${dayOfWeek} for ${weeksToRepeat} weeks.`);
        //toast.success(`Repeating every ${dayOfWeek} for ${weeksToRepeat} weeks.`);
        //console.log("Date: ", date);
        //console.log("isoDate: ", isoDate);
        setLoading(false);
    }

    return (
        <div>
            <Toaster position="bottom-center" />
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
                    <p>Repeat 
                        <select
                         value={frequency}
                         onChange={handleFrequencyChange}
                         className="text-center border rounded mx-2 px-2 py-2"
                        >
                            <option value="every">every</option>
                            <option value="every-other">every other</option>
                        </select> 
                        {dayOfWeek}
                        <select
                            value={selected}
                            onChange={handleChange}
                            className="border rounded mx-2 px-3 py-2">
                            {
                                Array.from({ length: frequency === "every" ? 26 : 13 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))
                            }
                        </select> more time(s).</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    {frequency === "every"
                    ? `${selected} more consecutive ${dayOfWeek}s will be updated.`
                    : `${selected} more ${dayOfWeek}s will be updated, every other week.`}
                </p>

                {/**Repeat Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleRepeat}
                        className="p-5 m-10 w-full"
                    >
                        {!loading ? ("Set Repeat") : (
                            <div className="w-full flex justify-center">
                                <div className="loading-spinner"></div>
                            </div>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
}

export default RepeatDayComponent;