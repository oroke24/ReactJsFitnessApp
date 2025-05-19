import React from 'react';

const DayComponent = ({ date, recipes=[], exercises = []}) => {
    let myDay = new Date(date);//IMPORTANT: For some rease myDay is set to day before
    myDay.setDate(myDay.getDate() + 1)//So, we set it to the next day
    myDay = myDay.toDateString();// so we actually stringify the correct day.

    return (
        <div className='border p-2 pt-1 rounded shadow mb-4 h-[250px] w-[350px] overflow-y-auto'>
            <h3 className='font-bold text-center mb-3'>{myDay}</h3>
            <div className='flex justify-between'>
            <div className='flex-1 border'>
                <p className="text-sm text-center font-bold">Recipes:</p>
                {recipes.map((r, i) => <div className="text-sm"key={i}>- {r}</div>)}
            </div>
            <div className='flex-1 border'>
                <p className="text-sm text-center font-bold">Exercises:</p>
                {exercises.map((e, i) => <div className="text-sm" key={i}>- {e}</div>)}
            </div>
            </div>
        </div>
    );
};

export default DayComponent;