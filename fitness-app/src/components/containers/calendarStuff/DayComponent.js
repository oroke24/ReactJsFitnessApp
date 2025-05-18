import React from 'react';

const DayComponent = ({ date, recipes=[], exercises = []}) => {
    return (
        <div className='border p-4 rounded shadow mb-4'>
            <h3 className='font-bold text-lg mb-2'>{date}</h3>
            <div>
                <p className="font-semibold">Recipes:</p>
                {recipes.map((r, i) => <div key={i}> {r}</div>)}
            </div>
            <div>
                <p className="font-semibold">Exercises:</p>
                {exercises.map((e, i) => <div key={i}>{e}</div>)}
            </div>
        </div>
    );
};

export default DayComponent;