const express = require('express');
const router = express.Router();
const Inventory = require('../models/InventoryModel');
const mongoose = require('mongoose');
const Warehouse = require('../models/WarehouseModel');

router.get('/', (req, res, next) => {
    if (req.query.warehouseID) {
        const warehouseIDQuery = req.query.warehouseID;
        Inventory.find({
                warehouseID: warehouseIDQuery
            })
            .exec()
            .then(docs => {
                console.log(docs);
                res.status(200).json(docs);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    } else {
        Inventory.find()
            .exec()
            .then(docs => {
                console.log(docs);
                res.status(200).json(docs);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }

});

router.get('/:inventoryID', (req, res, next) => {
    const id = req.params.inventoryID;
    Inventory.find({
            _id: id
        })
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    Warehouse.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [req.body.originLocation.coordinates[0], req.body.originLocation.coordinates[1]]
                },
            },

        }
    }).then((warehouses, err) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
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
                    coordinates: [req.body.originLocation.coordinates[0], req.body.originLocation.coordinates[1]],
                }
            });
            item.save()
                .then(result => {
                    res.status(201).json({
                        message: "Successfully created inventory item and assigned to warehouse: " + warehouses[0]._id,
                        createdItem: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        }
    })
});

router.put('/:inventoryID', (req, res, next) => {
    const id = req.params.inventoryID;
    Inventory.findByIdAndUpdate(
        id,
        req.body, {
            new: true
        },
        (err, todo) => {
            if (err) return res.status(500).send(err);
            return res.status(202).send(todo);
        }
    );
});

router.delete('/', (req, res, next) => {
    Inventory.deleteMany({})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:inventoryID', (req, res, next) => {
    const id = req.params.inventoryID;
    Inventory.deleteOne({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;