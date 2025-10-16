import React, { useState } from 'react';
import useGetDocs from '../../hooks/useGetDocs';
import './containers.css';
import './loading.css';
import './mobileCompatConfig.css';
import { Link } from 'react-router-dom';
import { deleteDocument } from '../../firebase/firebaseFirestore';
import ExerciseSwipable from './ExerciseSwipable';

const PrintMyRecipesHorizontal = ({ path }) => {
  const [isLoading, setLoading] = useState(false);
  var { docs, loading, error } = useGetDocs(`${path}/recipes`);
  //console.log(path)

  if (error) return <p>Error: {error}</p>;

  const sortedDocs = docs.slice().sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  return (
    <div className='flex overflow-x-auto flex-nowrap w-full space-x-4 '>
      {isLoading && (
        <div className="mt-5 container text-center flex overflow-x-auto space-x-4">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx} className="ps-1 flex flex-col items-center">
              <div className="w-[350px] h-[350px] recipe-gradient rounded-lg shadow animate-pulse"></div>
            </div>
          ))}
        </div>
      )}
      {sortedDocs.map((doc, index) => (
        <Link to={`/recipeBasic/${doc.name}`} state={{ doc }}>
          <div key={index} className='text-center w-[350px] h-[350px] border-4 rounded-lg shrink-0 recipe-gradient p-5 overflow-y-auto'>
            <strong className="text-xl">{doc.name}</strong>
            <div className="text-left">
              <br />
              <strong>Ingredients: </strong>
              <br />
              {doc.ingredients}
              <br /><br />
              <strong>Instructions: </strong>
              <br />
              {doc.instructions}
              <br />
            </div>
          </div>
        </Link>

        //Put card design here
      ))}
    </div>
  );
};
export default PrintMyRecipesHorizontal;

