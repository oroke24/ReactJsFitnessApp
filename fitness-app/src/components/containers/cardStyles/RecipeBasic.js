import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import '../containers.css';
import './recipeCards.css';
import { FaClipboard, FaDownload, FaEdit, FaReceipt, FaRegClipboard, FaShare, FaSquare, FaUpload, FaHome } from "react-icons/fa";
import copyToClipboard from "../../../hooks/copyToClipboard";
import saveDivAsImage from "../../../hooks/saveDivAsImage";
import copyDivImageToClipboard from "../../../hooks/copyDivImageToClipboard";

const RecipeBasic = () => {
    const { id } = useParams();
    const location = useLocation();
    const { doc } = location.state || {};
    const navigate = useNavigate();

    const [nameValue, setNameValue] = useState(doc?.name || '');
    const [muscleGroupValue, setMuscleGroupValue] = useState(doc?.muscleGroup || '');
    const [ingredientsValue, setIngredientsValue] = useState(doc?.ingredients || '');
    const [instructionsValue, setInstructionsValue] = useState(doc?.instructions || '');
    const [loading, setLoading] = useState(false);

    const handleEditClick = () => {
        navigate(`/editRecipe/${doc.name}`, { state: { doc } })
    }

    return (<div className="dark-light-gradient h-screen overflow-auto">
        {/**Back/Home Button */}
        <div
            style={{ margin: '30px', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
            <Link to="/" className='flex justify-center w-3/4 items-center p-3 rounded-3xl foggy-background outline text-5xl'><FaHome className="fill-white"/></Link>
        </div>
        {/**Main Div */}
        <div className="main-container flex flex-col items-center justify-center overflow-y-auto">

            {/**Edit Button */}
            <Link
                to={`/editRecipe/${doc.name}`}
                state={{ doc }}
                className="flex mt-10 items-end justify-between text-2xl font-bold"
            >
                Edit
                <FaEdit className="text-4xl ms-2" />
            </Link>

            {/**Card Background Div */}
            <div className="recipe-basic-card"
            >
                {/**Name Area */}
                <div className="recipe-basic-name">
                    <div className="">
                        {nameValue}
                    </div>
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
            {/**Buttons Row Div */}
            <div className="mt-10 flex flex-row w-full justify-evenly">
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
                        onClick={() => copyDivImageToClipboard("recipe-basic-card")}
                    >
                        <FaShare className="text-2xl"></FaShare>
                        {' Share Card'}
                        <FaSquare></FaSquare>
                    </button>
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