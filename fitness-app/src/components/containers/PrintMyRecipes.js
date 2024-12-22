import React from 'react';
import useGetDocs from '../../hooks/useGetDocs';
import './containers.css';

const PrintMyRecipes = ({path}) => {
    const {docs, loading, error} = useGetDocs(path);
    console.log(path)

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    return (
    <div>
        <h3>Recipes</h3>
        <ul>
            {docs.map(doc => (
                <li className="recipe-card-list-item">{doc.id}
                {doc.imgUrl}
                {doc.ingredients}
                {doc.name}</li>
            ))}
        </ul>
    </div>
    );
};
export default PrintMyRecipes;
