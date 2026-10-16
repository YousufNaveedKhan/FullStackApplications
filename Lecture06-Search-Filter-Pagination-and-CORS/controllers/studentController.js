const mongoose = require("mongoose");
const Student = require("../models/Student");

// Small helper: is this a valid MongoDB id?
function isBadId(id) {
    return !mongoose.isValidObjectId(id);
}

// Make user text safe to use inside a regular expression
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Only these fields may be used for sorting (never trust the client blindly)
const SORTABLE = ["name", "marks", "createdAt"];

// GET /api/students
// Example: /api/students?search=ali&course=Node.js&minMarks=50&sort=-marks&page=2&limit=5
async function getStudents(req, res) {
    // Query values arrive as text. "?search=a&search=b" would arrive as a list, so we accept plain text only.
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const course = typeof req.query.course === "string" ? req.query.course : "";
    const sort = typeof req.query.sort === "string" ? req.query.sort : "-createdAt";
    const { minMarks, page = 1, limit = 10 } = req.query;

    // 1. Filter
    const filter = {};

    if (search) {
        const pattern = new RegExp(escapeRegex(search), "i"); // "i" = ignore upper/lower case
        filter.$or = [{ name: pattern }, { email: pattern }];
    }

    if (course) {
        filter.course = new RegExp(`^${escapeRegex(course)}$`, "i");
    }

    if (minMarks !== undefined && minMarks !== "" && !Number.isNaN(Number(minMarks))) {
        filter.marks = { $gte: Number(minMarks) };
    }

    // 2. Sort: "-marks" means highest first, "marks" means lowest first
    const sortField = sort.replace("-", "");
    const sortBy = SORTABLE.includes(sortField) ? sort : "-createdAt";

    // 3. Pagination
    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter).sort(sortBy).skip(skip).limit(limitNumber);

    res.json({
        data: students,
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
    });
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
