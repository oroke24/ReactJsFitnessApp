import React, { useState } from "react";
import { FaArrowAltCircleLeft, FaCheck, FaPlus, FaTrash, FaXing } from "react-icons/fa";
import { useLocation, useParams, Link } from "react-router-dom";
import './containers.css';
import { deleteDocument } from "../../firebase/firebaseFirestore";

const EditRecipe = () => {
    const {id} = useParams();
    const location = useLocation();
    const {doc} = location.state || {};

    const [nameValue, setNameValue] = useState(doc.name || '');
    const [ingredientsValue, setIngredientsValue] = useState(doc.ingredients||'');
    const [instructionsValue, setInstructionsValue] = useState(doc.instructions || '');

    const handleNameChange = (event) => {
        setNameValue(event.target.value);
    }
    const handleIngredientsChange = (event) => {
        setIngredientsValue(event.target.value);
    }
    const handleInstructionsChange = (event) => {
        setInstructionsValue(event.target.value);
    }
    const handleDeleteRecipe = (recipeName) => {
        try{
            deleteDocument('recipes', recipeName);
            console.log("Recipe to delete: ", recipeName);
        }catch(error){
            console.error("Error Deleting doc: ", error);
        }
    }

    const handleTextAreaResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}`;
    }


    console.log("In EditItem, id: ", {id} );
    console.log("In EditItem, doc: ", doc );

    return(
        <div className="edit-card-background flex flex-col items-center h-screen">
            <Link to='../' className="text-4xl m-2"><FaArrowAltCircleLeft></FaArrowAltCircleLeft></Link>
            <h1 
                className="text-2xl"
                onChange={handleNameChange}
            >
                <strong>Editing"</strong>{nameValue}<strong>"</strong>
            </h1>
                <textarea className="recipe-name-textarea text-4xl" 
                    value={nameValue} 
                    onChange={handleNameChange}
                    onInput={handleTextAreaResize}>
                </textarea>
            <h1 className="text-2xl"><strong>Ingredients</strong></h1>
                <textarea  
                    className="recipe-textarea" 
                    type="text" 
                    value={ingredientsValue} 
                    onChange={handleIngredientsChange}
                    onInput={handleTextAreaResize}>
                </textarea>
            <h1 className="text-2xl"><strong>Instructions</strong></h1>
                <textarea 
                    className="recipe-textarea" 
                    type="text" 
                    value={instructionsValue} 
                    onChange={handleInstructionsChange}
                    onInput={handleTextAreaResize}>
                </textarea>
                <div className="row w-11/12 m-10 flex justify-evenly">
                <button 
                    className="flex">
                        <Link 
                            to='../' 
                            className="text-3xl m-2">
                                <FaPlus></FaPlus>
                        </Link>
                </button>
                <button 
                    className="flex">
                        <Link 
                            to='../' 
                            className="text-3xl m-2">
                                <FaCheck></FaCheck>
                        </Link>
                </button>
                </div>
                <button 
                    className="mt-10 flex bg-red-600"
                    onClick={() => handleDeleteRecipe(`${doc.name}`)}
                    >
                        <FaTrash></FaTrash>
                </button>
                <br></br>
                <br></br>
                <br></br>
        </div>
    );
};

export default EditRecipe;