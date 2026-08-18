import express from "express";
import dotenv from "dotenv";
import bootcamps from "./routes/Bootcamp.js";
import connectDB from "./config/DatabaseConnection.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import courses from "./routes/course.js";
import fileupload from "express-fileupload"
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import reviews from "./routes/review.js";
import wishlist from "./routes/wishlist.js";
import enrollments from "./routes/enrollment.js";
import sanitize from "mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";

dotenv.config();
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.body = sanitize(req.body);
    req.params = sanitize(req.params);
    const sanitizedQuery = {};
    for (const key in req.query) {
        sanitizedQuery[key] = sanitize(req.query[key]);
    }
    Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
        configurable: true,
        enumerable: true
    });

    next()
})
app.use(helmet());
app.use(xss());
app.use(hpp());

app.use(express.urlencoded({ extended: true }));
app.set('query parser', 'extended');
app.use(cors({
    credentials: true,
}));
app.use(cookieParser());
app.use(fileupload({
    limits: { fieldSize: 5 * 1024 * 1024 },
    useTempfiles: true,
    tempFileDir: './tmp/'
}));

const PORT = process.env.PORT || 5000;
connectDB();
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/wishlist", wishlist);
app.use("/api/v1/enrollments", enrollments);
app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});