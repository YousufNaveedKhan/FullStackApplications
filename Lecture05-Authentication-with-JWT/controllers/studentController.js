const mongoose = require("mongoose");
const Student = require("../models/Student");

// Small helper: is this a valid MongoDB id?
function isBadId(id) {
    return !mongoose.isValidObjectId(id);
}

// GET /api/students
async function getStudents(req, res) {
    const students = await Student.find().sort({ createdAt: -1 });

    res.json(students);
}

// GET /api/students/:id
async function getStudent(req, res) {
    if (isBadId(req.params.id)) {
        return res.status(400).json({ message: "Invalid student id" });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
}

// POST /api/students
async function createStudent(req, res) {
    const student = await Student.create(req.body);

    // 201 means "Created"
    res.status(201).json(student);
}

// PUT /api/students/:id
async function updateStudent(req, res) {
    if (isBadId(req.params.id)) {
        return res.status(400).json({ message: "Invalid student id" });
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // return the updated document
        runValidators: true, // apply the schema rules on updates too
    });

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
}

// DELETE /api/students/:id
async function deleteStudent(req, res) {
    if (isBadId(req.params.id)) {
        return res.status(400).json({ message: "Invalid student id" });
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted", id: student._id });
}

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
};
