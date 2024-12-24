import React, { useState } from "react";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useLocation, useParams, Link } from "react-router-dom";

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

    const handlTextAreaResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}`;
    }


    console.log("In EditItem, id: ", {id} );
    console.log("In EditItem, doc: ", doc );

    return(
        <div className="flex-auto justify-center overflow-auto">
            <Link to='../' className="text-4xl m-2"><FaArrowAltCircleLeft></FaArrowAltCircleLeft></Link>
            <h1 className="text-2xl"><strong>Editing</strong> "{id}"</h1>
            <div className="row">
                <textarea className="h-auto w-10/12 " 
                    type="text" 
                    value={nameValue} 
                    onChange={handleNameChange}
                    onInput={handlTextAreaResize}>
                </textarea>
            </div>
                <textarea  
                    className="resize-none w-10/12" 
                    type="text" 
                    value={ingredientsValue} 
                    onChange={handleIngredientsChange}
                    onInput={handlTextAreaResize}>
                </textarea>
            <div className="row h-auto">
                <textarea 
                    className="resize-none w-10/12" 
                    type="text" 
                    value={instructionsValue} 
                    onChange={handleInstructionsChange}
                    onInput={handlTextAreaResize}>
                </textarea>
            </div>
        </div>
    );
};

export default EditRecipe;