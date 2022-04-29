const mongoose = require("mongoose");
const GeoJSON = require('geojson');
const Schema = mongoose.Schema;

let warehouseSchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
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

warehouseSchema.index({
  'location': '2dsphere'
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
module.exports = Warehouse;