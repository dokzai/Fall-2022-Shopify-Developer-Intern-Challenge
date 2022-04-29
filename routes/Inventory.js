const express = require('express');
const router = express.Router();
const Inventory = require('../models/InventoryModel');
const mongoose = require('mongoose');
const Warehouse = require('../models/WarehouseModel');

router.get('/', (req, res, next) => {
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
});

router.post('/', (req, res, next) => {
    // get the closest warehouse
    Warehouse.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [req.body.location.coordinates[0], req.body.location.coordinates[1]]
                },
            },
 
        } 
    }).then((locations, err) => {
        if (err) console.log(err);
        console.log(JSON.stringify(locations));
        const item = new Inventory({
            _id: new mongoose.Types.ObjectId(),
            customerID: req.body.customerID,
            weight: req.body.weight,
            status: req.body.status,
            warehouseID: locations[0]._id,
            pricePerUnit: req.body.pricePerUnit,
            address: req.body.address,
            location: {
                type: req.body.location.type,
                coordinates: [req.body.location.coordinates[0], req.body.location.coordinates[1]],
            }
        });
        item.save()
            .then(result => {
                //console.log(result);
                res.status(201).json({
                    message: "Successfully created inventory item and assigned to warehouse :" + locations[0]._id,
                    createdItem: result
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    })
   
});

router.put('/:inventoryID', (req, res, next) => {
    const id = req.params.inventoryID;
    Inventory.findByIdAndUpdate(
        // the id of the item to find
        id,
        
        // the change to be made. Mongoose will smartly combine your existing 
        // document with this change, which allows for partial updates too
        req.body,
        
        // an option that asks mongoose to return the updated version 
        // of the document instead of the pre-updated one.
        {new: true},
        
        // the callback function
        (err, todo) => {
        // Handle any possible database errors
            if (err) return res.status(500).send(err);
            return res.status(202).send(todo);
        }
    );
});

router.delete('/:inventoryID', (req, res, next) => {
    const id = req.params.inventoryID;
    Inventory.remove({
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