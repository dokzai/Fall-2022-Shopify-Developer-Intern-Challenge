const mongoose = require("mongoose");
const Inventory = require('../models/InventoryModel');
const app = require("../app");
const request = require("supertest");
require("dotenv").config();

let inventoryItem1 = {
    "customerID": "1",
    "weight": 1.0,
    "pricePerUnit": 1,
    "originAddress": "2 East 24th Street, New York, NY 10010 Flatiron New York New York United States",
    "originLocation": {
        "type": "Point",
        "coordinates" : [-73.987123, 40.741459]
    }
};

let inventoryItem2 = {
    "customerID": "2",
    "weight": 18,
    "pricePerUnit": 1,
    "originAddress": "2 East 24th Street, New York, NY 10010 Flatiron New York New York United States",
    "originLocation": {
        "type": "Point",
        "coordinates" : [-73.987123, 40.741459]
    }
};

describe("Testing Inventory", () => {
    const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@node-rest-inventory.zx2mm.mongodb.net/node-rest-inventory?retryWrites=true&w=majority`

    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect(connectionString);
    });

    beforeEach(async () => {
            await Inventory.deleteMany({})
        }
    );

    afterAll(
        async () => {
            await mongoose.disconnect();
        }
    );

    describe("POST /inventory", () => {
        test("should respond with a 201 status code", async () => {
            const response = await request(app)
                .post("/inventory")
                .type("form")
                .set('Accept','application/json')
                .send(inventoryItem1)
                .expect(201)
            expect(response.body.createdItem).toEqual({
                _id: expect.anything(),
                __v: 0,
                status: "stored",
                warehouseID: expect.anything(),
                customerID: inventoryItem1.customerID,
                weight: inventoryItem1.weight,
                pricePerUnit: inventoryItem1.pricePerUnit,
                originAddress: inventoryItem1.originAddress,
                originLocation: {
                    type: inventoryItem1.originLocation.type,
                    coordinates: [inventoryItem1.originLocation.coordinates[0], inventoryItem1.originLocation.coordinates[1]]
                }
            });
        })
    })
    // describe("GET /inventory", () => {
    //  
    // })
    // describe("GET /inventory:inventoryID", () => {

    // })
    // describe("PUT /inventory:inventoryID", () => {

    // })
})