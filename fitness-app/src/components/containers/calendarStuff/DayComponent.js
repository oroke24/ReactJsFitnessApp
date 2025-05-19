import React from 'react';

const DayComponent = ({ date, recipes=[], exercises = []}) => {
    let myDate = new Date(date);
    myDate = myDate.toDateString();
    return (
        <div className='border p-4 rounded shadow mb-4'>
            <h3 className='font-bold text-sm mb-2 text-center'>{myDate}</h3>
            <div className='flex justify-between'>
            <div className='flex-1'>
                <p className="text-sm text-center">Recipes:</p>
                {recipes.map((r, i) => <div className="text-sm"key={i}> {r}</div>)}
            </div>
            <div className='flex-1'>
                <p className="text-sm text-center">Exercises:</p>
                {exercises.map((e, i) => <div className="text-sm" key={i}>{e}</div>)}
            </div>
            </div>
        </div>
    );
};

export default DayComponent;