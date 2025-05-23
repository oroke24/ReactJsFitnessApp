import React from 'react';
import './calendar.css';

const DayComponent = ({ date, recipes = [], exercises = [] }) => {
    let myDay = new Date(date);//IMPORTANT: For some reason myDay is set to day before
    myDay.setDate(myDay.getDate() + 1)//So, we set it to the next day
    myDay.setHours(0, 0, 0, 0);
    myDay = myDay.toDateString();// so we actually stringify the correct day.

    return (
        <div>
            <h3 className='text-xl font-bold mb-1'>{myDay}</h3>
            <div className='border rounded-lg p-2 pt-1 shadow mb-4 h-[300px] w-[380px] overflow-y-auto foggy-background'>
                <div className='flex'>
                    <div className='flex-1 border-r gray-border'>
                    <p className="text-lg font-bold mb-2 color-orange">Recipes:</p>
                        {recipes.map((r, i) => <div className="text-start pl-2 pr-2 text-md color-orange" key={i}>- {r}</div>)}
                    </div>
                    <div className='flex-1 border-l gray-border'>
                        <p className="text-lg font-bold mb-2 exercise-color">Exercises:</p>
                        {exercises.map((e, i) => <div className="text-start pl-4 pr-2 text-md exercise-color" key={i}>- {e}</div>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayComponent;