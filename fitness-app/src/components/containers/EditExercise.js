import React, { useState } from "react";
import { FaArrowAltCircleLeft, FaBrain, FaCheck, FaConnectdevelop, FaGoogle, FaPlus, FaRobot, FaTrash, FaXing } from "react-icons/fa";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import './containers.css';
import { deleteDocument, addDocument2, saveAsNew, updateDocument } from "../../firebase/firebaseFirestore";
import './loading.css';
import openAiRevamp from "../../hooks/openAiRevamp";
import aiRevampGemini from "../../hooks/geminiAiRevamp";

const EditExercise = () => {
    const { id } = useParams();
    const location = useLocation();
    const { doc } = location.state || {};
    const navigate = useNavigate();

    const [nameValue, setNameValue] = useState(doc?.name || '');
    const [muscleGroupValue, setMuscleGroupValue] = useState(doc?.muscleGroup || '');
    const [instructionsValue, setInstructionsValue] = useState(doc?.instructions || '');
    const [loading, setLoading] = useState(false);

    const handleNameChange = (event) => {
        setNameValue(event.target.value);
    }
    const handleMuscleGroupChange = (event) => {
        setMuscleGroupValue(event.target.value);
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
            const content = name + muscleGroupValue + instructionsValue;
            const aiCard = await openAiRevamp('recipe', content);
            setMuscleGroupValue(aiCard?.group_one.join('\n'));
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
            const content = name + muscleGroupValue + instructionsValue;
            //const aiCard = await aiRevamp('recipe', content);
            const aiCard = await aiRevampGemini('exercise', content);
            setMuscleGroupValue(aiCard?.group_one.join('\n'));
            setInstructionsValue(aiCard?.group_two.join('\n'));
        } catch (error) {
            console.error("Error revamping exercise: ", error);
        } finally {
            setLoading(false);
        }
    }
    {/**
    const handleAiRevamp = async () => {
        try {
            if (nameValue.trim() === "") {
                alert("Name cannot be empty.");
                return;
            }
            setLoading(true);
            const name = `(name: ${nameValue}) `
            const content = name + muscleGroupValue + instructionsValue;
            const aiCard = await openAiRevamp('exercise', content);
            setMuscleGroupValue(aiCard?.group_one.join('\n'));
            setInstructionsValue(aiCard?.group_two.join('\n'));
        } catch (error) {
            console.error("Error revamping exercise: ", error);
        } finally {
            setLoading(false);
        }
    } 
    */}
    const handleSaveAsNew = async () => {
        try {
            setLoading(true);
            const exercise = { id: nameValue, name: nameValue, muscleGroup: muscleGroupValue, instructions: instructionsValue };
            if (exercise.name.trim() === "") {
                alert("Name cannot be empty.");
                return;
            }
            //usage('path', 'docObj')
            await saveAsNew('exercises', exercise);
            alert(`Saved ${exercise.name} as a new card`);
            handleClose();
        } catch (error) {
            console.error("Error adding exercise: ", error);
        } finally {
            setLoading(false);
        }
    }
    const handleUpdateThisCard = async () => {
        try {
            setLoading(true);
            const checkNew = doc ? doc.id : "New card";
            const exercise = { id: checkNew, name: nameValue, muscleGroup: muscleGroupValue, instructions: instructionsValue };
            if (exercise.name.trim() === "") {
                alert("Name cannot be empty.");
                return;
            }
            //usage('path', 'docObj')
            await updateDocument('exercises', exercise);
            alert(`Updated ${doc.id} to ${nameValue}`);
            handleClose();
        } catch (error) {
            console.error("Error adding exercise: ", error);
        } finally {
            setLoading(false)
        }
    }
    const handleDeleteExercise = (exerciseName) => {
        try {
        if (window.confirm(`Are you sure you want to delete ${exerciseName}?`)) {
            setLoading(true);
            //usage('path', 'docId')
            deleteDocument(`exercises`, exerciseName);
            //console.log("exercise to delete: ", exerciseName);
            handleClose();
            alert(`${exerciseName} successfully deleted!`);
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

    const handleTextAreaResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}`;
    }


    //console.log("In EditItem, id: ", {id} );
    //console.log("In EditItem, doc: ", doc );

    return (
        <div className="exercise-gradient edit-card-background flex flex-col items-center h-dvh">
            {loading && (
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                </div>
            )}
            {/*Back Button */}
            <div className="w-full flex justify-end">
                <button className="flex justify-center items-end p-4 m-5 text-xl"
                    onClick={() => navigate(-1)}
                >
                    cancel
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
            {/*Muscle Group area*/}
            <h1 className="text-2xl mt-10"><strong>Muscle Group</strong></h1>
            <textarea
                className="muscle-group-textarea"
                type="text"
                value={muscleGroupValue}
                onChange={handleMuscleGroupChange}
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
            <div className="w-3/4 mt-5 outline rounded-3xl foggy-background">
                <FaRobot className="w-full text-center color-white text-2xl"/>
                <div className="w-full mb-5 text-center text-xl color-white">Ai Revamp Options</div>
                {/**AI Buttons Row */}
                <div className="flex flex-row justify-evenly">
                    {/*open ai revamp Button */}
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
                    {/*gemini ai revamp Button */}
                    <button
                        className="flex items-center">
                        <Link
                            onClick={() =>
                                handleGeminiAiRevamp() //temporarily disabled
                                //alert("AiRevamp should be back up by November 1st.\nWaiting on funding, sorry for the wait.")
                            }
                            className="flex items-center">
                            <FaGoogle className="text-3xl m-2"></FaGoogle>
                            Gemini
                        </Link>
                    </button>
                </div>
            </div>
            <div className="row w-11/12 mt-16 flex justify-evenly">
                {/*Update Button */}
                {id != "NewItem"//if id isn't NewItem
                    ?//show update button
                    <Link
                        onClick={() => handleUpdateThisCard()}
                        className="flex items-center justify-center w-1/2 h-20">
                        <button
                            className="flex text-2xl items-center w-full h-20 justify-center">
                            <FaCheck className="text-3xl m-2"></FaCheck>
                            Update this card
                        </button>
                    </Link>
                    ://else show nothing`
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
                    onClick={() => handleDeleteExercise(`${doc.name}`)}
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

export default EditExercise;