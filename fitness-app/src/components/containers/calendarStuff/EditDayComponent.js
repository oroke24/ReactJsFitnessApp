import React from 'react';

const EditDayComponent = ({ date, recipes=[], exercises = []}) => {
    let myDate = new Date(date);
    myDate = myDate.toDateString();
    return (
        <div className='border p-4 rounded shadow mb-4'>
            <h3 className='font-bold text-sm mb-2'>{myDate}</h3>
            <div>
                <p className="text-sm">Recipes:</p>
                {recipes.map((r, i) => <div key={i}> {r}</div>)}
            </div>
            <div>
                <p className="text-sm">Exercises:</p>
                {exercises.map((e, i) => <div key={i}>{e}</div>)}
            </div>
        </div>
    );
};

export default EditDayComponent;