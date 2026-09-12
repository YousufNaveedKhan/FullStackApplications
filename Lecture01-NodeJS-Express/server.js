const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Student API is working");
})

app.get("/home", (req, res) => {
    res.send("Home Route is working");
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})