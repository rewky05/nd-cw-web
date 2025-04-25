import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA_7k_VHIjJ5c3CyQpSLv2x38HWC3hQkuU",
    authDomain: "ndcw-12f99.firebaseapp.com",
    databaseURL: "https://ndcw-12f99-default-rtdb.firebaseio.com",
    projectId: "ndcw-12f99",
    storageBucket: "ndcw-12f99.firebasestorage.app",
    messagingSenderId: "673329660984",
    appId: "1:673329660984:web:99f6b9eeb69279884c12cd",
    measurementId: "G-E9R4VZHB1L"
  };

const app = initializeApp(firebaseConfig)

export const database = getDatabase(app)
export const auth = getAuth(app);
