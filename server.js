const express = require('express');
require("dotenv").config();
const app = express();
const port = 4444;

// localhost:4444/
app.get("/", (req, res) => {
    res.send("<h1> Welcome to ROOT</h1>");
});

// localhost:4444/home
app.get("/home", (req, res) => {
    console.log(req.headers.host, req.url, " was accessed in browser");
    res.send("<h1> welcome to Home</h1>");
});

// localhost:4444/home/whatever
app.get("/home/:something", (req, res) => {
    res.send("<h1>You Entered : " + req.params.something);
});

app.listen(port, () => {
    console.log("Server is running on port:", port);
});