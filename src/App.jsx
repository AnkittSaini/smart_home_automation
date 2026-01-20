import React, { useState, useEffect } from 'react';
import { useAuth } from './UserContext';
import './App.css';

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

function App() {
    const { 
        user, 
        login, 
        signup, 
        googleSignIn, 
        logout, 
        channelStates, 
        updateChannelState, 
        updateAllChannels,
        connectionStatus 
    } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [statusLog, setStatusLog] = useState(['System initialized. Please log in.']);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const logStatus = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setStatusLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
    };

    useEffect(() => {
        if (user) {
            logStatus(`User ${user.email} logged in.`);
        }
    }, [user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        try {
            await login(email, password);
        } catch (error) {
            setAuthError(error.message);
        }
    };

    const handleSignup = async () => {
        setAuthError('');
        try {
            await signup(email, password);
        } catch (error) {
            setAuthError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        setAuthError('');
        try {
            await googleSignIn();
        } catch (error) {
            setAuthError(error.message);
        }
    };

    const handleLogout = () => {
        setSettingsOpen(false);
        logout();
        logStatus("User logged out.");
    };

    const handleToggleChannel = (channelId, newState) => {
        updateChannelState(channelId, newState);
        const channelName = channels.find(c => c.id === channelId).name;
        logStatus(`${channelName} turned ${newState ? 'ON' : 'OFF'}.`);
    };

    const handleMasterControl = (state) => {
        updateAllChannels(state);
        logStatus(`All channels turned ${state ? 'ON' : 'OFF'}.`);
    };

    if (!user) {
        return (
            <div className="bg-zinc-900 text-white min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <div className="bg-zinc-800 p-8 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-center mb-6">Smart Home Login</h1>
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-zinc-400 text-sm font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-zinc-700 border-zinc-600 text-white leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-zinc-400 text-sm font-bold mb-2">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-zinc-700 border-zinc-600 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="********"
                                />
                            </div>
                            <div className="text-red-500 text-xs italic mb-4 h-auto min-h-[1rem]">
                                {authError}
                            </div>
                            
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300"
                                >
                                    Log In
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSignup}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300"
                                >
                                    Sign Up
                                </button>
                            </div>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-zinc-600"></div>
                                <span className="flex-shrink mx-4 text-zinc-500 text-xs">OR CONTINUE WITH</span>
                                <div className="flex-grow border-t border-zinc-600"></div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="mt-4 w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 text-white min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <header className="text-center mb-8 relative">
                    <div className="flex justify-between items-start mb-2">
                        <p className={`text-xs h-4 mt-2 ${connectionStatus.includes('Connected') ? 'text-green-500' : connectionStatus.includes('Error') ? 'text-red-500' : 'text-zinc-500'}`}>
                            {connectionStatus}
                        </p>
                        
                        <div className="relative">
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all duration-200 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>

                            {settingsOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 transform origin-top-right transition-all">
                                    <div className="px-4 py-3 border-b border-zinc-700">
                                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Signed in as</p>
                                        <p className="text-sm text-white font-medium truncate">{user.email}</p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700/50 hover:text-red-300 transition-colors flex items-center gap-2 group"
                                        >
                                            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                                <polyline points="16 17 21 12 16 7"/>
                                                <line x1="21" y1="12" x2="9" y2="12"/>
                                            </svg>
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Smart Home Control</h1>
                    <p className="text-zinc-400">Welcome back! Manage your devices below.</p>
                </header>
                
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => handleMasterControl(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Turn All On
                    </button>
                    <button
                        onClick={() => handleMasterControl(false)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Turn All Off
                    </button>
                </div>

                <main className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {channels.map(channel => {
                        const isOn = channelStates?.[`relay${channel.id}`] || false;
                        return (
                            <div
                                key={channel.id}
                                className={`channel-card bg-zinc-800 p-4 rounded-lg flex flex-col items-center justify-center aspect-square ${isOn ? 'on' : ''}`}
                            >
                                <div className="text-zinc-400 mb-2" dangerouslySetInnerHTML={{ __html: channel.icon }} />
                                <h3 className="font-semibold text-center text-sm mb-4">{channel.name}</h3>
                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        id={`toggle-${channel.id}`}
                                        checked={isOn}
                                        onChange={(e) => handleToggleChannel(channel.id, e.target.checked)}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                    />
                                    <label
                                        htmlFor={`toggle-${channel.id}`}
                                        className="toggle-label block overflow-hidden h-6 rounded-full bg-zinc-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </main>
                
                <footer className="mt-8 text-center">
                    <h2 className="text-xl font-semibold mb-2">Activity Log</h2>
                    <div className="h-24 bg-zinc-800 rounded-lg p-3 text-left overflow-y-auto text-sm text-zinc-300">
                        {statusLog.map((log, index) => (
                            <p key={index}>{log}</p>
                        ))}
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default App;