import express from 'express';
import { Item, Trade, User } from './models.js';
import authenticateToken from './middleware/authenticateToken.js';

const router = express.Router();

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Fetch "My Items" and "Other's Items" for the logged-in user
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Successful response with the items list
 *       500:
 *         description: Failed to fetch items
 */
router.get('/items', authenticateToken, async (req, res) => {
    try {
        const myItems = await Item.find({ owner: req.user.id });
        const othersItems = await Item.find({ owner: { $ne: req.user.id } });

        res.json({ myItems, othersItems });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch items' });
    }
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Deletes an item owned by the user
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item to delete
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Item not found or not authorized
 *       500:
 *         description: Failed to remove item
 */
router.delete('/items/:id', authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId);

        if (!item || item.owner.toString() !== req.user.id) {
            return res.status(404).json({ message: "Item not found or not authorized" });
        }

        await Item.findByIdAndDelete(itemId);
        res.status(200).json({ message: "Item removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove item" });
    }
});

/**
 * @swagger
 * /trade:
 *   post:
 *     summary: Initiates a trade request for an item
 *     tags: [Trades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: The ID of the item to trade
 *     responses:
 *       201:
 *         description: Trade request sent
 *       404:
 *         description: Item not found
 *       500:
 *         description: Failed to initiate trade
 */
router.post('/trade', authenticateToken, async (req, res) => {
    const { itemId } = req.body;

    try {
        const item = await Item.findById(itemId).populate('owner');
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.owner._id.toString() === req.user.id) {
            return res.status(400).json({ message: 'You cannot trade your own item' });
        }

        const trade = new Trade({
            item: item._id,
            owner: item.owner._id,
            requester: req.user.id,
            status: 'pending'
        });
        await trade.save();

        const notification = {
            message: `You have received a trade request from ${req.user.username} for ${item.name}`,
            sender: req.user.id,
            tradeId: trade._id
        };

        await User.findByIdAndUpdate(item.owner._id, {
            $push: { notifications: notification }
        });

        res.status(201).json({ message: 'Trade request sent', trade });
    } catch (error) {
        res.status(500).json({ message: 'Failed to initiate trade', error });
    }
});

/**
 * @swagger
 * /trade/accept:
 *   post:
 *     summary: Accepts a trade request
 *     tags: [Trades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tradeId:
 *                 type: string
 *                 description: The ID of the trade to accept
 *     responses:
 *       200:
 *         description: Trade accepted
 *       404:
 *         description: Trade not found
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Failed to accept trade
 */
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

        await User.findByIdAndUpdate(trade.requester._id, {
            $push: { notifications: { message: `Your trade request for ${trade.item} was accepted`, sender: req.user.id } }
        });

        res.json({ message: 'Trade accepted', trade });
    } catch (error) {
        res.status(500).json({ message: 'Failed to accept trade' });
    }
});

/**
 * @swagger
 * /trade/decline:
 *   post:
 *     summary: Declines a trade request
 *     tags: [Trades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tradeId:
 *                 type: string
 *                 description: The ID of the trade to decline
 *     responses:
 *       200:
 *         description: Trade declined
 *       404:
 *         description: Trade not found
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Failed to decline trade
 */
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

        await User.findByIdAndUpdate(trade.requester._id, {
            $push: { notifications: { message: `Your trade request for ${trade.item} was declined`, sender: req.user.id } }
        });

        res.json({ message: 'Trade declined', trade });
    } catch (error) {
        res.status(500).json({ message: 'Failed to decline trade' });
    }
});

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Retrieves user notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Successful response with the notifications list
 *       500:
 *         description: Failed to fetch notifications
 */
router.get('/notifications', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('notifications.sender', 'username');
        res.json(user.notifications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});

export default router;
