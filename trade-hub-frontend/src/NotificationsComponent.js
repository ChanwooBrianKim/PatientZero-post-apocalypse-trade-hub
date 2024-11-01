import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NotificationsComponent({ token }) {
    // State hooks to manage notifications and error messages
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');

    // Fetch notifications when the component mounts or token changes
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Send GET request to fetch notifications, including token in headers
                const response = await axios.get('http://localhost:5000/notifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(response.data); // Set the notifications state with the fetched data
            } catch (error) {
                console.error('Failed to fetch notifications', error); // Log error to console
                setError('Failed to load notifications'); // Set error message in state
            }
        };
        fetchNotifications();
    }, [token]);

    // Function to handle accepting a trade request
    const handleAccept = async (tradeId) => {
        try {
            // Send POST request to accept the trade
            await axios.post('http://localhost:5000/trade/accept', { tradeId }, {
                headers: { Authorization: `Bearer ${token}` } // Include token in headers
            });
            alert("Trade accepted"); // Show success message
        } catch (error) {
            console.error('Failed to accept trade:', error); // Log error to console
            alert("Failed to accept trade"); // Show error message to user
        }
    };

    // Function to handle declining a trade request
    const handleDecline = async (tradeId) => {
        try {
            // Send POST request to decline the trade
            await axios.post('http://localhost:5000/trade/decline', { tradeId }, {
                headers: { Authorization: `Bearer ${token}` } // Include token in headers
            });
            alert("Trade declined"); // Show success message
        } catch (error) {
            console.error('Failed to decline trade:', error); // Log error to console
            alert("Failed to decline trade"); // Show error message to user
        }
    };

    return (
        <div>
            <h2>Notifications</h2>
            {error && <p>{error}</p>} {/* Display error message if there's an error */}
            {notifications.length ? (
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>
                            <p>{notification.message}</p>
                            {/* Show Accept/Decline buttons only if the notification has a tradeId */}
                            {notification.tradeId && (
                                <div>
                                    <button onClick={() => handleAccept(notification.tradeId)}>Accept</button>
                                    <button onClick={() => handleDecline(notification.tradeId)}>Decline</button>
                                </div>
                            )}
                            <small>
                                {/* Display sender's username if available and notification timestamp */}
                                Received from: {notification.sender?.username || "Unknown"} at {new Date(notification.timestamp).toLocaleString()}
                            </small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notifications available.</p> // Display message if there are no notifications
            )}
        </div>
    );
}

export default NotificationsComponent;

/*
Further Improvement:

1. Trade Comparison Feature
Enable users to compare item values before finalizing a trade. Display both users' items 
side-by-side to help them assess the worth of the trade. This feature would allow users to make informed decisions 
by seeing if the trade is equitable before choosing to accept or decline.

2. Real-Time Chat and Video Communication
Integrate a real-time chat and video functionality using Socket.IO for live messaging and WebRTC for video and audio streaming. 
This feature would allow users to communicate in real-time directly within the service page, facilitating trade negotiations 
and improving the overall user experience by creating a more interactive trading environment.
*/