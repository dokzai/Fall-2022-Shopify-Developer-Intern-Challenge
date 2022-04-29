const app = require('./app');
const dotenv = require("dotenv");
const mongoose = require('mongoose');

dotenv.config();
const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@node-rest-inventory.zx2mm.mongodb.net/node-rest-inventory?retryWrites=true&w=majority`

mongoose
    .connect(connectionString)
    .then(() => {
        app.listen(PORT, () => console.log(`server listening on http://localhost:${PORT}/`));
    });

const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

const PORT = process.env.PORT || 3000;