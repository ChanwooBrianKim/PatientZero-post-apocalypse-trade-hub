import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import { Item } from '../models.js';

// Test suite for the Post-Apocalypse Trade Hub API
describe("Post-Apocalypse Trade Hub API", () => {
    let user1Token, user2Token, user2ItemId;

    // Set up two users and an item before running the tests
    beforeAll(async () => {
        // Register and login user1
        await request(app)
            .post('/register')
            .send({ username: 'testuser1', password: 'password123' });
        
        const user1Response = await request(app)
            .post('/login')
            .send({ username: 'testuser1', password: 'password123' });
        
        user1Token = user1Response.body.token; // Store user1's token for authentication

        // Register and login user2
        await request(app)
            .post('/register')
            .send({ username: 'testuser2', password: 'password456' });
        
        const user2Response = await request(app)
            .post('/login')
            .send({ username: 'testuser2', password: 'password456' });
        
        user2Token = user2Response.body.token; // Store user2's token for authentication

        // Create an item owned by user2 to use for trade testing
        const itemResponse = await request(app)
            .post('/items')
            .set('Authorization', `Bearer ${user2Token}`)
            .send({ name: 'Survival Kit', type: 'Supply', quantity: 1, image: 'url-to-image' });
        
        user2ItemId = itemResponse.body._id; // Capture the ID of the item created by user2
    });

    // Clean up the database after all tests are completed
    afterAll(async () => {
        await mongoose.connection.dropDatabase(); // Remove all data in the test database
        await mongoose.connection.close(); // Close the database connection
    });

    // Test to verify fetching items categorized into 'myItems' and 'othersItems'
    test("GET /items - fetch user's and others' items", async () => {
        const response = await request(app)
            .get('/items')
            .set('Authorization', `Bearer ${user1Token}`);
        
        expect(response.status).toBe(200); // Expect a successful response
        expect(response.body).toHaveProperty('myItems'); // Check 'myItems' exists in response
        expect(response.body).toHaveProperty('othersItems'); // Check 'othersItems' exists in response
    });

    // Test to check initiating a trade request with another user's item
    test("POST /trade - initiate a trade request", async () => {
        const response = await request(app)
            .post('/trade')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({ itemId: user2ItemId }); // Attempt to trade for user2's item
        
        expect(response.status).toBe(201); // Expect a 'created' response status
        expect(response.body.message).toBe("Trade request sent"); // Confirm the response message
    });
});
