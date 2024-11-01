import React, { useState } from 'react';
import axios from 'axios';

function RegisterComponent() {
    // State hooks to manage username, password, and any response messages
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Function to handle form submission for user registration
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent page reload on form submission
        try {
            // Send POST request to register endpoint with username and password
            const response = await axios.post('http://localhost:5000/register', {
                username,
                password,
            });
            setMessage(response.data.message); // Display success message from server response
        } catch (error) {
            // Set error message if registration fails
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {/* Form for user registration */}
            <form onSubmit={handleRegister}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username} // Bind input to username state
                        onChange={(e) => setUsername(e.target.value)} // Update username on change
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password} // Bind input to password state
                        onChange={(e) => setPassword(e.target.value)} // Update password on change
                    />
                </label>
                <button type="submit">Register</button> {/* Submit button for registration */}
            </form>
            {message && <p>{message}</p>} {/* Display success or error message */}
        </div>
    );
}

export default RegisterComponent;
