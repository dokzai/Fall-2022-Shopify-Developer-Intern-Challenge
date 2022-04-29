const express = require("express");
const router = express.Router();
const Inventory = require("../models/InventoryModel");
const mongoose = require("mongoose");
const Warehouse = require("../models/WarehouseModel");

// retrieves all inventory items
router.get("/", (req, res, next) => {
    // checks if querying by warehouseID
    if (req.query.warehouseID) {
        const warehouseIDQuery = req.query.warehouseID;
        Inventory.find({
                warehouseID: warehouseIDQuery,
            })
            .exec()
            .then((docs) => {
                res.status(200).json(docs);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err,
                });
            });
    } else {
        Inventory.find()
            .exec()
            .then((docs) => {
                res.status(200).json(docs);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err,
                });
            });
    }
});

// retrieves specific inventory based on ID
router.get("/:inventoryID", (req, res, next) => {
    const id = req.params.inventoryID;
    Inventory.find({
            _id: id,
        })
        .exec()
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

// creates a new inventory item
router.post("/", (req, res, next) => {
    // finds a warehouse to put the item
    Warehouse.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [
                        req.body.originLocation.coordinates[0],
                        req.body.originLocation.coordinates[1],
                    ],
                },
            },
        },
    }).then((warehouses, err) => {
        console.log(warehouses);
        if (warehouses.length == 0) {
            res.status(406).json({
                message: "A Warehouse must exist for an inventory item to be sent to",
            });
        } else if (err) {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        } else {
            // creates and 'stores' the new inventory item
            const item = new Inventory({
                _id: new mongoose.Types.ObjectId(),
                customerID: req.body.customerID,
                weight: req.body.weight,
                status: "stored",
                warehouseID: warehouses[0]._id,
                pricePerUnit: req.body.pricePerUnit,
                originAddress: req.body.originAddress,
                originLocation: {
                    type: req.body.originLocation.type,
                    coordinates: [
                        req.body.originLocation.coordinates[0],
                        req.body.originLocation.coordinates[1],
                    ],
                },
            });
            item
                .save()
                .then((result) => {
                    res.status(201).json({
                        message: "Successfully created inventory item and assigned to warehouse: " +
                            warehouses[0]._id,
                        createdItem: result,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        error: err,
                    });
                });
        }
    });
});

// updates inventory item
router.put("/:inventoryID", (req, res, next) => {
    const id = req.params.inventoryID;
    Inventory.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

// deletes all inventory items
router.delete("/", (req, res, next) => {
    Inventory.deleteMany({})
        .exec()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

// deletes specific inventory item by ID
router.delete("/:inventoryID", (req, res, next) => {
    const id = req.params.inventoryID;
    Inventory.findOneAndRemove({
            _id: id,
        })
        .exec()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

module.exports = router;