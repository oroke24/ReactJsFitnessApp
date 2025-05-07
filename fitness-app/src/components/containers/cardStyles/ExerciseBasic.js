import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import '../containers.css';
import './exerciseCards.css';
import { FaBuffer, FaDownload, FaEdit, FaIdCard, FaIdCardAlt, FaReceipt, FaRegCalendar, FaRegClipboard, FaRegIdCard, FaShare, FaSquare, FaUpload } from "react-icons/fa";
import copyToClipboard from "../../../hooks/copyToClipboard";
import saveDivAsImage from "../../../hooks/saveDivAsImage";
import copyDivImageToClipboard from "../../../hooks/copyDivImageToClipboard";

const ExerciseBasic = () => {
    const {id} = useParams();
    const location = useLocation();
    const {doc} = location.state || {};
    const navigate = useNavigate();

    const [nameValue, setNameValue] = useState(doc?.name || '');
    const [muscleGroupValue, setMuscleGroupValue] = useState(doc?.muscleGroup ||'');
    const [instructionsValue, setInstructionsValue] = useState(doc?.instructions || '');
    const [loading, setLoading] = useState(false);


    return(<div className="dark-light-gradient h-screen overflow-auto">
            {/**Back Button */} 
            <div className="absolute top-3 right-3">
                <button onClick={() =>navigate(-1)}>close</button>
            </div>
            {/**Main Div */}
            <div className="main-container flex flex-col items-center justify-center">
                    {/**Buttons Row Div */}
                    <div className="mt-20 flex flex-row w-full justify-evenly">
                        
                        {/**Copy Text Button */} 
                        <div className="">
                                <button 
                                className="flex items-center justify-between w-full p-5"
                                onClick={() => copyToClipboard(nameValue, "Muscle Group(s):", muscleGroupValue, "Instructions:", instructionsValue)}
                                >
                                    <FaRegClipboard className="text-2xl"></FaRegClipboard>
                                    {' Copy Text '}
                                    <FaReceipt></FaReceipt>
                                </button>
                        </div>
                        {/**Upload/Share Card Button */} 
                        <div className="">
                                <button 
                                className="flex items-center justify-between w-full p-5"
                                onClick={() => copyDivImageToClipboard("exercise-basic-card")}
                                >
                                    <FaShare className="text-2xl"></FaShare>
                                    {' Share Card'}
                                    <FaSquare></FaSquare>
                                </button>
                        </div>
                    </div>
                {/**Card Background Div */}
                <div className="exercise-basic-card"
                    onClick={()=>navigate(`/editExercise/${doc.name}`, {state: {doc}})}
                >
                    {/**Name Area */} 
                    <div className="exercise-basic-name">
                        {nameValue}
                    </div>
                    {/**Ingredients */} 
                    <div className="exercise-basic-sub-title">Muscle Group</div>
                    <div className="exercise-basic-muscle-group">
                        {muscleGroupValue}
                    </div>
                    {/**Instructions */} 
                    <div className="exercise-basic-sub-title">Instructions</div>
                    <div className="exercise-basic-instructions">
                        {instructionsValue}
                    </div>
                </div>
                {/**Download Button */} 
                <div className="">
                        <button 
                        className="flex items-center justify-between w-full p-5" 
                        onClick={() => saveDivAsImage("exercise-basic-card", nameValue)}
                        >
                            <FaDownload className="text-2xl"></FaDownload>
                            Download Card
                        </button>
                </div>

            </div>
    </div>);
}
export default ExerciseBasic;
