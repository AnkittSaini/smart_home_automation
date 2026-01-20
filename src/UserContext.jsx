import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update } from 'firebase/database';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup 
} from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeaYRq2zOyb-YtJGJ3So4xwyoot21X6oY",
    authDomain: "home-automation-ded78.firebaseapp.com",
    databaseURL: "https://home-automation-ded78-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "home-automation-ded78",
    storageBucket: "home-automation-ded78.appspot.com",
    messagingSenderId: "252098473315",
    appId: "1:252098473315:web:fca6057a1cb818fc0d7756",
    measurementId: "G-0NEVG368YJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// Create Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [channelStates, setChannelStates] = useState({});
    const [connectionStatus, setConnectionStatus] = useState('');
    const [loading, setLoading] = useState(true);

    // Auth state observer
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Database listener (only when user is authenticated)
    useEffect(() => {
        if (user) {
            const dbRef = ref(db);
            const unsubscribe = onValue(
                dbRef,
                (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setChannelStates(data);
                        setConnectionStatus("Connected to Realtime Database.");
                    } else {
                        // Initialize all relays to OFF if no data exists
                        const initialStates = {};
                        for (let i = 1; i <= 8; i++) {
                            initialStates[`relay${i}`] = false;
                        }
                        updateAllChannels(false);
                    }
                },
                (error) => {
                    console.error("Firebase read failed: " + error.name);
                    setConnectionStatus("Error: Could not connect to database.");
                }
            );

            return () => unsubscribe();
        } else {
            setChannelStates({});
            setConnectionStatus('');
        }
    }, [user]);

    // Authentication functions
    const login = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = async () => {
        return await signInWithPopup(auth, googleProvider);
    };

    const logout = async () => {
        return await signOut(auth);
    };

    // Database functions
    const updateChannelState = async (channelId, newState) => {
        const relayRef = ref(db, 'relay' + channelId);
        try {
            await set(relayRef, newState);
        } catch (error) {
            console.error("Error updating channel state: ", error);
            throw error;
        }
    };

    const updateAllChannels = async (newState) => {
        const updates = {};
        for (let i = 1; i <= 8; i++) {
            updates[`relay${i}`] = newState;
        }
        try {
            await update(ref(db), updates);
        } catch (error) {
            console.error("Error updating all channels: ", error);
            throw error;
        }
    };

    const value = {
        user,
        login,
        signup,
        googleSignIn,
        logout,
        channelStates,
        updateChannelState,
        updateAllChannels,
        connectionStatus,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;