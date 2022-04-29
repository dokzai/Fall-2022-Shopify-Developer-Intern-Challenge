const express = require('express');
const inventoryRoutes = require("./routes/Inventory");
const warehouseRoutes = require("./routes/Warehouse");

const app = express();
app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// print out methods
app.use(function (req, res, next) {
  console.log(`${req.method} for ${req.url}`);
  next();
});

app.use("/inventory", inventoryRoutes);
app.use("/warehouse", warehouseRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;