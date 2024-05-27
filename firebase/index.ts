import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APPID,
};

// import {
//   getFirestore,
//   collection,
//   getDocs,
//   addDoc,
//   onSnapshot,
//   doc,
//   deleteDoc,
//   updateDoc,
//   query,
//   where,
// } from 'firebase/firestore';

//  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENTID,

// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // If already initialized, use that one
}
``;
// Initialize Firebase services
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export {
  auth,
  firestore,
  storage,
  // getFirestore,
  // collection,
  // getDocs,
  // addDoc,
  // onSnapshot,
  // doc,
  // deleteDoc,
  // updateDoc,
  // query,
  // where,
};
