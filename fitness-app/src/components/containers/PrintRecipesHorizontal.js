import React, { useState } from 'react';
import useGetDocs from '../../hooks/useGetDocs';
import './containers.css';
import './loading.css';
import './mobileCompatConfig.css';
import { Link } from 'react-router-dom';
import { deleteDocument } from '../../firebase/firebaseFirestore';
import ExerciseSwipable from './ExerciseSwipable';

const PrintMyRecipesHorizontal = ({ path }) => {
    const [isLoading, setLoading] = useState(false);
    var { docs, loading, error } = useGetDocs(`${path}/recipes`);
    //console.log(path)

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const sortedDocs = docs.slice().sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    return (
        <div className='flex overflow-x-auto flex-nowrap w-full space-x-4 '>
            {isLoading && (
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                </div>
            )}
            {sortedDocs.map((doc, index) => (
                <div key={index} className='text-center w-[350px] h-[350px] border-4 rounded-lg shrink-0 recipe-gradient p-5 overflow-y-auto'>
                    <Link to={`/recipeBasic/${doc.name}`} state={{ doc }}>
                        <strong className="text-xl">{doc.name}</strong>
                        <div className="text-left">
                            <br />
                            <strong>Ingredients: </strong>
                            <br />
                            {doc.ingredients}
                            <br /><br />
                            <strong>Instructions: </strong>
                            <br />
                            {doc.instructions}
                            <br />
                        </div>
                    </Link>

                </div>
                //Put card design here
            ))}
        </div>
    );
};
export default PrintMyRecipesHorizontal;

