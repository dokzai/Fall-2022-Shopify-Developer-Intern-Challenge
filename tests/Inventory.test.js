const mongoose = require("mongoose");
const app = require("../index");
const request = require("supertest");
require("dotenv").config();

describe("Testing Inventory", () => {
    const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@node-rest-inventory.zx2mm.mongodb.net/node-rest-inventory?retryWrites=true&w=majority`

    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect(connectionString);
    });

    // beforeEach(
    //     // delete
    // );

    afterAll(
        async () => {
            await mongoose.disconnect();
        }
    );

    describe("POST /inventory", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app).post("/inventory")
            expect(response.statusCode).toBe(201)
        })
    })
    // describe("GET /inventory", () => {
    //     test("should respond with a 200 status code", async () => {
    //         const response = await request(app).get("/inventory")
    //         // check the body
    //         expect(response.statusCode).toBe(200)
    //     })
    // })
    // describe("GET /inventory:inventoryID", () => {
    //     test("should respond with a 200 status code", async () => {
    //         const response = await request(app).get("/inventory")
    //         // check body
    //         expect(response.statusCode).toBe(200)
    //     })
    // })
    // describe("PUT /inventory:inventoryID", () => {
    //     test("should respond with a 200 status code", async () => {
    //         const response = await request(app).get("/inventory")
    //         // check body
    //         expect(response.statusCode).toBe(200)
    //     })
    // })
})