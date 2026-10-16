const jwt = require("jsonwebtoken");

// A token is a signed text that says "this request belongs to user X".
// Only our server knows JWT_SECRET, so nobody else can create a valid token.
function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}

module.exports = generateToken;
