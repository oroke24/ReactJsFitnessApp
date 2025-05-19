import React from 'react';
import DayComponent from './DayComponent';

const WeeklySummary = ({ selectedDate, days, onDayClick }) => {
    const displayDate = new Date(selectedDate);
    return (
        <div className='flex overflow-x-auto space-x-4 p-2'>
            {days.map((day, index) => (
                <div
                    key={index}
                    onClick={() => onDayClick(day.date)}
                className={`cursor-pointer p-1 rounded w-[300px] flex-shrink-0
                    ${day.date === selectedDate ? 'bg-blue-200' : 'hover:bg-gray-100'}`}>
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