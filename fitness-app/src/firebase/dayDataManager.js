//firebase/dayDataManager.js
// *New
import db from './firebaseFirestore';
import { doc, getDoc, setDoc, updateDoc, query, where, collection, getDocs, documentId } from 'firebase/firestore';

export class dayDataManager {
  constructor(userEmail) {
    if(!userEmail){
      throw new Error("Email is required for dayDataManager.");
    }
    this.daysCollection = collection(db, 'users', userEmail, 'days');
    this.recipesCollection = collection(db, 'users', userEmail, 'recipes');
    this.exercisesCollection = collection(db, 'users', userEmail, 'exercises');
  }

  async getRecipeIds(){
    const snapshot = await getDocs(this.recipesCollection);
    return snapshot.docs.map(doc => doc.id);
  };
  async getExerciseIds(){
    const snapshot = await getDocs(this.exercisesCollection);
    return snapshot.docs.map(doc => doc.id);
  };

  async addRecipeToDay(date, recipeId, slot) {
    const recipeSlot = `recipe${Math.min(Math.max(slot, 1), 5)}Id`;
    const dayDocRef = doc(this.daysCollection, date);

      await setDoc(dayDocRef, {[recipeSlot]: recipeId}, {merge: true});
  }

  async addExerciseToDay(date, exerciseId, slot) {
    const exerciseSlot = `exercise${Math.min(Math.max(slot, 1), 5)}Id`;
    const dayDocRef = doc(this.daysCollection, date);

      await setDoc(dayDocRef, {[exerciseSlot]: exerciseId}, {merge:true});
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

  /**
   * Fetch days within an inclusive ISO date range (YYYY-MM-DD) using documentId range.
   * Returns a map of ISO date -> { hasRecipes: boolean, hasExercises: boolean }
   */
  async getDaysInRange(startIso, endIso) {
    const q = query(
      this.daysCollection,
      where(documentId(), '>=', startIso),
      where(documentId(), '<=', endIso)
    );
    const snapshot = await getDocs(q);
    const map = {};
    snapshot.forEach((docSnap) => {
      const id = docSnap.id; // ISO date string
      const data = docSnap.data() || {};
      const hasRecipes = Boolean(
        data.recipe1Id || data.recipe2Id || data.recipe3Id || data.recipe4Id || data.recipe5Id
      );
      const hasExercises = Boolean(
        data.exercise1Id || data.exercise2Id || data.exercise3Id || data.exercise4Id || data.exercise5Id
      );
      map[id] = { hasRecipes, hasExercises };
    });
    return map;
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