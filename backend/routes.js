import express from 'express';
import { Item, Trade, User } from './models.js';
import authenticateToken from './middleware/authenticateToken.js';

const router = express.Router();

// Route to get "My Items" and "Other's Items"
router.get('/items', authenticateToken, async (req, res) => {
    try {
        const myItems = await Item.find({ owner: req.user.id });
        const othersItems = await Item.find({ owner: { $ne: req.user.id } });

        res.json({ myItems, othersItems });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch items' });
    }
});

// Route to initiate a trade request
router.post('/trade', authenticateToken, async (req, res) => {
    const { itemId } = req.body;

    try {
        const item = await Item.findById(itemId).populate('owner');
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.owner._id.toString() === req.user.id) {
            return res.status(400).json({ message: 'You cannot trade your own item' });
        }

        // Create a trade request
        const trade = new Trade({
            item: item._id,
            owner: item.owner._id,
            requester: req.user.id,
            status: 'pending'
        });
        await trade.save();

        // Add a notification to the owner of the item with tradeId
        const notification = {
            message: `You have received a trade request from ${req.user.username} for ${item.name}`,
            sender: req.user.id,
            tradeId: trade._id // Add tradeId to notification
        };

        await User.findByIdAndUpdate(item.owner._id, {
            $push: { notifications: notification }
        });

        res.status(201).json({ message: 'Trade request sent', trade });
    } catch (error) {
        res.status(500).json({ message: 'Failed to initiate trade', error });
    }
});

router.post('/trade/accept', authenticateToken, async (req, res) => {
    const { tradeId } = req.body;

    try {
        const trade = await Trade.findById(tradeId).populate('requester');
        if (!trade) return res.status(404).json({ message: 'Trade not found' });

        if (trade.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to accept this trade' });
        }

        trade.status = 'accepted';
        await trade.save();

        // Notify the requester of the accepted trade
        await User.findByIdAndUpdate(trade.requester._id, {
            $push: { notifications: { message: `Your trade request for ${trade.item} was accepted`, sender: req.user.id } }
        });

        res.json({ message: 'Trade accepted', trade });
    } catch (error) {
        console.error('Failed to accept trade:', error);
        res.status(500).json({ message: 'Failed to accept trade' });
    }
});

router.post('/trade/decline', authenticateToken, async (req, res) => {
    const { tradeId } = req.body;

    try {
        const trade = await Trade.findById(tradeId).populate('requester');
        if (!trade) return res.status(404).json({ message: 'Trade not found' });

        if (trade.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to decline this trade' });
        }

        trade.status = 'declined';
        await trade.save();

        // Notify the requester of the declined trade
        await User.findByIdAndUpdate(trade.requester._id, {
            $push: { notifications: { message: `Your trade request for ${trade.item} was declined`, sender: req.user.id } }
        });

        res.json({ message: 'Trade declined', trade });
    } catch (error) {
        console.error('Failed to decline trade:', error);
        res.status(500).json({ message: 'Failed to decline trade' });
    }
});


router.get('/notifications', authenticateToken, async (req, res) => {
    try {
        // Find the user by ID and populate notifications
        const user = await User.findById(req.user.id).populate('notifications.sender', 'username');
        res.json(user.notifications);
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});

export default router;
