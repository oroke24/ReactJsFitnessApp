//firebase/dayDataManager.js
import db from './firebaseFirestore';
import {collection, query, where, getDocs} from 'firebase/firestore';

export async function fetchWeeklyData(dates, userId) {
    const result ={};
    for(const date of dates) {
        const isoDate = date.toISOString().split('T')[0];
        const q = query(
            collection(db, 'dayData'),
            where('userId', '==', userId),
            where('date', '==', isoDate)
        );

        const snapshot = await getDocs(q);
        snapshot.forEach(doc=>{
            result[isoDate] = doc.data();
        });
    }
    return result;
}