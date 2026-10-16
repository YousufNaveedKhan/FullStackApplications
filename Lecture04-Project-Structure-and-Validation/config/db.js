const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
        // There is no point running the API without a database
        process.exit(1);
    }
}

module.exports = connectDB;
