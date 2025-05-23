import React, { useState } from "react";
import { FaArrowAltCircleLeft, FaCheck, FaPlus, FaRobot, FaTrash, FaXing } from "react-icons/fa";
import { useLocation, useParams, Link, useNavigate} from "react-router-dom";
import './containers.css';
import { deleteDocument, addDocument2, saveAsNew, updateDocument } from "../../firebase/firebaseFirestore";
import aiRevamp from "../../hooks/aiRevamp";
import OpenAI from "openai";
import './loading.css';

const EditRecipe = () => {
    const {id} = useParams();
    const location = useLocation();
    const {doc} = location.state || {};
    const navigate = useNavigate();
    console.log(`id: ${id}, location: ${{location}}, doc: ${doc}`);

    const [nameValue, setNameValue] = useState(doc?.name || '');
    const [ingredientsValue, setIngredientsValue] = useState(doc?.ingredients||'');
    const [instructionsValue, setInstructionsValue] = useState(doc?.instructions || '');
    const [loading, setLoading] = useState(false);

    const handleNameChange = (event) => {
        setNameValue(event.target.value);
    }
    const handleIngredientsChange = (event) => {
        setIngredientsValue(event.target.value);
    }
    const handleInstructionsChange = (event) => {
        setInstructionsValue(event.target.value);
    }
    const handleAiRevamp = async () =>{
        try{
            if(nameValue.trim() === ""){
                alert("Name cannot be empty.");
                return;
            }
            setLoading(true);
            const name = `(name: ${nameValue}) `;
            const content = name + ingredientsValue + instructionsValue;
            const aiCard = await aiRevamp('recipe', content);
            setIngredientsValue(aiCard?.group_one.join('\n'));
            setInstructionsValue(aiCard?.group_two.join('\n'));
        }catch(error){
            console.error("Error revamping recipe: ", error);
        }finally{
            setLoading(false);
        }
    }
    const handleSaveAsNew = async () =>{
        try{
            setLoading(true);
            const recipe = {id: nameValue, name: nameValue, ingredients: ingredientsValue, instructions: instructionsValue};
            if(recipe.name.trim() === ""){
                alert("Name cannot be empty.");
                return;
            }
            //usage('path', 'docObj')
            await saveAsNew('recipes', recipe);
            alert(`Saved ${recipe.name} as a new card`);
            handleClose();
        }catch(error){
            console.error("Error adding recipe: ", error);
        }finally{
            setLoading(false);
        }
    }
    const handleUpdateThisCard = async () =>{
        try{
            setLoading(true);
            const recipe = {id: doc.id, name: nameValue, ingredients: ingredientsValue, instructions: instructionsValue};
            if(recipe.name.trim() === ""){
                alert("Name cannot be empty.");
                return;
            }
            //usage('path', 'docObj')
            await updateDocument('recipes', recipe);
            alert(`Updated ${doc.id} to ${nameValue}`);
            handleClose();
        }catch(error){
            console.error("Error adding recipe: ", error);
        }finally{
            setLoading(false);
        }
    }
    const handleDeleteRecipe = (recipeName) => {
        try{
            setLoading(true);
            //usage('path', 'docId')
            deleteDocument(`recipes`, recipeName);
            //console.log("Recipe to delete: ", recipeName);
            handleClose();
        }catch(error){
            console.error("Error Deleting doc: ", error);
        }finally{
            setLoading(false);
            alert(`${recipeName} successfully deleted!`);
        }
    }
    const handleClose = () => {
        navigate(`/`);
    }
    const handleTextAreaResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}`;
    }

    //console.log("In EditItem, id: ", {id} );
    //console.log("In EditItem, doc: ", doc );

    return(
        <div className="recipe-gradient edit-card-background flex flex-col items-center h-screen">
            {loading && (
                <div className="loading-screen">
                    <div className= "loading-spinner"></div>
                </div>
                )}
            {/*Back Button */}
            <button className="absolute top-5 right-5"><Link to='../' className="m-2">close</Link></button>
            {/*Name area*/}
            <h1 className="text-2xl mt-10" 
                onChange={handleNameChange}>
                    <strong>Editing"</strong>{nameValue}<strong>"</strong>
            </h1>
            <textarea className="name-textarea text-4xl" 
                value={nameValue} 
                onChange={handleNameChange}
                onInput={handleTextAreaResize}>
            </textarea>
            {/*Ingredients area*/}
            <h1 className="text-2xl mt-10"><strong>Ingredients</strong></h1>
                <textarea  
                    className="ingredients-textarea" 
                    type="text" 
                    value={ingredientsValue} 
                    onChange={handleIngredientsChange}
                    onInput={handleTextAreaResize}>
                </textarea>
            {/*Instructions area*/}
            <h1 className="text-2xl mt-10"><strong>Instructions</strong></h1>
                <textarea 
                    className="instructions-textarea" 
                    type="text" 
                    value={instructionsValue} 
                    onChange={handleInstructionsChange}
                    onInput={handleTextAreaResize}>
                </textarea>
                {/*ai revamp Button */}
                <button 
                    className="flex items-center mt-10">
                        <Link 
                            onClick= {() => handleAiRevamp()}
                            className="flex items-center">
                                <FaRobot className="text-3xl m-2"></FaRobot>
                            aiRevamp 
                        </Link>
                </button>
                <div className="row w-11/12 mt-16 flex justify-evenly">
                {/*Update Button */}
                {id != "NewItem" //if id isnt NewItem 
                ?//show update button
                <button 
                    className="flex items-center justify-center w-1/2 h-20">
                        <Link 
                            onClick= {() => handleUpdateThisCard()}
                            className="flex items-center">
                                <FaCheck className="text-3xl m-2"></FaCheck>
                            update this card 
                        </Link>
                </button>
                ://else show nothing
                <></>
                }
                {/*Save as new Button */}
                <button 
                    className="flex items-center justify-center w-1/2 h-20">
                        <Link 
                            onClick= {() => handleSaveAsNew()}
                            className="flex items-center">
                                <FaPlus className="text-3xl m-2"></FaPlus>
                            save as new
                        </Link>
                </button>
                </div>
                {/*Delete Button */}
                {id != "NewItem" //if id isn't NewItem
                ?//show delete button
                <button 
                    className="mt-32 flex bg-red-600 text-2xl w-max items-center"
                    onClick={() => handleDeleteRecipe(`${doc.name}`)}
                    >
                        <FaTrash className="m-2"></FaTrash>
                        Delete Forever?
                </button>
                ://else show nothing (newItems are already empty, no need to delete)
                <></>
                }
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
        </div>
    );
};

export default EditRecipe;