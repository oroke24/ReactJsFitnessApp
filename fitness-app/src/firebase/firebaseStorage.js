import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import app from './firebaseConfig';

const storage = getStorage(app);

export const uploadFile = async(file, path) =>{
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    downloadURL = await getDownloadURL(storageRef);
};

export default storage;