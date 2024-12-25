import { addToEmail, getDocuments, saveAsNew } from "../firebase/firebaseFirestore";

const loadDefaultProfile = async (email) => {

    const guestRecipes = await getDocuments('users/guest/recipes');
    const guestExercises = await getDocuments('users/guest/exercises');

    guestRecipes.forEach((recipe)=>{
        console.log("users/guest/recipe: ", recipe);
        //saveAsNew('recipes', recipe);
        addToEmail('recipes', recipe, email);
    });
    guestExercises.forEach((exercise)=>{
        console.log("users/guest/exercise: ", exercise);
        //saveAsNew('exercise', exercise);
        addToEmail('exercise', exercise, email);
    });
    alert("all done initializing!");
};
export default loadDefaultProfile;