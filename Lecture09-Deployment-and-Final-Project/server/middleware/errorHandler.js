// Runs when no route matched the request
function notFound(req, res, next) {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Express recognises an error handler by its 4 parameters.
// In Express 5, errors thrown inside async routes reach this function automatically.
function errorHandler(err, req, res, next) {
    // The request body is not valid JSON (for example a missing quote in Postman)
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "The request body is not valid JSON" });
    }

    // Mongoose validation failed (required, min, max, match ...)
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: "Validation failed", errors: messages });
    }

    // Duplicate value on a unique field (for example the same email twice)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ message: `${field} already exists` });
    }

    // Anything else is our fault, not the client's
    console.log(err);
    res.status(500).json({ message: "Something went wrong on the server" });
}

module.exports = { notFound, errorHandler };
