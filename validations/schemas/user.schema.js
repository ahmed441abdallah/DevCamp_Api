import Joi from "joi";

export const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().max(50).required().messages({
            "string.empty": "User name is required",
            "string.max": "User name cannot be more than 50 characters",
            "any.required": "User name is required"
        }),

        email: Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Email must be a valid email address",
            "any.required": "Email is required"
        }),

        password: Joi.string().min(6).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "any.required": "Password is required"
        }),

        role: Joi.string().enum(["user", "publisher", "admin"]).default("user"),
    });
    // abortEarly: false returns all errors at once, rather than stopping at the first one
    return schema.validate(user, { abortEarly: false });
};
export const validateRegisterUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().max(50).messages({
            "string.empty": "User name cannot be empty",
            "string.max": "User name cannot be more than 50 characters"
        }),

        email: Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Email must be a valid email address",
            "any.required": "Email is required"
        }),

        password: Joi.string().min(6).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "any.required": "Password is required"
        }),

        role: Joi.string().valid("user", "publisher").default("user"),

    }).min(1).required(); // to avoid send it empty

    return schema.validate(user, { abortEarly: false });
};

export const validateLoginUser = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Email must be a valid email address",
            "any.required": "Email is required"
        }),
        password: Joi.string().required().messages({
            "string.empty": "Password is required",
            "any.required": "Password is required"
        })
    }).min(1).required();
    return schema.validate(user, { abortEarly: false });
};
