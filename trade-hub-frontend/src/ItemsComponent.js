import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ItemsComponent({ token }) {
    // State hooks for user's items, other users' items, and error messages
    const [myItems, setMyItems] = useState([]);
    const [othersItems, setOthersItems] = useState([]);
    const [error, setError] = useState('');

    // Fetch items on component mount and when token changes
    useEffect(() => {
        const fetchItems = async () => {
            try {
                // Send GET request to fetch user's items and others' items
                const response = await axios.get('http://localhost:5000/items', {
                    headers: { Authorization: `Bearer ${token}` } // Pass token for authorization
                });
                setMyItems(response.data.myItems); // Update my items state
                setOthersItems(response.data.othersItems); // Update other users' items state
            } catch (err) {
                setError('Failed to load items'); // Set error message if request fails
            }
        };
        fetchItems();
    }, [token]);

    // Function to initiate a trade request for an item
    const handleTradeRequest = async (itemId) => {
        try {
            // Send POST request to initiate trade for the specified item
            const response = await axios.post(
                'http://localhost:5000/trade',
                { itemId },
                { headers: { Authorization: `Bearer ${token}` } } // Pass token for authorization
            );
            alert(response.data.message); // Show response message on success
        } catch (error) {
            console.error('Failed to initiate trade:', error); // Log error
            alert(error.response?.data?.message || 'Failed to initiate trade'); // Show error message
        }
    };

    // Function to handle item removal for the user's own items
    const handleRemoveItem = async (itemId) => {
        console.log("Attempting to delete item:", itemId); // Log the item ID to be removed
        try {
            // Send DELETE request to remove the item with the specified ID
            const response = await axios.delete(`http://localhost:5000/items/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` } // Pass token for authorization
            });
            console.log("Delete response:", response.data); // Log the server's response
            setMyItems(myItems.filter(item => item._id !== itemId)); // Update UI to remove item from list
            alert('Item removed successfully'); // Show success message
        } catch (error) {
            console.error('Failed to remove item:', error); // Log error
            alert(error.response?.data?.message || 'Failed to remove item'); // Show error message
        }
    };

    return (
        <div>
            <h2>My Items</h2>
            {/* List user's items, or show a message if there are none */}
            {myItems.length ? (
                <ul>
                    {myItems.map((item) => (
                        <li key={item._id}>
                            <strong>{item.name}</strong>
                            <p>Type: {item.type}</p>
                            <p>Quantity: {item.quantity}</p>
                            <img src={item.image} alt={item.name} width="100" />
                            <button onClick={() => handleRemoveItem(item._id)}>Remove</button> {/* Remove item button */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no items.</p> // Message if no items
            )}

            <h2>Other's Items</h2>
            {/* List other users' items, or show a message if there are none */}
            {othersItems.length ? (
                <ul>
                    {othersItems.map((item) => (
                        <li key={item._id}>
                            <strong>{item.name}</strong>
                            <p>Type: {item.type}</p>
                            <p>Quantity: {item.quantity}</p>
                            <img src={item.image} alt={item.name} width="100" />
                            <button onClick={() => handleTradeRequest(item._id)}>Trade</button> {/* Trade request button */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items from other users.</p> // Message if no items from others
            )}

            {error && <p>{error}</p>} {/* Display error message if any */}
        </div>
    );
}

export default ItemsComponent;
