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
        // Find items owned by the logged-in user
        const myItems = await Item.find({ owner: req.user.id });
        // Find items owned by other users
        const othersItems = await Item.find({ owner: { $ne: req.user.id } });

        res.json({ myItems, othersItems }); // Send response with categorized items
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch items' }); // Handle error
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

        // Check if the item exists and is owned by the logged-in user
        if (!item || item.owner.toString() !== req.user.id) {
            return res.status(404).json({ message: "Item not found or not authorized" });
        }

        await Item.findByIdAndDelete(itemId); // Delete the item if the user is authorized
        res.status(200).json({ message: "Item removed successfully" }); // Send success response
    } catch (error) {
        res.status(500).json({ message: "Failed to remove item" }); // Handle error
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
    console.log("Trade request received for itemId:", itemId);
    console.log("Requester user ID:", req.user.id);

    try {
        // Find the item and populate the owner details
        const item = await Item.findById(itemId).populate('owner');
        if (!item) {
            console.log("Item not found.");
            return res.status(404).json({ message: 'Item not found' });
        }

        // Prevent user from trading their own item
        if (item.owner._id.toString() === req.user.id) {
            console.log("User attempted to trade their own item.");
            return res.status(400).json({ message: 'You cannot trade your own item' });
        }

        // Create a new trade request
        const trade = new Trade({
            item: item._id,
            owner: item.owner._id,
            requester: req.user.id,
            status: 'pending'
        });
        await trade.save();
        console.log("Trade successfully created:", trade);

        // Notify the item's owner of the trade request
        const notification = {
            message: `You have received a trade request from ${req.user.username} for ${item.name}`,
            sender: req.user.id,
            tradeId: trade._id
        };

        await User.findByIdAndUpdate(item.owner._id, {
            $push: { notifications: notification }
        });

        res.status(201).json({ message: 'Trade request sent', trade }); // Send success response
    } catch (error) {
        console.log("Error initiating trade:", error);
        res.status(500).json({ message: 'Failed to initiate trade', error }); // Handle error
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
        // Find the trade and populate requester details
        const trade = await Trade.findById(tradeId).populate('requester');
        if (!trade) return res.status(404).json({ message: 'Trade not found' });

        // Ensure the logged-in user is the owner of the trade item
        if (trade.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to accept this trade' });
        }

        // Update the trade status to 'accepted'
        trade.status = 'accepted';
        await trade.save();

        // Notify the requester that their trade request was accepted
        await User.findByIdAndUpdate(trade.requester._id, {
            $push: { notifications: { message: `Your trade request for ${trade.item} was accepted`, sender: req.user.id } }
        });

        res.json({ message: 'Trade accepted', trade }); // Send success response
    } catch (error) {
        res.status(500).json({ message: 'Failed to accept trade' }); // Handle error
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
        // Find the trade and populate requester details
        const trade = await Trade.findById(tradeId).populate('requester');
        if (!trade) return res.status(404).json({ message: 'Trade not found' });

        // Ensure the logged-in user is the owner of the trade item
        if (trade.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to decline this trade' });
        }

        // Update the trade status to 'declined'
        trade.status = 'declined';
        await trade.save();

        // Notify the requester that their trade request was declined
        await User.findByIdAndUpdate(trade.requester._id, {
            $push: { notifications: { message: `Your trade request for ${trade.item} was declined`, sender: req.user.id } }
        });

        res.json({ message: 'Trade declined', trade }); // Send success response
    } catch (error) {
        res.status(500).json({ message: 'Failed to decline trade' }); // Handle error
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
        // Find the user and populate notifications with sender details
        const user = await User.findById(req.user.id).populate('notifications.sender', 'username');
        res.json(user.notifications); // Send the list of notifications
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications' }); // Handle error
    }
});

export default router; // Export the router for use in the app
