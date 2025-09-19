import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBiprLotolTQXx1X6zfp4_H9dEKe3dtwGs",
  authDomain: "full-stack-react-2da35.firebaseapp.com",
  projectId: "full-stack-react-2da35",
  storageBucket: "full-stack-react-2da35.firebasestorage.app",
  messagingSenderId: "779142017362",
  appId: "1:779142017362:web:37c6046eebf0b314d38a8b",
};


const app = initializeApp(firebaseConfig);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
