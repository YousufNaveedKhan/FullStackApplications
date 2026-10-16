const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// What we are happy to send back about a user (never the password)
function publicUser(user) {
    return { id: user._id, name: user.name, email: user.email, role: user.role };
}

// POST /api/auth/register
async function register(req, res) {
    const { name, email, password } = req.body || {};

    // We pick the fields ourselves. The role is NOT taken from the request,
    // otherwise anybody could register as an admin.
    const user = await User.create({ name, email, password });

    res.status(201).json({ token: generateToken(user._id), user: publicUser(user) });
}

// POST /api/auth/login
async function login(req, res) {
    const { email, password } = req.body || {};

    // typeof: a JSON body could send an object instead of text
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    // The password is hidden by default, so we ask for it with +password
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // Same message for both cases, so nobody can find out which emails exist
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: generateToken(user._id), user: publicUser(user) });
}

// GET /api/auth/me  (needs a token)
async function me(req, res) {
    res.json({ user: publicUser(req.user) });
}

module.exports = { register, login, me };
