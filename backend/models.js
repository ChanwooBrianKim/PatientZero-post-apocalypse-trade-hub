import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    notifications: [{
        message: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        tradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade' },
        read: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now }
    }]
});


const itemSchema = new mongoose.Schema({
    name: String,
    type: String,
    quantity: Number,
    image: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const tradeSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);
const Trade = mongoose.models.Trade || mongoose.model('Trade', tradeSchema);

export { User, Item, Trade };
