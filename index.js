const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const inventoryRoutes = require("./routes/Inventory");
const warehouseRoutes = require("./routes/Warehouse");

dotenv.config();
 
const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@node-rest-inventory.zx2mm.mongodb.net/node-rest-inventory?retryWrites=true&w=majority`


const app = express();
app.use(express.json());
mongoose
  .connect(connectionString)
  .then(() => {
    app.listen(PORT, () => console.log(`server listening on http://localhost:${PORT}/`));
  });
const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

// print out methods
app.use(function(req,res,next){
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

const PORT = process.env.PORT || 3000;

module.exports = app;