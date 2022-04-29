const express = require('express');
const router = express.Router();
const Warehouse = require('../models/WarehouseModel');
const mongoose = require('mongoose');

// retrieve all warehouses
router.get('/', (req, res, next) => {
    Warehouse.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// retrieve warehouse by ID
router.get('/:warehouseID', (req, res, next) => {
    const id = req.params.warehouseID;
    Warehouse.find({
            warehouseID: id
        })
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// create new warehouse
router.post('/', (req, res, next) => {
    const warehouse = new Warehouse({
        _id: new mongoose.Types.ObjectId(),
        address: req.body.address,
        location: {
            type: req.body.location.type,
            coordinates: [req.body.location.coordinates[0], req.body.location.coordinates[1]],
        },
    });
    warehouse.save()
        .then(result => {
            res.status(201).json({
                message: "Successfully created warehouse!",
                createdItem: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// update warehouse by ID
router.put('/:warehouseID', (req, res, next) => {
    const id = req.params.warehouseID;
    Warehouse.findByIdAndUpdate(
        id,
        req.body, {
            new: true
        }).then((result) => {
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