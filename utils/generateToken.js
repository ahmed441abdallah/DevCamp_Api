// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "30d"
    });
};

export default generateToken;