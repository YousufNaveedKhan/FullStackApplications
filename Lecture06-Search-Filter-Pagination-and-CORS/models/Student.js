const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        },
        phone: {
            type: String,
            trim: true,
        },
        course: {
            type: String,
            required: [true, "Course is required"],
            trim: true,
        },
        marks: {
            type: Number,
            min: [0, "Marks cannot be less than 0"],
            max: [100, "Marks cannot be more than 100"],
            default: 0,
        },
    },
    {
        // Adds createdAt and updatedAt automatically
        timestamps: true,
    }
);

module.exports = mongoose.model("Student", studentSchema);
