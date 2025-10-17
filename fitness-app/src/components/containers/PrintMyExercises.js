import React, { useState } from 'react';
import useGetDocs from '../../hooks/useGetDocs';
import './containers.css';
import './loading.css';
import './mobileCompatConfig.css';
import { Link } from 'react-router-dom';
import { deleteDocument } from '../../firebase/firebaseFirestore';
import ExerciseSwipable from './ExerciseSwipable';
import { FaPlus, FaRunning } from 'react-icons/fa';

const PrintMyExercises = ({ path }) => {
    const [isLoading, setLoading] = useState(false);
    var { docs, loading, error } = useGetDocs(`${path}/exercises`);
    //console.log(path)

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleDelete = async (name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            setLoading(true);
            await deleteDocument('exercises', name);
            setLoading(false);
            window.location.reload();
        }
    }

    const sortedDocs = docs.slice().sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

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
                <Link 
                    className='w-3/4'
                    to={`editExercise/NewItem`}>
                    <button className='w-full flex justify-around items-center h-20 text-2xl indigo-outline'>
                        <FaRunning/> New Exercise <FaPlus/>
                    </button>
                </Link>
            </div>
            {sortedDocs.map(doc => (
                <ExerciseSwipable key={doc.name} doc={doc} handleDelete={handleDelete} />
            ))}
        </div>
    );
};
export default PrintMyExercises;

