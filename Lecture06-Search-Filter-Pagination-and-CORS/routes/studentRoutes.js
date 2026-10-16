const express = require("express");

const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
} = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Everything below needs a logged-in user
router.use(protect);

// Any logged-in user can read
router.get("/", getStudents);
router.get("/:id", getStudent);

// Only an admin can create, change or delete
router.post("/", authorize("admin"), createStudent);
router.put("/:id", authorize("admin"), updateStudent);
router.delete("/:id", authorize("admin"), deleteStudent);

module.exports = router;
