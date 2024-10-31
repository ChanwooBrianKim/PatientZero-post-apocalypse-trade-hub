import axios from 'axios';

export const login = async (username, password) => {
    return axios.post('http://localhost:5000/login', { username, password });
};

export const fetchItems = async (token) => {
    return axios.get('http://localhost:5000/items', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
