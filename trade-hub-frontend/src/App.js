import React, { useState, useEffect } from 'react';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import ItemsComponent from './ItemsComponent';
import AddItemComponent from './AddItemComponent';
import NotificationsComponent from './NotificationsComponent';
import './App.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [showRegister, setShowRegister] = useState(false);

    // Check if there's a saved token in localStorage on component mount
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // Handle logout and clear the token from both state and localStorage
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <div className="App">
            <h1>The Post-Apocalypse Trade Hub</h1>
            {token ? (
                // Display items and Add Item form if the user is logged in
                <div>
                    <ItemsComponent token={token} />
                    <AddItemComponent token={token} /> {/* Add Item component for logged-in users */}
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                // Display Login or Register component based on `showRegister` state
                <div>
                    {showRegister ? (
                        <RegisterComponent /> // Show Register form
                    ) : (
                        <LoginComponent onLogin={(newToken) => {
                            setToken(newToken);
                            localStorage.setItem('token', newToken); // Save token to localStorage on login
                        }} />
                    )}
                    <button onClick={() => setShowRegister(!showRegister)}>
                        {showRegister ? 'Go to Login' : 'Register'}
                    </button>
                </div>
            )}
            {token && <NotificationsComponent token={token} />}
        </div>
    );
}

export default App;
