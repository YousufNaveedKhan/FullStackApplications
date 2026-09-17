const express = require("express"); 

const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());

// Connection
mongoose.connect("mongodb://localhost:27017/students")
.then(() => {
    console.log("MongoDB Connected Successfully!")
})
.catch((error) => {
    console.log("Failed: ", error);
})

// Schema 
const studentSchema = new mongoose.Schema({
    name: String, 
    email: String, 
    phone: String, 
    course: String, 
    marks: Number
})

// Model
const Student = mongoose.model('Student', studentSchema);


// GET STUDENTS
app.get("/students", async (req, res) => {
    const students = await Student.find();

    res.json(students)
})

// ADD STUDENTS
app.post("/students", async (req, res) => {
    const student = await Student.create(
        req.body
    );
    res.json(student);
    
})

// UPDATE STUDENTS
app.put("/students/:id", async (req, res) => {
    const updateStd = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updateStd);
    
})

// DELETE STUDENTS
app.delete("/students/:id", async (req, res) => {
    const delStd = await Student.findByIdAndDelete(
        req.params.id
    );

    res.json(delStd);
})



// Listening 
app.listen(3000, (req, res) => {
    console.log("App is listening on port 3000")
})

