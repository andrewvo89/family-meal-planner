import { FirebaseOptions, initializeApp } from 'firebase/app';

import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// https://firebase.google.com/docs/web/setup
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig: FirebaseOptions = {
  // ...
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

export const auth = getAuth(app);
