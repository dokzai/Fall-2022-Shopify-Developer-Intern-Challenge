const mongoose = require("mongoose");
const GeoJSON = require('geojson');
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
    default: "received",
  },
  warehouseID: {
    type: String,
    default: null,
  },
  pricePerUnit: {
    type: Number,
    required: true,
    default: 0.0,
  },
  originAddress: {
    type: String,
    required: true,
  },
  originLocation: {
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

inventorySchema.index({
  'location': '2dsphere'
});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;