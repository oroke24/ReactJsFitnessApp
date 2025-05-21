import React from "react";

const RepeatDayComponent = ({
    dayManager = dayDataManager,
    isoDate,
    recipes = [],
    exercises = []
}) => {

    const handleRepeat = (isoDate, recipe, slot) =>{
        dayManager.addRecipeToDay(isoDate, recipe, slot);
        //...
    }

    return(
        <div>
            <button 
                onClick={handleRepeat}
                className="p-5"
                    >Repeat
                </button>

        </div>
    );
}

export default RepeatDayComponent;