import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signOut as fbSignOut, updateProfile } from 'firebase/auth';
import { firebaseConfig } from '../Secrets';

// Initialize Firebase Auth
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(displayName, email, password) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCred.user, { displayName: displayName });
  return userCred;
}

export function signOut() {
  return fbSignOut(auth);
}

export function getAuthUser() {
  return auth.currentUser;
}
