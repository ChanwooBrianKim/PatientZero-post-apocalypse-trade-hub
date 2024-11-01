import React, { useState } from 'react';
import axios from 'axios';

function LoginComponent({ onLogin }) {
    // State hooks to manage the username and password input fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle form submission for login
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the form from reloading the page
        try {
            // Send a POST request to the login endpoint with username and password
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            const token = response.data.token; // Retrieve the token from response
            localStorage.setItem('token', token); // Save the token to localStorage
            onLogin(token); // Call the onLogin function passed from parent component with the token
        } catch (error) {
            alert('Login failed! Please check your username and password.'); // Display error message if login fails
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {/* Login form */}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username} // Bind input to username state
                    onChange={(e) => setUsername(e.target.value)} // Update username state on input change
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password} // Bind input to password state
                    onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                />
                <button type="submit">Login</button> {/* Submit button for the form */}
            </form>
        </div>
    );
}

export default LoginComponent;
