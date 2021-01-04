import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyBCWXkktyFT2FmccFPUJMUE11qUQZ9SKvo",
  authDomain: "repetise.firebaseapp.com",
  projectId: "repetise",
  storageBucket: "repetise.appspot.com",
  messagingSenderId: "115136053672",
  appId: "1:115136053672:web:81a1a530538e2b50385d9d",
  measurementId: "G-JQCKRWJWL6"
})

export const auth = app.auth()
export default app
