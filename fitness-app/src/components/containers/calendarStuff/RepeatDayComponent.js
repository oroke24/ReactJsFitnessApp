import React, { useState } from "react";
import { FaArrowDown } from 'react-icons/fa'
import { Toaster, toast } from 'react-hot-toast';
import '../loading.css';

const RepeatDayComponent = ({
    date,
    recipes = [],
    exercises = [],
    dayDataManager
}) => {
    const [weeks, setWeeks] = useState(1); // total weeks ahead
    const [frequency, setFrequency] = useState("every");
    const [loading, setLoading] = useState(false);

    {/** OLD day of week: const dayOfWeek = date.slice(0, 3);*/ }
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const startDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endDate = new Date(new Date(date).setDate(new Date(date).getDate() + weeks * 7)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const handleRepeat = async () => {
        const totalWeeks = parseInt(weeks);
        if (!totalWeeks || totalWeeks <= 0) return;

        setLoading(true);

        const weekOffset = frequency === "every" ? 7 : 14;
        const repeatCount =
            frequency === "every"
                ? totalWeeks
                : Math.floor(totalWeeks / 2);

        for (let i = 1; i <= repeatCount; i++) {
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
        const message = 
            (frequency === "every"
                ? `Every ${dayOfWeek}`
                : `Every other ${dayOfWeek}`)+ 
                `\nFrom ${dayOfWeek} ${startDate} - ${dayOfWeek} ${endDate}` +
                `\nHas Been Set!`;
        alert(message);


        setLoading(false);
    };

    return (
        <div>
            <Toaster position="bottom-center" />

            <div className="border text-center rounded-md min-h-[200px]">
                <h3 className="text-xl m-5">Repeat Area</h3>

                <div className="w-full flex flex-col justify-around">
                    <p>
                        Update
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="text-center border rounded mx-2 px-2 py-2"
                        >
                            <option value="every">every</option>
                            <option value="every-other">every other</option>
                        </select>
                        {dayOfWeek}<br/>
                        </p>
                        <br/>
                        <p>
                        For
                        <select
                            value={weeks}
                            onChange={(e) => setWeeks(e.target.value)}
                            className="border rounded mx-2 px-3 py-2"
                        >
                            {Array.from({ length: 26 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        week(s) after selected day, <br />
                    </p>
                </div>
                <div className="w-full flex justify-center">
                    <button
                        className="rounded-2xl outline w-1/2 p-10 mt-10 text-xl bg-gray-500"
                        onClick={handleRepeat}
                    >
                        {!loading ? (
                            <><strong>Set Repeat</strong></>
                        ) : (
                            <div className="w-full flex justify-center">
                                <div className="loading-spinner"></div>
                            </div>
                        )}
                    </button>
                </div>
                <div className="w-full flex justify-center items-end">
                    <FaArrowDown className="text-4xl fill-gray-500" />
                </div>

                <div className="w-full flex justify-center p-5">
                    <p className="w-max rounded-lg outline text-md text-gray-800 p-5">
                        {dayOfWeek} <strong>{startDate}</strong> - {dayOfWeek} <strong>{endDate}</strong><br />
                        {frequency === "every" ? (
                            <>(<strong> every</strong> {dayOfWeek})</>
                        ) : (
                            <>(<strong> every other</strong> {dayOfWeek}.) </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RepeatDayComponent;
