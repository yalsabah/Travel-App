import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDGyqdF9RgwcOo-wGyOAbSMmRFM4NHLMWs",
  authDomain: "alsabah-travel.firebaseapp.com",
  projectId: "alsabah-travel",
  storageBucket: "alsabah-travel.firebasestorage.app",
  messagingSenderId: "670654533826",
  appId: "1:670654533826:web:17354015ff503d9cabab5b",
  measurementId: "G-25X6EC3NJM"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
