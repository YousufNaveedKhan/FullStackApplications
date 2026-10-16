// Creates the first admin account.  Run it once with:  npm run seed
// The details come from .env, so no password is written inside the code.
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

async function seedAdmin() {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.log("Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file");
        process.exit(1);
    }

    // The example password in .env.example is public, so never create an admin with it
    if (ADMIN_PASSWORD.startsWith("change_this")) {
        console.log("Please choose your own ADMIN_PASSWORD in .env. The example one is public.");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const exists = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (exists) {
        console.log("An account with this email already exists:", exists.email);
    } else {
        await User.create({
            name: ADMIN_NAME || "Admin",
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: "admin",
        });
        console.log("Admin created:", ADMIN_EMAIL);
    }

    await mongoose.disconnect();
}

seedAdmin();
