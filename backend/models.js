import mongoose from 'mongoose';

// Define the schema for user information and notifications
const userSchema = new mongoose.Schema({
    username: String, // Stores the user's username as a string
    password: String, // Stores the user's password as a string (should be hashed in practice)
    notifications: [{ // Array of notifications sent to the user
        message: String, // The message content of the notification
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Refers to the user who sent the notification
        tradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade' }, // Refers to the trade associated with the notification
        read: { type: Boolean, default: false }, // Status indicating if the notification has been read
        timestamp: { type: Date, default: Date.now } // Timestamp for when the notification was created
    }]
});

// Define the schema for items that can be traded
const itemSchema = new mongoose.Schema({
    name: String, // Name of the item
    type: String, // Type or category of the item (e.g., supply, tool)
    quantity: Number, // Quantity of the item available
    image: String, // URL or path to the image representing the item
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Refers to the user who owns the item
});

// Define the schema for trade requests between users
const tradeSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, // The item to be traded, must reference an Item
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Owner of the item, must reference a User
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User requesting the trade, must reference a User
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }, // Trade status with enum options and default value
});

// Define and export Mongoose models for each schema, checking if already defined to avoid redefinition errors
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);
const Trade = mongoose.models.Trade || mongoose.model('Trade', tradeSchema);

export { User, Item, Trade }; // Export the models for use in other parts of the application
