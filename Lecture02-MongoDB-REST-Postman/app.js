const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();


// Middleware
app.use(express.json());

const meraConnection = new MongoClient("mongodb://localhost:27017");

const dbName = "studentsDB";
const meriCollection = "info";

async function connectDB() {
    await meraConnection.connect();

    console.log("MongoDB Connected Successfully!");
}

app.get("/students", async (req, res) => {
    const db = meraConnection.db(dbName);

    const students = await db 
    .collection(meriCollection)
    .find()
    .toArray()

    res.json(students)
})

app.post("/students", async (req, res) => {
    const db = meraConnection.db(dbName);

    const student = req.body;

    const result = await db 
    .collection(meriCollection)
    .insertOne(student); 

    res.json(student);
    
})

connectDB();

app.listen(3000, (req, res) => {
    console.log("App is listening on port 3000")
})