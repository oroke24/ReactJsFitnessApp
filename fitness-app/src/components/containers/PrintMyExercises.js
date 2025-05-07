import React, { useState } from 'react';
import useGetDocs from '../../hooks/useGetDocs';
import './containers.css';
import './loading.css';
import './mobileCompatConfig.css';
import { Link } from 'react-router-dom';
import { deleteDocument } from '../../firebase/firebaseFirestore';
import ExerciseSwipable from './ExerciseSwipable';

const PrintMyExercises = ({path}) => {
    const [isLoading, setLoading]= useState(false);
    var {docs, loading, error} = useGetDocs(`${path}/exercises`);
    //console.log(path)

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    const handleDelete = async (name) => {
        if(window.confirm(`Are you sure you want to delete ${name}?`)){
            setLoading(true);
            await deleteDocument('exercises', name);
            setLoading(false);
            window.location.reload();
        }
    }
    return (
    <div>
            {isLoading && (
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                </div>
            )}
        <h1 className="text-4xl text-center mb-5">Exercises</h1>
        {/*New Card Button */}
        <div className='w-full flex justify-center'>
            <Link to ={`editExercise/NewItem`}>
            <button className='w-full h-20 text-2xl indigo-outline'>
                New Exercise
            </button>
            </Link>
        </div>
            {docs.map(doc => (
                <ExerciseSwipable key={doc.name} doc={doc} handleDelete={handleDelete}/>
            ))}
        {/*New Card Button */}
        <div className='w-full flex justify-center'>
            <Link to ={`editExercise/NewItem`}>
            <button className='w-full h-20 text-2xl indigo-outline'>
                New Exercise
            </button>
            </Link>
        </div>
    </div>
    );
};
export default PrintMyExercises;

