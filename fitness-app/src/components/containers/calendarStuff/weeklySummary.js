import React from 'react';
import DayComponent from './DayComponent';

const WeeklySummary = ({ selectedDate, days, onDayClick }) => {
    //console.log("days in weeklySummary:", days);
    //console.log("days[0] in weeklySummary:", days[0]);
    
    return (
        <div className='flex overflow-x-auto space-x-4 p-2 pl-10 pr-10'>
            {days.map((day, index) => (
                <div
                    className={`p-1`}
                    >
                    {/*<h3 className='font-bold text-sm mb-2 text-center'>{day.date}</h3>*/}
                    <DayComponent
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