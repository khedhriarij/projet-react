// À la fin du fichier config.js
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDRHE_sVlpP0X9K2yDwNnOXfFeOJNzA2Mg",
  authDomain: "plateforme-educative-2020b.firebaseapp.com",
  projectId: "plateforme-educative-2020b",
  storageBucket: "plateforme-educative-2020b.appspot.com",
  messagingSenderId: "933499726809",
  appId: "1:933499726809:web:12277936f106d5eb4e47c8"
};

firebase.initializeApp(firebaseConfig)

const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()
const timestamp = firebase.firestore.Timestamp

// ⭐ AJOUTEZ CETTE LIGNE pour le debug
window.projectAuth = projectAuth;

export { projectFirestore, projectAuth, projectStorage, timestamp }