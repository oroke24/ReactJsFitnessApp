import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useGetDocs from '../../hooks/useGetDocs';
import './loading.css';
import './containers.css';
import './mobileCompatConfig.css';
import { deleteDocument } from '../../firebase/firebaseFirestore';
import RecipeSwipable from './RecipeSwipeable';
import { FaPepperHot, FaPlus } from 'react-icons/fa';

const PrintMyRecipes = ({ path }) => {
    const [isLoading, setLoading] = useState(false);
    const { docs, loading, error } = useGetDocs(`${path}/recipes`);
    //console.log(path)

    const handleRecipeClick = (doc) => {
        //BreakPoint!! Learn how to manage states
        //Todo: handle logic to open a recipe item.  
        //Suggestion: make a recipe modal and call it here
        console.log('doc: ', doc);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    const handleDelete = async (name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            setLoading(true);
            await deleteDocument('recipes', name);
            setLoading(false);
            window.location.reload();
        }
    }

    //{/*onClick={() => handleRecipeClick(doc)}*/} 
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
            <h1 className="text-4xl text-center mb-5">Recipes</h1>
            {/*New Card Button */}
            <div className='w-full flex justify-center'>
                <Link
                    className='w-3/4'
                    to={`editRecipe/NewItem`}
                    state={`${{ id: 'New Item', name: 'New Item', ingredients: 'Some ingredients', instructions: 'Some instructions' }}`}>
                    <button
                        className='w-full flex justify-around items-center h-20 text-2xl orange-outline'
                    >
                        <FaPepperHot/> New Recipe <FaPlus/>
                    </button>
                </Link>
            </div>
            {sortedDocs.map(doc => (
                <RecipeSwipable key={doc.name} doc={doc} handleDelete={handleDelete}></RecipeSwipable>
            ))}
        </div>
    );
};
export default PrintMyRecipes;
