import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import useGetDocs from '../../hooks/useGetDocs';
import './containers.css';

const PrintMyRecipes = ({path}) => {
    const {docs, loading, error} = useGetDocs(`${path}/recipes`);
    //console.log(path)

    const handleRecipeClick = (doc) =>{
        //BreakPoint!! Learn how to manage states
        //Todo: handle logic to open a recipe item.  
        //Suggestion: make a recipe modal and call it here
        console.log('doc: ', doc);
    };

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

                    //{/*onClick={() => handleRecipeClick(doc)}*/} 
    return (
    <div>
        <h1 className="text-4xl text-center mb-5">Recipes</h1>
        <ul>
            {docs.map(doc => (
                <Link to={`/editRecipe/${doc.name}`} state={{doc}}>
                    <li 
                        key={doc.name}
                        className={`recipe-card-list-item`}
                    >
                        <strong className='text-xl'>{doc.name}</strong><br/>
                        <strong>Ingredients: </strong>
                        {doc.ingredients}<br/>
                        <strong>Instructions: </strong>
                        {doc.instructions}<br/>
                    </li>
                </Link>
            ))}
        </ul>
        <div className='flex justify-center'>
            <button 
            className='w-11/12 h-20 text-2xl orange-outline'
            onClick={() => handleRecipeClick({id: '', name: 'New Item', ingredients: 'Some ingredients..', instructions: 'Some instructions..', imgUrl: 'imgUrl'})}
            >
                New Recipe
            </button>
        </div>
    </div>
    );
};
export default PrintMyRecipes;
