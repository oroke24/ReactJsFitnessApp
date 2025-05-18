//firebase/dayDataManager.js
// *New
import db from './firebaseFirestore';
import { doc, getDoc, setDoc, updateDoc, query, where, collection, getDocs } from 'firebase/firestore';

export class dayDataManager {
  constructor(userEmail) {
    if(!userEmail){
      throw new Error("Email is required for dayDataManager.");
    }
    this.daysCollection = collection(db, 'users', userEmail, 'days');
  }

  async addRecipeToDay(date, recipeId, slot) {
    const recipeSlot = `recipe${Math.min(Math.max(slot, 1), 5)}Id`;
    const dayDocRef = doc(this.daysCollection, date);
    const existingDoc = await getDoc(dayDocRef);

    const update = { [recipeSlot]: recipeId };

    if (existingDoc.exists()) {
      await updateDoc(dayDocRef, update);
    } else {
      await setDoc(dayDocRef, update);
    }
  }

  async addExerciseToDay(date, exerciseId, slot) {
    const exerciseSlot = `exercise${Math.min(Math.max(slot, 1), 5)}Id`;
    const dayDocRef = doc(this.daysCollection, date);
    const existingDoc = await getDoc(dayDocRef);

    const update = { [exerciseSlot]: exerciseId };

    if (existingDoc.exists()) {
      await updateDoc(dayDocRef, update);
    } else {
      await setDoc(dayDocRef, update);
    }
  }

  async getDayFromDate(date) {
    const dayDocRef = doc(this.daysCollection, date);
    const snapshot = await getDoc(dayDocRef);

    if (!snapshot.exists()) {
      return {
        date,
        recipe1Id: '',
        recipe2Id: '',
        recipe3Id: '',
        recipe4Id: '',
        recipe5Id: '',
        exercise1Id: '',
        exercise2Id: '',
        exercise3Id: '',
        exercise4Id: '',
        exercise5Id: ''
      };
    }

    const data = snapshot.data();

    return {
      date,
      recipe1Id: data.recipe1Id || '',
      recipe2Id: data.recipe2Id || '',
      recipe3Id: data.recipe3Id || '',
      recipe4Id: data.recipe4Id || '',
      recipe5Id: data.recipe5Id || '',
      exercise1Id: data.exercise1Id || '',
      exercise2Id: data.exercise2Id || '',
      exercise3Id: data.exercise3Id || '',
      exercise4Id: data.exercise4Id || '',
      exercise5Id: data.exercise5Id || ''
    };
  }

  async deleteAllDays() {
    const snapshot = await getDocs(this.daysCollection);
    const promises = snapshot.docs.map(docSnap => docSnap.ref.delete());
    await Promise.all(promises);
  }
}

/*
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
    */