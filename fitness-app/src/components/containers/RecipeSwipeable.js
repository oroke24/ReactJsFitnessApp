// RecipeCard.js
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Link } from 'react-router-dom';

const RecipeSwipable = ({ doc, handleDelete }) => {
    const[showDelete, setShowDelete] = useState(false);
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => setShowDelete(true),
        onSwipedRight: () => setShowDelete(false), 
        preventDefaultTouchmoveEvent: true,
    });

    return (
        <div key={doc.name} 
        className="relative">
            <div {...swipeHandlers} className="recipe-card">
                <Link to={`/recipeBasic/${doc.id}`} state={{ doc }}>
                    <li className="recipe-card-list-item recipe-gradient">
                        <strong className="text-xl">{doc.name}</strong><br />
                    </li>
                </Link>
            </div>

            {/* Conditionally Render Delete Button */}
            {showDelete && (
                <div
                    className= {`absolute h-full flex justify-center top-0 right-0 p-3 bg-red-500 text-white rounded-r-lg ${showDelete ? "visible" : "invisible"}`}
                    style={{ zIndex: 10, boxShadow: 2 }}
                >
                    <button onClick={() => handleDelete(doc.name)}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecipeSwipable;
