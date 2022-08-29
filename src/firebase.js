import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

//firebase sets tokens for you

const app = initializeApp({
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  apiKey: 'AIzaSyDTxoA9_lLttipGq4Aqp1I5EdGqswmW9sI',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
});

export const auth = getAuth(app);
//auth is user currently authenticated to firebase

export const db = getFirestore(app);
const analytics = getAnalytics(app);
/*google analytics - add gtag (google tag )
 */

export default app;
