import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import colors from "colors";
import mongoose from "mongoose";
import BootCamp from "./models/Bootcamp.js";
import Course from "./models/Course.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGO_URI);

const bootcamps = JSON.parse(fs.readFileSync(path.join(__dirname, "_data", "bootcamps.json"), "utf-8"));
const courses = JSON.parse(fs.readFileSync(path.join(__dirname, "_data", "courses.json"), "utf-8"));

const importData = async () => {
    try {
        await BootCamp.create(bootcamps);
        await Course.create(courses);
        console.log("Data imported".green.inverse);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
const deleteData = async () => {
    try {
        await BootCamp.deleteMany();
        await Course.deleteMany();
        console.log("Data deleted".red.inverse);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}