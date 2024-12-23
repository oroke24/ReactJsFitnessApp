import {useState, useEffect} from 'react';
import { getDocuments } from '../firebase/firebaseFirestore';

//Hook to get users
const useGetDocs = (collectionName) => {
   const [docs, setDocs] = useState([]);
   const [loading, setLoading] = useState(true); 
   const [error, setError] = useState(null); 
   console.log("in useGetDocs: ", collectionName);

   useEffect(() => {
    const fetchDocs = async () => {
        try {
            console.log("in useEffect::fetchDocs: ", collectionName);
            const documents = await getDocuments(collectionName);
            setDocs(documents);
        } catch (error) {
            setError(error.message); 
        } finally{
            setLoading(false);
        }
    };
    fetchDocs();
   }, []);
   return{ docs, loading, error};
};
export default useGetDocs;