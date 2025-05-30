import React from 'react';
import DayComponent from './DayComponent';

const WeeklySummary = ({ selectedDate, days, onDayClick }) => {
    //console.log("days in weeklySummary:", days);
    //console.log("days[0] in weeklySummary:", days[0]);
    
    return (
        <div className='flex overflow-x-auto space-x-5 mt-5 mb-5 ml-2 mr-2 color-white'>
            {days.map((day, index) => (
                <div
                    key={index}
                    className={`p-1`}
                    >
                    {index === 0 ? (<h3 className='font-bold text-center'>Today</h3>):(<div className='p-3'></div>)}
                    <DayComponent
                        key = {index}
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