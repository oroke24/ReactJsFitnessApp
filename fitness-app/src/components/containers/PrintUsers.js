import React from 'react';
import useGetDocs from '../../hooks/useGetDocs';

const PrintUsers = ({path}) => {
    const {docs, loading, error} = useGetDocs("users");
    console.log(path);

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    return (
    <div>
        <h3>Users</h3>
        <ul>
            {docs.map(doc => (
                <li key ={doc.id}>{doc.email}</li>
            ))}
        </ul>
    </div>
    );
};
export default PrintUsers;