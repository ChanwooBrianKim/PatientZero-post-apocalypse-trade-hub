import React, { useState, useEffect } from 'react';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import ItemsComponent from './ItemsComponent';
import AddItemComponent from './AddItemComponent';
import NotificationsComponent from './NotificationsComponent';
import './App.css';

function App() {
    // State to manage the authentication token, initialized with any token in localStorage
    const [token, setToken] = useState(localStorage.getItem('token'));
    // State to toggle between showing the Login and Register components
    const [showRegister, setShowRegister] = useState(false);

    // Check for a saved token in localStorage when the component mounts
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken); // Set token if found in localStorage
        }
    }, []);

    // Function to handle logout by removing token from state and localStorage
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token from localStorage
        setToken(null); // Set token state to null
    };

    return (
        <div className="App">
            <h1>The Post-Apocalypse Trade Hub</h1>
            {token ? (
                // Show items, Add Item form, and logout button if user is logged in
                <div>
                    <ItemsComponent token={token} /> {/* Component to display user's items */}
                    <AddItemComponent token={token} /> {/* Component to add new items */}
                    <button className="logout-button" onClick={handleLogout}>Logout</button> {/* Logout button */}
                </div>
            ) : (
                // Show Login or Register components based on `showRegister` state
                <div>
                    {showRegister ? (
                        <RegisterComponent /> // Register form
                    ) : (
                        <LoginComponent onLogin={(newToken) => {
                            setToken(newToken); // Set token state on successful login
                            localStorage.setItem('token', newToken); // Save token to localStorage
                        }} />
                    )}
                    <button onClick={() => setShowRegister(!showRegister)}>
                        {showRegister ? 'Go to Login' : 'Register'}
                    </button>
                </div>
            )}
            {token && <NotificationsComponent token={token} />} {/* Show notifications if logged in */}
        </div>
    );
}

export default App;
