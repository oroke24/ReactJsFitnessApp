import React from 'react';
import DayComponent from './DayComponent';

const WeeklySummary = ({selectedDate, days}) => {
    const displayDate = new Date(selectedDate);
    for(let i of days){
        console.log("Days in weekly summary: ", i.recipes);
    }
    return(
        <div className='flex overflow-x-auto space-x-4 p-2'>
            {days.map((day, index) =>(
                <DayComponent 
                key={index} 
                date={day.date} 
                recipes={day.recipes}
                exercises={day.exercises} />
            ))}
        </div>
    );
};

export default WeeklySummary;