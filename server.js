const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { getUploadsDir } = require("./helper");
const app = express();

// Getting Routes
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route.js");
const categoryRoutes = require("./routes/category.route");
const subcategoryRoutes = require("./routes/subcategory.route");


// Middlewares
app.use(cors());  //CORS Middleware
app.use(express.json()); //Allows to parse JSON ~ So we can get get json data from req.body
app.use(express.urlencoded({ extended: true })); // https://stackoverflow.com/a/51844327
app.use(cookieParser());
app.use(express.static(getUploadsDir())); //to serve /uploads as static server


// Using Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api",subcategoryRoutes);


// Enviornment variables
const port = process.env.PORT || 4444;
const mongoURI = process.env.DATABASE;


// MONGODB Connection using mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .catch(err => console.log("Initial Connection Error!", err));

const connection = mongoose.connection;
connection.on('error', err => console.log("ErrorAfter Connection!", err));

connection.once("open", () => {
    console.log("MongoDB Established successfully.");
})

app.listen(port, () => {
    console.log(`Edupath-Backend Server is running on port: ${port}=>`);
});