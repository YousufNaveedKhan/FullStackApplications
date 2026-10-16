require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Student API is working" });
});

app.use("/api/students", studentRoutes);

// These two must always come AFTER all routes
app.use(notFound);
app.use(errorHandler);

// Start the server only after the database is connected
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`);
    });
});
