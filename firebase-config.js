import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhvZXmusoB02FP6yA5w2RNwmdJadOr4Tg",
  authDomain: "guia1-23459.firebaseapp.com",
  projectId: "guia1-23459",
  storageBucket: "guia1-23459.firebasestorage.app",
  messagingSenderId: "862045707475",
  appId: "1:862045707475:web:612e498abd24c7bd548826"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
