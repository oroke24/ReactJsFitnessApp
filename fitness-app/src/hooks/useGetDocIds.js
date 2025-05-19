import {useState, useEffect} from 'react';

//Hook to get users
const useGetDocIds = (collectionName) => {
   const [docIds, setDocIds] = useState([]);
   const [loading, setLoading] = useState(true); 
   const [error, setError] = useState(null); 
   //console.log("in useGetDocs: ", collectionName);

   useEffect(() => {
    const fetchDocs = async () => {
        try {
            //console.log("in useEffect::fetchDocs: ", collectionName);
            const documents = await getDocumentIds(collectionName);
            setDocIds(documents);
        } catch (error) {
            setError(error.message); 
        } finally{
            setLoading(false);
        }
    };
    fetchDocs();
   }, []);
   return{ docIds, loading, error};
};
export default useGetDocIds;