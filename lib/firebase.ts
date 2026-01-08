
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAV09edHb-EvI7LUvc8ibhlgam4mzAsuhU",
  authDomain: "git-view-3d298.firebaseapp.com",
  projectId: "git-view-3d298",
  storageBucket: "git-view-3d298.firebasestorage.app",
  messagingSenderId: "134306260492",
  appId: "1:134306260492:web:7348417fcfed63807f7029",
  measurementId: "G-D346GF2S75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(file: File, setProgress?: (progress: number) => void){
    return new Promise((resolve,reject) => {
        try{
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', snapshot => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if(setProgress){
                    setProgress(progress);
                }

                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }

            },error => {
                reject(error);
            },() => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
                    resolve(downloadUrl);
                } )
            })
        } catch(error){
            console.error(error);
            reject(error);

        }
    })
}