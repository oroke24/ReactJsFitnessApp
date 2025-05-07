import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import '../containers.css';
import './recipeCards.css';
import { FaClipboard, FaDownload, FaEdit, FaReceipt, FaRegClipboard, FaShare, FaSquare, FaUpload } from "react-icons/fa";
import copyToClipboard from "../../../hooks/copyToClipboard";
import saveDivAsImage from "../../../hooks/saveDivAsImage";
import copyDivImageToClipboard from "../../../hooks/copyDivImageToClipboard";

const RecipeBasic = () => {
    const {id} = useParams();
    const location = useLocation();
    const {doc} = location.state || {};
    const navigate = useNavigate();

    const [nameValue, setNameValue] = useState(doc?.name || '');
    const [muscleGroupValue, setMuscleGroupValue] = useState(doc?.muscleGroup ||'');
    const [ingredientsValue, setIngredientsValue] = useState(doc?.ingredients ||'');
    const [instructionsValue, setInstructionsValue] = useState(doc?.instructions || '');
    const [loading, setLoading] = useState(false);

    return(<div className="dark-light-gradient h-screen overflow-auto">
                {/**Back Button */} 
                <div className="absolute top-3 right-3">
                    <button onClick={() =>navigate(-1)}>close</button>
                </div>
            {/**Main Div */}
            <div className="main-container flex flex-col items-center justify-center overflow-y-auto">
                    {/**Buttons Row Div */}
                    <div className="mt-20 flex flex-row w-full justify-evenly">
                        {/**Copy Text Button */} 
                        <div className="">
                                <button 
                                className="flex items-center p-5 w-full justify-between"
                                onClick={() => copyToClipboard(nameValue, "Ingredients:", ingredientsValue, "Instructions:", instructionsValue)}>
                                    <FaRegClipboard className="text-2xl"></FaRegClipboard>
                                    {' Copy Text '}
                                    <FaReceipt></FaReceipt>
                                </button>
                        </div>
                        {/**Copy Button */} 
                        <div className="">
                                <button 
                                className="flex items-center p-5 w-full justify-between"
                                onClick={() => copyDivImageToClipboard("recipe-basic-card")}>
                                    <FaShare className="text-2xl"></FaShare>
                                    {' Share Card'}
                                    <FaSquare></FaSquare>
                                </button>
                        </div>
                    </div>

                {/**Card Background Div */}
                <div className="recipe-basic-card"
                    onClick={()=>navigate(`/editRecipe/${doc.name}`, {state: {doc}})}
                >
                    {/**Name Area */} 
                    <div className="recipe-basic-name">
                        {nameValue}
                    </div>
                    {/**Ingredients */} 
                    <div className="recipe-basic-sub-title">Ingredients</div>
                    <div className="recipe-basic-ingredients">
                        {ingredientsValue}
                    </div>
                    {/**Instructions */} 
                    <div className="recipe-basic-sub-title">Instructions</div>
                    <div className="recipe-basic-instructions">
                        {instructionsValue}
                    </div>
                </div>
                {/**Download Button */} 
                <div className="">
                        <button 
                        className="flex items-center justify-between w-full p-5" 
                        onClick={() => saveDivAsImage("recipe-basic-card", nameValue)}
                        >
                            <FaDownload className="text-2xl"></FaDownload>
                              Download Card
                        </button>
                </div>
        </div>
    </div>);
}
export default RecipeBasic;