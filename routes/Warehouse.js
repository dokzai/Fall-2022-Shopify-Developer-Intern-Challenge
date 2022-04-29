const express = require('express');
const router = express.Router();
const Warehouse = require('../models/WarehouseModel');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Warehouse.find()
        .exec()
        .then(docs => {
            //console.log(docs);
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
    const warehouse = new Warehouse({
        _id: new mongoose.Types.ObjectId(),
        capacity: req.body.capacity,
        address: req.body.address,
        location: {
            type: req.body.location.type,
            coordinates: [req.body.location.coordinates[0], req.body.location.coordinates[1]],
        },
        items: req.body.items,
    });
    warehouse.save()
        .then(result => {
            //console.log(result);
            res.status(201).json({
                message: "Successfully create warehouse!",
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


module.exports = router;