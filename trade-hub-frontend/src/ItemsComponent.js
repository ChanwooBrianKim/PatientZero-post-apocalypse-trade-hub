import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ItemsComponent({ token }) {
    const [myItems, setMyItems] = useState([]);
    const [othersItems, setOthersItems] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/items', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMyItems(response.data.myItems);
                setOthersItems(response.data.othersItems);
            } catch (err) {
                setError('Failed to load items');
            }
        };
        fetchItems();
    }, [token]);

    // Function to handle the trade request
    const handleTradeRequest = async (itemId) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/trade', // Ensure this URL is correct
                { itemId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
        } catch (error) {
            console.error('Failed to initiate trade:', error);
            alert(error.response?.data?.message || 'Failed to initiate trade');
        }
    };

    return (
        <div>
            <h2>My Items</h2>
            {myItems.length ? (
                <ul>
                    {myItems.map((item) => (
                        <li key={item._id}>
                            <strong>{item.name}</strong>
                            <p>Type: {item.type}</p>
                            <p>Quantity: {item.quantity}</p>
                            <img src={item.image} alt={item.name} width="100" />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no items.</p>
            )}

            <h2>Other's Items</h2>
            {othersItems.length ? (
                <ul>
                    {othersItems.map((item) => (
                        <li key={item._id}>
                            <strong>{item.name}</strong>
                            <p>Type: {item.type}</p>
                            <p>Quantity: {item.quantity}</p>
                            <img src={item.image} alt={item.name} width="100" />
                            <button onClick={() => handleTradeRequest(item._id)}>Trade</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items from other users.</p>
            )}

            {error && <p>{error}</p>}
        </div>
    );
}

export default ItemsComponent;
