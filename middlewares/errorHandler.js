export const globalErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // mongoose bad object id 
    if (err.name === "CastError") {
        const message = `Bootcamp not found with id of ${err.value}`;
        error = new Error(message);
        error.statusCode = 404;
    }
    // mongoose duplicate key 
    if (err.code === 11000) {
        let message = "Duplicate field value entered";
        if (err.keyPattern && err.keyPattern.bootcamp && err.keyPattern.user) {
            // Both Review and Enrollment have { user, bootcamp } compound index
            // Distinguish by the collection name embedded in the error message
            if (err.message && err.message.toLowerCase().includes("enrollment")) {
                message = "You are already enrolled in this bootcamp";
            } else {
                message = "You have already reviewed this bootcamp";
            }
        } else if (err.keyPattern && err.keyPattern.name) {
            message = "Bootcamp already exists";
        }
        error = new Error(message);
        error.statusCode = 400;
    }
    // mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(err => err.message);
        error = new Error(message);
        error.statusCode = 400;
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "internal server error"
    });
};