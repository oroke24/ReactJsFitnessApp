import React, { useState } from "react";
import { FaArrowAltCircleLeft, FaArrowRight, FaBan, FaBrain, FaCheck, FaClone, FaConnectdevelop, FaCross, FaFontAwesomeLogoFull, FaGem, FaGoogle, FaPlus, FaRobot, FaTimes, FaTrash, FaXing } from "react-icons/fa";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import './containers.css';
import { deleteDocument, addDocument2, saveAsNew, updateDocument } from "../../firebase/firebaseFirestore";
import openAiRevamp from "../../hooks/openAiRevamp";
import aiRevampGemini from "../../hooks/geminiAiRevamp";
import OpenAI from "openai";
import './loading.css';

const EditRecipe = () => {
    const { id } = useParams();
    const location = useLocation();
    const { doc } = location.state || {};
    const navigate = useNavigate();
    console.log(`id: ${id}, location: ${{ location }}, doc: ${doc}`);

    const [nameValue, setNameValue] = useState(doc?.name || '');
    const [ingredientsValue, setIngredientsValue] = useState(doc?.ingredients || '');
    const [instructionsValue, setInstructionsValue] = useState(doc?.instructions || '');
    const [loading, setLoading] = useState(false);
    const [aiNotesValue, setAiNotesValue] = useState('');
    const [aiOpen, setAiOpen] = useState(false);

    const handleNameChange = (event) => {
        setNameValue(event.target.value);
    }
    const handleIngredientsChange = (event) => {
        setIngredientsValue(event.target.value);
    }
    const handleInstructionsChange = (event) => {
        setInstructionsValue(event.target.value);
    }
    const handleOpenAiRevamp = async () => {
        try {
            if (nameValue.trim() === "") {
                alert("Name cannot be empty.");
                return;
            }
            setLoading(true);
            const name = `(name: ${nameValue}) `;
            const content = name + ingredientsValue + instructionsValue;
            const aiCard = await openAiRevamp('recipe', content);
            setIngredientsValue(aiCard?.group_one.join('\n'));
            setInstructionsValue(aiCard?.group_two.join('\n'));
        } catch (error) {
            console.error("Error revamping recipe: ", error);
        } finally {
            setLoading(false);
        }
    }
    const handleGeminiAiRevamp = async () => {
        try {
            if (nameValue.trim() === "") {
                alert("Name cannot be empty.");
                return;
            }
            setLoading(true);
            const name = `(name: ${nameValue}) `;
            const content = name + ingredientsValue + instructionsValue;
            // pass optional notes
            const aiCard = await aiRevampGemini('recipe', content, aiNotesValue);
            setIngredientsValue(aiCard?.group_one.join('\n'));
            setInstructionsValue(aiCard?.group_two.join('\n'));
        } catch (error) {
            console.error("Error revamping recipe: ", error);
        } finally {
            setLoading(false);
        }
    }
    const handleSaveAsNew = async () => {
        try {
            setLoading(true);
            const recipe = { id: nameValue, name: nameValue, ingredients: ingredientsValue, instructions: instructionsValue };
            if (recipe.name.trim() === "") {
                alert("Name cannot be empty.");
                return;
            }
            //usage('path', 'docObj')
            await saveAsNew('recipes', recipe);
            alert(`Saved ${recipe.name} as a new card`);
            handleClose();
        } catch (error) {
            console.error("Error adding recipe: ", error);
        } finally {
            setLoading(false);
        }
    }
    const handleUpdateThisCard = async () => {
        try {
            setLoading(true);
            const checkNew = doc ? doc.id : id;
            const recipe = { id: checkNew, name: nameValue, ingredients: ingredientsValue, instructions: instructionsValue };
            if (recipe.name.trim() === "") {
                alert("Name cannot be empty.");
                return;
            }
            //usage('path', 'docObj')
            await updateDocument('recipes', recipe);
            alert(`Updated ${id} to ${nameValue}`);
            handleClose();
        } catch (error) {
            console.error("Error adding recipe: ", error);
        } finally {
            setLoading(false);
        }
    }
    const handleDeleteRecipe = (recipeName) => {
        try {
            if (window.confirm(`Are you sure you want to delete ${recipeName}?`)) {
                setLoading(true);
                //usage('path', 'docId')
                deleteDocument(`recipes`, recipeName);
                //console.log("Recipe to delete: ", recipeName);
                handleClose();
                alert(`${recipeName} successfully deleted!`);
            }
        } catch (error) {
            console.error("Error Deleting doc: ", error);
        } finally {
            setLoading(false);
        }
    }
    const handleClose = () => {
        navigate(`/`);
    }
    const handleBackToCard = (recipeName) => {
        navigate(`/recipeBasic/${recipeName}`)
    }
    const handleTextAreaResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}`;
    }

    //console.log("In EditItem, id: ", {id} );
    //console.log("In EditItem, doc: ", doc );

    return (
        <div className="recipe-gradient edit-card-background flex flex-col items-center h-dvh">
            {loading && (
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                </div>
            )}
            {/*Back Button */}
            <div className="w-full flex justify-end">
                <button className="bg-gray-500 flex justify-center items-end p-2 m-5"
                    onClick={() => navigate(-1)}
                >
                    cancel
                    <FaTimes className="text-2xl" />
                </button>
            </div>
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
            {/**AI revamp section */}
            <div className="w-3/4 p-2 mt-5 outline rounded-3xl foggy-background">
                <div className="flex items-center justify-center p-2" onClick={() => setAiOpen(o => !o)} aria-expanded={aiOpen}>
                    <div className="flex items-center">
                        <FaRobot className="text-2xl color-white mr-3" />
                        <div className="text-xl color-white">
                            Ai Revamp
                        </div>
                    </div>
                </div>
                {aiOpen && (
                    <>
                        <textarea
                            className="mb-4 p-2 color-white foggy-background rounded"
                            placeholder="Optional: add specific details for the revamp (allowed to be empty)"
                            value={aiNotesValue}
                            onChange={(e) => setAiNotesValue(e.target.value)}
                            onInput={handleTextAreaResize}
                        />
                        {/**AI Buttons Row */}
                        <div className="flex flex-row justify-evenly">
                            {/*open ai revamp Button */}
                            {/**
                    <button
                        className="flex items-center">
                        <Link
                            onClick={() =>
                                //handleOpenAiRevamp() //temporarily disabled
                                alert("OpenAi ChatGPT should be back up by November 1st.\nWaiting on funding, sorry for the wait.")
                            }
                            className="flex items-center">
                            <FaConnectdevelop className="text-3xl m-2"></FaConnectdevelop>
                            ChatGPT
                        </Link>
                    </button>
                     */}
                            {/*gemini ai revamp Button */}
                            <button
                                className="flex items-center">
                                <Link
                                    onClick={() =>
                                        handleGeminiAiRevamp() //temporarily disabled
                                        //alert("AiRevamp should be back up by November 1st.\nWaiting on funding, sorry for the wait.")
                                    }
                                    className="flex items-center">
                                    <FaConnectdevelop className="text-3xl m-2"></FaConnectdevelop>
                                    <FaArrowRight className="text-3xl m-2" />
                                    <FaClone className="text-3xl m-2" />
                                </Link>
                            </button>
                        </div>
                    </>
                )}
            </div>
            <div className="row w-11/12 mt-16 flex justify-evenly">
                {/*Update Button */}
                {id != "NewItem" //if id isnt NewItem 
                    ?//show update button
                    <Link
                        onClick={() => handleUpdateThisCard()}
                        className="flex items-center justify-center w-1/2 h-20">
                        <button
                            className="flex text-2xl items-center justify-center w-full h-20">
                            <FaCheck className="text-3xl m-2"></FaCheck>
                            Update this card
                        </button>
                    </Link>
                    ://else show nothing
                    <></>
                }
                {/*Save as new Button */}
                <Link
                    onClick={() => handleSaveAsNew()}
                    className="flex items-center justify-center w-1/2 h-20">
                    <button
                        className="flex text-2xl items-center justify-center w-full h-20">
                        <FaPlus className="text-3xl m-2"></FaPlus>
                        Save as new
                    </button>
                </Link>
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