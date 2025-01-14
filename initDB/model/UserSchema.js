const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserType = Object.freeze({
    ADMIN: "Admin",
    DONOR: "Donor",
    CHARITY: "Charity",
});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "username is required"],
            trim: true,
            unique: [true, "username must be unique"],
        },

        email: {
            type: String,
            required: [true, "email is required"],
            unique: [true, "email must be unique"],
            match: [/\S+@\S+\.\S+/, "is invalid"],
        },

        hashedPassword: {
            type: String,
            required: [true, "password is required"],
        },

        role: {
            type: String,
            enum: Object.values(UserType),
            required: true,
        },

        isActive: {
            type: Boolean,
            required: true,
        },

        refreshToken: {
            type: String,
            required: false,
            default: "",
        },
        otp: {
            type: String,
            required: false,
            default: "",
        },
        otpExpiry: {
            type: Date,
            required: false,
        },
        introVideo: {
            type: String,
            trim: true,
            default: "",
            required: false,
        },
        avatar: {
            type: String,
            trim: true,
            default: "",
            required: false,
        },
    },
    {
        timestamps: true,
    }
);
const createUserModel = (dbConnection) =>
    dbConnection.model("User", userSchema);

module.exports = createUserModel;
