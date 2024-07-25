
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  authDomain: "myfitnessapp-8dd2d.firebaseapp.com",
  projectId: "myfitnessapp-8dd2d",
  storageBucket: "myfitnessapp-8dd2d.appspot.com",
  messagingSenderId: "67152972469",
  appId: "1:67152972469:web:e1aaf94d6aab1dbb278cfc",
  measurementId: "G-QDZ14S16DZ",
};





// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;


// Initialize the Vertex AI service
const vertexAI = getVertexAI(app);

// Initialize the generative model with a model that supports your use case
// Gemini 1.5 models are versatile and can be used with all API capabilities
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

// Wrap in an async function so you can use await
export async function generateContent(message) {
  // Provide a prompt that contains text
  const prompt = message + "Respond as a personal trainer."

  // To generate text output, call generateContent with the text input
  const result = await model.generateContent(prompt);

  const response = result.response;
  const text = response.text();
  return text;
}