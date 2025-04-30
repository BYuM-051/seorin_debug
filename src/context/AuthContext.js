// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { ref, get } from "firebase/database";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Look up the user's role from the Realtime Database ("users" node)
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setRole(snapshot.val().role); // "admin" or "user"
        } else {
          setRole("user");
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    await setPersistence(auth, browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  }
  const logout = () => signOut(auth);
  const signup = async (email, password) => {
    await setPersistence(auth, browserSessionPersistence);
    return createUserWithEmailAndPassword(auth, email, password);
  }
  return (
    <AuthContext.Provider value={{ currentUser, role, login, logout, signup }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
