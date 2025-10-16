import React, { useState } from "react";
import { Toaster, toast } from 'react-hot-toast';
import '../loading.css';

const RepeatDayComponent = ({
    date,
    recipes = [],
    exercises = [],
    dayDataManager
}) => {
    const [weeks, setWeeks] = useState(1);          // total weeks ahead
    const [frequency, setFrequency] = useState("every");
    const [loading, setLoading] = useState(false);

    const dayOfWeek = date.slice(0, 3);

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

        alert(
            `Scheduled ${
                repeatCount
            } more ${dayOfWeek}'s, ${frequency.replace("-", " ")} week (spanning ${totalWeeks} weeks)`
        );

        setLoading(false);
    };

    return (
        <div>
            <Toaster position="bottom-center" />

            <div className="border text-center rounded-md min-h-[200px]">
                <h3 className="text-xl m-5">Repeat Area</h3>

                <div className="w-full flex justify-around">
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
                        week(s) after selected day, <br/>update
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="text-center border rounded mx-2 px-2 py-2"
                        >
                            <option value="every">every</option>
                            <option value="every-other">every other</option>
                        </select>
                        {dayOfWeek} 
                    </p>
                </div>

<div className="w-full flex justify-center p-5">
                <p className="w-max rounded-lg outline text-md text-gray-800 mt-2 p-5">
                    Over the following {weeks} week(s),<br/> 
                    {frequency === "every" ? (
                        <> update <strong>{weeks}</strong> {dayOfWeek}(s) <br/>(<strong> every</strong> {dayOfWeek})</>
                    ) : (
                        <> update <strong> {Math.floor(weeks/2)}</strong> {dayOfWeek}(s) <br/>(<strong> every other</strong> {dayOfWeek}.) </>
                    )}
                </p>
</div>
                <div className="flex justify-center">
                    <button
                        onClick={handleRepeat}
                        className="p-5 m-10 w-full"
                    >
                        {!loading ? (
                            "Set Repeat"
                        ) : (
                            <div className="w-full flex justify-center">
                                <div className="loading-spinner"></div>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RepeatDayComponent;
