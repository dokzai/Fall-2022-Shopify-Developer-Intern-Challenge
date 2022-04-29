const mongoose = require("mongoose");
const Inventory = require('../models/InventoryModel');
const Warehouse = require('../models/WarehouseModel');
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
        "coordinates": [-73.987123, 40.741459]
    }
};

let inventoryItem2 = {
    "customerID": "2",
    "weight": 18,
    "pricePerUnit": 1,
    "originAddress": "216 West 18th Street, New York, NY 10011 Chelsea New York New York United States",
    "originLocation": {
        "type": "Point",
        "coordinates": [-73.999025, 40.741408]
    }
};
let warehouse1 = {
    "address": "20 West 15th Street, New York, NY 10011 Flatiron New York New York United States",
    "location": {
        "type": "Point",
        "coordinates" : [-73.994293, 40.736914]
    }
};
describe("Testing Inventory", () => {
    const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@node-rest-inventory.zx2mm.mongodb.net/node-rest-inventory?retryWrites=true&w=majority`

    beforeAll(
        async () => {
            await mongoose.disconnect();
            await mongoose.connect(connectionString);
            await Warehouse.deleteMany({})
            await request(app)
                .post("/warehouse")
                .type("form")
                .set('Accept', 'application/json')
                .send(warehouse1)
                .expect(201)
            // add the warehouse
        }
    );

    beforeEach(
        async () => {
            await Inventory.deleteMany({})
        }
    );

    afterAll(
        async () => {
            await Inventory.deleteMany({})
            // delete the warehouse
            await Warehouse.deleteMany({})
            await mongoose.disconnect();
            
        }
    );

    describe("POST /inventory", () => {
        test("Should respond with a 201 status code and return inventory item created", async () => {
            const response = await request(app)
                .post("/inventory")
                .type("form")
                .set('Accept', 'application/json')
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

    describe("GET /inventory", () => {
        test("Should respond with a 200 status code and return all inventory items", async () => {
            await request(app)
                .post("/inventory")
                .type("form")
                .set('Accept', 'application/json')
                .send(inventoryItem1)
                .expect(201)

            await request(app)
                .post("/inventory")
                .type("form")
                .set('Accept', 'application/json')
                .send(inventoryItem2)
                .expect(201)

            const response = await request(app)
                .get("/inventory")
                .set('Accept', 'application/json')
                .expect(200)
            expect(response.body.length == 2)
            expect(response.body).toEqual([{
                ...inventoryItem1,
                _id: expect.anything(),
                __v: expect.anything(),
                status: "stored",

                warehouseID: expect.anything(),
            }, {
                ...inventoryItem2,
                _id: expect.anything(),
                __v: expect.anything(),
                status: "stored",
                warehouseID: expect.anything(),
            }])
        })
    })

    describe("GET /inventory:inventoryID", () => {
        test("Should respond with a 200 status code and return inventory item number 1", async () => {
            const item = await request(app)
                .post("/inventory")
                .type("form")
                .set('Accept', 'application/json')
                .send(inventoryItem1)
                .expect(201)
            const response = await request(app)
                .get("/inventory/" + item.body.createdItem._id)
                .set('Accept', 'application/json')
                .expect(200)

            expect(response.body.length == 1)
            expect(response.body).toEqual([{
                ...inventoryItem1,
                _id: expect.anything(),
                __v: expect.anything(),
                status: "stored",

                warehouseID: expect.anything(),
            }])
        })
    })

    describe("DELETE /inventory", () => {
        test("Should respond with a 200 and delete all inventory items", async () => {
            const item = await request(app)
                .post("/inventory")
                .type("form")
                .set('Accept', 'application/json')
                .send(inventoryItem1)
                .expect(201)

            await request(app)
                .post("/inventory")
                .type("form")
                .set('Accept', 'application/json')
                .send(inventoryItem2)
                .expect(201)

            let sent_items = await request(app)
                .get("/inventory")
                .set('Accept', 'application/json')
                .expect(200)
            expect(sent_items.body.length == 2)

            await request(app)
                .delete("/inventory")
                .expect(200)

            const response = await request(app)
                .get("/inventory")
                .set('Accept', 'application/json')
                .expect(200)
            expect(response.body.length == 0)
            expect(response.body).toEqual([])

        })

    })

    describe("DELETE /inventory:inventoryID", () => {
        test("Should respond with a 200 and delete inventory item 1 returning the rest of the inventory items left", async () => {
            const item = await request(app)
                .post("/inventory")
                .type("form")
                .set('Accept', 'application/json')
                .send(inventoryItem1)
                .expect(201)

            await request(app)
                .post("/inventory")
                .type("form")
                .set('Accept', 'application/json')
                .send(inventoryItem2)
                .expect(201)

            let sent_items = await request(app)
                .get("/inventory")
                .set('Accept', 'application/json')
                .expect(200)
            expect(sent_items.body.length == 2)

            await request(app)
                .delete("/inventory/" + item.body.createdItem._id)
                .expect(200)

            const response = await request(app)
                .get("/inventory")
                .set('Accept', 'application/json')
                .expect(200)
            expect(response.body.length == 0)
            expect(response.body).toEqual([{
                ...inventoryItem2,
                _id: expect.anything(),
                __v: expect.anything(),
                status: "stored",
                warehouseID: expect.anything(),
            }])

        })
    })

    describe("PUT /inventory:inventoryID", () => {
        test("Should change item 1 into item 2", async () => {
            const item = await request(app)
                .post("/inventory")
                .type("form")
                .set('Accept', 'application/json')
                .send(inventoryItem1)
                .expect(201)

             await request(app)
                .put("/inventory/"+item.body.createdItem._id)
                .type("form")
                .set('Accept', 'application/json')
                .send(inventoryItem2)
                .expect(200)

            const changedItem = await request(app)
                .get("/inventory/"+item.body.createdItem._id)
                .set('Accept', 'application/json')
                .expect(200)
            expect(changedItem.body).toEqual([{
                ...inventoryItem2,
                _id: expect.anything(),
                __v: 0,
                status: "stored",
                warehouseID: expect.anything(),
            }])

        })
    })

})