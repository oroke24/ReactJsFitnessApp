import React from 'react';
import DayComponent from './DayComponent';

const WeeklySummary = ({ selectedDate, days, onDayClick }) => {
    console.log("days in weeklySummary:", days);
    return (
        <div className='flex overflow-x-auto space-x-4 p-2'>
            {days.map((day, index) => (
                <div
                    key={index}
                    onClick={() => onDayClick(day.date)}
                    className={`cursor-pointer p-1 
                        ${day.date === selectedDate ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                    >
                    <h3 className='font-bold text-sm mb-2 text-center'>{day.date}</h3>
                    <DayComponent
                        key={index}
                        date={day.date}
                        recipes={day.recipes}
                        exercises={day.exercises}
                    />
                </div>
            ))}
        </div>
    );
};

export default WeeklySummary;