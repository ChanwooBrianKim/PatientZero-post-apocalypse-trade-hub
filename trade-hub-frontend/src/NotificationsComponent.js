import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NotificationsComponent({ token }) {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/notifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(response.data);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
                setError('Failed to load notifications');
            }
        };
        fetchNotifications();
    }, [token]);

    const handleAccept = async (tradeId) => {
        try {
            await axios.post('http://localhost:5000/trade/accept', { tradeId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Trade accepted");
        } catch (error) {
            console.error('Failed to accept trade:', error);
            alert("Failed to accept trade");
        }
    };

    const handleDecline = async (tradeId) => {
        try {
            await axios.post('http://localhost:5000/trade/decline', { tradeId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Trade declined");
        } catch (error) {
            console.error('Failed to decline trade:', error);
            alert("Failed to decline trade");
        }
    };

    return (
        <div>
            <h2>Notifications</h2>
            {error && <p>{error}</p>}
            {notifications.length ? (
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>
                            <p>{notification.message}</p>
                            {notification.tradeId && ( // Show Accept/Decline only if tradeId is present
                                <div>
                                    <button onClick={() => handleAccept(notification.tradeId)}>Accept</button>
                                    <button onClick={() => handleDecline(notification.tradeId)}>Decline</button>
                                </div>
                            )}
                            <small>Received from: {notification.sender?.username || "Unknown"} at {new Date(notification.timestamp).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notifications available.</p>
            )}
        </div>
    );
}

export default NotificationsComponent;
