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

    res.json(result);
    
})

app.put("/students/:id", async (req, res) => {
    const db = meraConnection.db(dbName);

    const id = req.params.id;

    const updatedData = req.body;

    const result = await db 
    .collection(meriCollection)
    .updateOne(
        {
            _id: new ObjectId(id)
        }, 
        {
            $set: updatedData
        }
    ); 

    res.json(result);
    
})

app.delete("/students/:id", async (req, res) => {
    const db = meraConnection.db(dbName);

    const id = req.params.id;

    const result = await db 
    .collection(meriCollection)
    .deleteOne({
        _id: new ObjectId(id)
    }); 

    res.json(result);
    
})


connectDB();

app.listen(3000, (req, res) => {
    console.log("App is listening on port 3000")
})