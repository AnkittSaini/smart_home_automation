import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// --- Configuration ---
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

const channels = [
    { id: 1, name: 'Living Room Light', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>` },
    { id: 2, name: 'Kitchen Appliance', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><path d="M16 8.9c-1.3 1.3-3.2 1.3-4.5 0-1.3-1.3-1.3-3.2 0-4.5s3.2-1.3 4.5 0c1.3 1.3 1.3 3.2 0 4.5Z"/><path d="M18 14.2c-1.5-1.5-3.8-1.5-5.3 0-1.5 1.5-1.5 3.8 0 5.3 1.5 1.5 3.8 1.5 5.3 0 1.5-1.5 1.5-3.8 0-5.3Z"/></svg>` },
    { id: 3, name: 'Bedroom Lamp', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/><path d="M12 22v-2"/></svg>` },
    { id: 4, name: 'Garage Door', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14V6c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v8"/><path d="M19 14v2c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-2"/><path d="M5 14h14"/><path d="M12 14v-4"/></svg>` },
    { id: 5, name: 'Thermostat', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>` },
    { id: 6, name: 'Garden Sprinkler', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.4s-3.6-2.6-3.6-2.6A4 4 0 0 0 8 7c0 2-1 3.9-3 5.4S2 13 2 15a7 7 0 0 0 7 7"/><path d="M12 12v10"/></svg>` },
    { id: 7, name: 'Security Cam', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/></svg>` },
    { id: 8, name: 'Main Power', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>` }
];

// --- Firebase Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Google Provider Init
const googleProvider = new GoogleAuthProvider();

// --- DOM Elements ---
const loginPage = document.getElementById('login-page');
const mainContent = document.getElementById('main-content');
const loginForm = document.getElementById('login-form');
const signupBtn = document.getElementById('signup-btn');
const googleBtn = document.getElementById('google-btn');
const logoutBtn = document.getElementById('logout-btn');
const authError = document.getElementById('auth-error');
const userEmailDisplay = document.getElementById('user-email');
const channelsGrid = document.getElementById('channels-grid');
const statusLog = document.getElementById('status-log');
const masterOnBtn = document.getElementById('master-on');
const masterOffBtn = document.getElementById('master-off');
const connectionStatus = document.getElementById('connectionStatus');
const settingsToggle = document.getElementById('settings-toggle');
const settingsMenu = document.getElementById('settings-menu');

// --- Functions ---

function createChannelCards() {
    channelsGrid.innerHTML = '';
    channels.forEach(channel => {
        const card = document.createElement('div');
        card.className = 'channel-card bg-zinc-800 p-4 rounded-lg flex flex-col items-center justify-center aspect-square';
        card.id = `channel-${channel.id}`;
        card.innerHTML = `
            <div class="text-zinc-400 mb-2">${channel.icon}</div>
            <h3 class="font-semibold text-center text-sm mb-4">${channel.name}</h3>
            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle-${channel.id}" id="toggle-${channel.id}" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                <label for="toggle-${channel.id}" class="toggle-label block overflow-hidden h-6 rounded-full bg-zinc-600 cursor-pointer"></label>
            </div>`;
        channelsGrid.appendChild(card);
    });
}

function logStatus(message) {
    const p = document.createElement('p');
    p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    statusLog.insertBefore(p, statusLog.firstChild);
    if (statusLog.children.length > 20) {
        statusLog.removeChild(statusLog.lastChild);
    }
}

function renderChannelStates(states) {
    if (!states) return;
    channels.forEach(channel => {
        const is_on = states[`relay${channel.id}`] || false;
        const checkbox = document.getElementById(`toggle-${channel.id}`);
        const card = document.getElementById(`channel-${channel.id}`);
        if (checkbox && card) {
            checkbox.checked = is_on;
            card.classList.toggle('on', is_on);
        }
    });
}

async function updateChannelState(channelId, newState) {
    const relayRef = ref(db, 'relay' + channelId);
    try {
        await set(relayRef, newState);
        const channelName = channels.find(c => c.id === channelId).name;
        logStatus(`${channelName} turned ${newState ? 'ON' : 'OFF'}.`);
    } catch (error) {
        console.error("Error updating channel state: ", error);
        logStatus(`Error updating ${channelName}.`);
    }
}

async function updateAllChannels(newState) {
    const updates = {};
    channels.forEach(channel => {
        updates[`relay${channel.id}`] = newState;
    });
    try {
        // FIXED: Using update() instead of set()
        await update(ref(db), updates);
        logStatus(`All channels turned ${newState ? 'ON' : 'OFF'}.`);
    } catch (error) {
        console.error("Error updating all channels: ", error);
        logStatus(`Error turning all channels ${newState ? 'ON' : 'OFF'}.`);
    }
}

function addToggleListeners() {
    channels.forEach(channel => {
        const toggle = document.getElementById(`toggle-${channel.id}`);
        if(toggle) {
            toggle.addEventListener('change', (e) => {
                updateChannelState(channel.id, e.target.checked);
            });
        }
    });
}

// --- Event Listeners ---

// Settings Menu Toggle
settingsToggle.addEventListener('click', (e) => {
    e.stopPropagation(); 
    settingsMenu.classList.toggle('hidden');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!settingsMenu.classList.contains('hidden') && !settingsMenu.contains(e.target) && e.target !== settingsToggle) {
        settingsMenu.classList.add('hidden');
    }
});

// --- App Initialization ---
createChannelCards();
addToggleListeners();
masterOnBtn.addEventListener('click', () => updateAllChannels(true));
masterOffBtn.addEventListener('click', () => updateAllChannels(false));

// --- Authentication Logic ---
onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in
        loginPage.classList.add('hidden');
        mainContent.classList.remove('hidden');
        userEmailDisplay.textContent = user.email;
        logStatus(`User ${user.email} logged in.`);
        
        // Set up Realtime Database listener for authenticated user
        const dbRef = ref(db);
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                renderChannelStates(data);
                connectionStatus.textContent = "Connected to Realtime Database.";
                connectionStatus.classList.remove('text-zinc-500', 'text-red-500');
                connectionStatus.classList.add('text-green-500');
            } else {
                logStatus("No data found in database. Initializing relays to OFF.");
                updateAllChannels(false);
            }
        }, (error) => {
            console.error("Firebase read failed: " + error.name);
            logStatus("Error connecting to database.");
            connectionStatus.textContent = "Error: Could not connect to database.";
            connectionStatus.classList.remove('text-zinc-500', 'text-green-500');
            connectionStatus.classList.add('text-red-500');
        });

    } else {
        // User is signed out
        mainContent.classList.add('hidden');
        loginPage.classList.remove('hidden');
        userEmailDisplay.textContent = '';
        connectionStatus.textContent = '';
    }
});

// Event Listeners for Auth forms
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    authError.textContent = '';
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        authError.textContent = error.message;
    }
});

signupBtn.addEventListener('click', async () => {
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    authError.textContent = '';
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        authError.textContent = error.message;
    }
});

// Google Sign In Listener
googleBtn.addEventListener('click', async () => {
    authError.textContent = '';
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        authError.textContent = error.message;
        console.error("Google Sign-In Error:", error);
    }
});

logoutBtn.addEventListener('click', () => {
    settingsMenu.classList.add('hidden');
    signOut(auth);
    logStatus("User logged out.");
});
