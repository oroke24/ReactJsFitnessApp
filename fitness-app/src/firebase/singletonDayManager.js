import { dayDataManager } from './dayDataManager';
import auth from './firebaseAuth';

let cachedManager = null;

export function getDayDataManager() {
  if (!cachedManager) {
    const email = auth?.currentUser?.email;
    if (!email) throw new Error('User not logged in.');
    cachedManager = new dayDataManager(email);
  }
  return cachedManager;
}

export function clearDayDataManagerCache() {
  cachedManager = null; // use this when logging out
}
