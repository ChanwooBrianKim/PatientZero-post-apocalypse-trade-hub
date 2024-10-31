import React, { useState } from 'react';
import axios from 'axios';

function AddItemComponent({ token }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState('');
    const [message, setMessage] = useState('');

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/items', {
                name,
                type,
                quantity,
                image,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Item added successfully!');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add item');
        }
    };

    return (
        <div>
            <h2>Add New Item</h2>
            <form onSubmit={handleAddItem}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label>
                    Type:
                    <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />
                </label>
                <label>
                    Quantity:
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </label>
                <label>
                    Image URL:
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </label>
                <button type="submit">Add Item</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AddItemComponent;
