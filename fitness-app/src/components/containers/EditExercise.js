import React, { useState } from "react";
import { FaArrowAltCircleLeft, FaCheck, FaPlus, FaTrash, FaXing } from "react-icons/fa";
import { useLocation, useParams, Link, useNavigate} from "react-router-dom";
import './containers.css';
import { deleteDocument, addDocument2, saveAsNew, updateDocument } from "../../firebase/firebaseFirestore";

const EditExercise = () => {
    const {id} = useParams();
    const location = useLocation();
    const {doc} = location.state || {};
    const navigate = useNavigate();

    const [nameValue, setNameValue] = useState(doc?.name || '');
    const [ingredientsValue, setIngredientsValue] = useState(doc?.muscleGroup||'');

    const [instructionsValue, setInstructionsValue] = useState(doc?.instructions || '');

    const handleNameChange = (event) => {
        setNameValue(event.target.value);
    }
    const handleIngredientsChange = (event) => {
        setIngredientsValue(event.target.value);
    }
    const handleInstructionsChange = (event) => {
        setInstructionsValue(event.target.value);
    }
    const handleSaveAsNew =() =>{
        try{
            const exercise = {id: nameValue, name: nameValue, ingredients: ingredientsValue, instructions: instructionsValue};
            //usage('path', 'docObj')
            saveAsNew('exercises', exercise);
            handleClose();
        }catch(error){
            console.error("Error adding exercise: ", error);
        }
    }
    const handleUpdateThisCard =() =>{
        try{
            const exercise = {id: doc.id, name: nameValue, ingredients: ingredientsValue, instructions: instructionsValue};
            //usage('path', 'docObj')
            updateDocument('exercises', exercise);
            handleClose();
        }catch(error){
            console.error("Error adding exercise: ", error);
        }
    }
    const handleDeleteExercise = (exerciseName) => {
        try{
            //usage('path', 'docId')
            deleteDocument(`exercises`, exerciseName);
            //console.log("exercise to delete: ", exerciseName);
            handleClose();
        }catch(error){
            console.error("Error Deleting doc: ", error);
        }
    }
    const handleClose = () => {
        navigate(-1);
    }

    const handleTextAreaResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}`;
    }


    //console.log("In EditItem, id: ", {id} );
    //console.log("In EditItem, doc: ", doc );

    return(
        <div className="exercise-gradient edit-card-background flex flex-col items-center h-screen">
            {/*Back Button */}
            <Link to='../' className="text-7xl m-2"><FaArrowAltCircleLeft></FaArrowAltCircleLeft></Link>
            {/*Name area*/}
            <h1 className="text-2xl" 
                onChange={handleNameChange}>
                    <strong>Editing"</strong>{nameValue}<strong>"</strong>
            </h1>
            <textarea className="name-textarea text-4xl" 
                value={nameValue} 
                onChange={handleNameChange}
                onInput={handleTextAreaResize}>
            </textarea>
            {/*Muscle Group area*/}
            <h1 className="text-2xl"><strong>Muscle Group</strong></h1>
                <textarea  
                    className="card-textarea" 
                    type="text" 
                    value={ingredientsValue} 
                    onChange={handleIngredientsChange}
                    onInput={handleTextAreaResize}>
                </textarea>
            {/*Instructions area*/}
            <h1 className="text-2xl"><strong>Instructions</strong></h1>
                <textarea 
                    className="instructions-textarea" 
                    type="text" 
                    value={instructionsValue} 
                    onChange={handleInstructionsChange}
                    onInput={handleTextAreaResize}>
                </textarea>
                <div className="row w-11/12 m-10 flex justify-evenly">
                {/*Save as new Button */}
                <button 
                    className="flex items-center">
                        <Link 
                            onClick= {() => handleSaveAsNew()}
                            className="flex items-center">
                                <FaPlus className="text-3xl m-2"></FaPlus>
                            save as new
                        </Link>
                </button>
                {/*Save Button */}
                <button 
                    className="flex items-center">
                        <Link 
                            onClick= {() => handleUpdateThisCard()}
                            className="flex items-center">
                                <FaCheck className="text-3xl m-2"></FaCheck>
                            update this card 
                        </Link>
                </button>
                </div>
                {/*Delete Button */}
                <button 
                    className="p-3 mt-10 flex bg-red-600 text-2xl"
                    onClick={() => handleDeleteExercise(`${doc.name}`)}
                    >
                        <FaTrash></FaTrash>
                </button>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
        </div>
    );
};

export default EditExercise;
