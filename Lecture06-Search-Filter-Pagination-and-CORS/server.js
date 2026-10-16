require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// CORS: only these websites may call our API from a browser.
// CLIENT_URL can hold several addresses separated by commas.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",");

app.use(cors({ origin: allowedOrigins }));

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Student API is working" });
});

// Used by hosting platforms to check that the server is alive
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
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
