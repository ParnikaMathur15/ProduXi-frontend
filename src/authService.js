// authService.js
import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Signup
export async function signUp(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  localStorage.setItem("uid", userCredential.user.uid);
  return userCredential.user;
}

// Login
export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  localStorage.setItem("uid", userCredential.user.uid);
  return userCredential.user;
}

export async function googleLogin() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
}

// Logout
export async function logout() {
  await signOut(auth);
  localStorage.removeItem("uid");
}

// Auth state listener
export function listenForAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
