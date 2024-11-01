import React, { useState } from 'react';
import axios from 'axios';

// Component to add a new item, requires a token prop for authorization
function AddItemComponent({ token }) {
    // State hooks for form inputs and response message
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState('');
    const [message, setMessage] = useState('');

    // Function to handle the form submission for adding an item
    const handleAddItem = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            // Send POST request to add item using axios
            const response = await axios.post('http://localhost:5000/items', {
                name,
                type,
                quantity,
                image,
            }, {
                headers: { Authorization: `Bearer ${token}` } // Include authorization token in headers
            });
            setMessage('Item added successfully!'); // Set success message on successful request
        } catch (error) {
            // Set error message if request fails
            setMessage(error.response?.data?.message || 'Failed to add item');
        }
    };

    return (
        <div>
            <h2>Add New Item</h2>
            {/* Form to collect item details */}
            <form onSubmit={handleAddItem}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name} // Bind input to name state
                        onChange={(e) => setName(e.target.value)} // Update name state on change
                    />
                </label>
                <label>
                    Type:
                    <input
                        type="text"
                        value={type} // Bind input to type state
                        onChange={(e) => setType(e.target.value)} // Update type state on change
                    />
                </label>
                <label>
                    Quantity:
                    <input
                        type="number"
                        value={quantity} // Bind input to quantity state
                        onChange={(e) => setQuantity(e.target.value)} // Update quantity state on change
                    />
                </label>
                <label>
                    Image URL:
                    <input
                        type="text"
                        value={image} // Bind input to image state
                        onChange={(e) => setImage(e.target.value)} // Update image state on change
                    />
                </label>
                <button type="submit">Add Item</button> {/* Button to submit the form */}
            </form>
            {message && <p>{message}</p>} {/* Display response message */}
        </div>
    );
}

export default AddItemComponent;
