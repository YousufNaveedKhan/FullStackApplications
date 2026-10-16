const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 1. protect: "are you logged in?"
// The client sends:  Authorization: Bearer <token>
async function protect(req, res, next) {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Please log in first" });
    }

    const token = header.split(" ")[1];

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(401).json({ message: "This user no longer exists" });
    }

    // Later middleware and controllers can now use req.user
    req.user = user;
    next();
}

// 2. authorize: "are you allowed to do this?"
// Usage: authorize("admin")
function authorize(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You do not have permission to do this" });
        }
        next();
    };
}

module.exports = { protect, authorize };
