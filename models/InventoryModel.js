const mongoose = require("mongoose");
const GeoJSON  = require('geojson');
const Schema = mongoose.Schema;

let inventorySchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  customerID: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "received",
  },
  warehouseID: {
    type: String,
    required: true
  },
  pricePerUnit: {
    type: Number,
    required: true,
    default: 0.0,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  }
});

inventorySchema.index({'location': '2dsphere'});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;