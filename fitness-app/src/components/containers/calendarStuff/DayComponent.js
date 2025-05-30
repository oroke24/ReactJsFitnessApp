import React from 'react';
import './calendar.css';
import { FaCloud, FaDrumstickBite, FaPepperHot, FaSun, FaWalking } from 'react-icons/fa';

const DayComponent = ({ date, recipes = [], exercises = [] }) => {
    let myDay = new Date(date);//IMPORTANT: For some reason myDay is set to day before
    myDay.setDate(myDay.getDate() + 1)//So, we set it to the next day
    myDay.setHours(0, 0, 0, 0);
    myDay = myDay.toDateString();// so we actually stringify the correct day.

    return (
        <div>
            <h3 className='text-xl font-bold mb-1'>{myDay}</h3>
            <div className='border rounded-lg p-2 pt-1 shadow mb-4 h-[300px] w-[380px] overflow-y-auto foggy-background'>
                {recipes.length === 0 && exercises.length === 0 ? 
                <div>
                    <h1 className='font-serif text-xl color-white'>Rest Day.. <br/>Enjoy!</h1>
                        <FaSun className='flex 1 color-orange text-5xl ml-16 mt-3'></FaSun>
                    <div className='flex justify-around items-center'>
                        <FaCloud className='flex 1 color-white text-5xl mt-10'></FaCloud>
                        <FaCloud className='flex 1 color-white text-5xl mt-20'></FaCloud>
                        <FaCloud className='flex 1 color-white text-5xl mt-10'></FaCloud>
                        <FaCloud className='flex 1 color-white text-5xl mt-20'></FaCloud>
                    </div>
                </div>
                :(
                <div className='flex'>
                    <div className='flex-1 border-r gray-border'>
                        <p className="text-xl font-bold mb-2 exercise-color flex items-center justify-around">Exercises <FaWalking></FaWalking></p>
                        <div className='mt-5'>
                        {exercises.map((e, i) => <div className="text-start pl-4 pr-2 text-md exercise-color min-h-10 mb-1" key={i}><p>{e}</p></div>)}
                        </div>  
                    </div>
                    <div className='flex-1 border-l gray-border'>
                    <p className="text-xl font-bold mb-2 color-orange flex items-center justify-around">Recipes <FaPepperHot></FaPepperHot></p>
                        <div className='mt-5'>
                        {recipes.map((r, i) => <div className="text-start pl-4 pr-2 text-md color-orange min-h-10 mb-1" key={i}><p>{r}</p></div>)}
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default DayComponent;