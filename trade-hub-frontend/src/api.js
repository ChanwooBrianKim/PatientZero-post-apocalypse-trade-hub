import axios from 'axios';

// Function to handle user login
export const login = async (username, password) => {
    // Sends a POST request to the login endpoint with username and password
    return axios.post('http://localhost:5000/login', { username, password });
};

// Function to fetch items for the authenticated user
export const fetchItems = async (token) => {
    // Sends a GET request to the items endpoint with the user's authorization token
    return axios.get('http://localhost:5000/items', {
        headers: {
            Authorization: `Bearer ${token}`, // Sets the Authorization header with the token
        },
    });
};
