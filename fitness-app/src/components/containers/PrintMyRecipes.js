import React from 'react';
import useGetDocs from '../../hooks/useGetDocs';
import './containers.css';

const PrintMyRecipes = ({path}) => {
    const {docs, loading, error} = useGetDocs(`${path}/recipes`);
    console.log(path)

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    return (
    <div>
        <h1 className="text-4xl text-center mb-5">Recipes</h1>
        <ul>
            {docs.map(doc => (
                <li className="recipe-card-list-item">
                <strong className='text-xl'>{doc.name}</strong><br/>
                <strong>Ingredients: </strong>
                {doc.ingredients}<br/>
                <strong>Instructions: </strong>
                {doc.instructions}<br/>
                </li>
            ))}
        </ul>
    </div>
    );
};
export default PrintMyRecipes;
