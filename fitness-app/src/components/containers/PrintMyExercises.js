import React from 'react';
import useGetDocs from '../../hooks/useGetDocs';
import './containers.css';

const PrintMyExercises = ({path}) => {
    const {docs, loading, error} = useGetDocs(`${path}/exercises`);
    console.log(path)

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    return (
    <div>
        <h1 className="text-4xl text-center mb-5">Exercises</h1>
        <ul>
            {docs.map(doc => (
                <li className="exercise-card-list-item">
                <strong className='text-xl'>{doc.name}</strong><br/>
                <strong>Muscle Group: </strong>
                {doc.muscleGroup}<br/>
                <strong>Instructions: </strong>
                {doc.instructions}<br/>
                </li>
            ))}
        </ul>
        <div className='flex justify-center'>
            <button className='w-11/12 h-20 text-2xl indigo-outline'>
                New Exercise
            </button>
        </div>
    </div>
    );
};
export default PrintMyExercises;

