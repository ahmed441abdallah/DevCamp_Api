import express from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.js"
import connectDB from "./config/DatabaseConnection.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import fileupload from "express-fileupload"
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import sanitizeInputs from "./middlewares/sanitize.js"
import { authLimiter, globalLimiter } from "./controllers/rateLimiter.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(sanitizeInputs);
app.use(helmet());
app.use(xss());
app.use(hpp());

app.use(express.urlencoded({ extended: true }));
app.set('query parser', 'extended');
app.use(cors({
    credentials: true,
}));
app.use(cookieParser());
app.use(globalLimiter);
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

app.use("/api/v1", apiRoutes);
app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});