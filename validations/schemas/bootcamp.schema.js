import Joi from "joi";

export const validateBootcamp = (bootcamp) => {
    const schema = Joi.object({
        name: Joi.string().max(50).required().messages({
            "string.empty": "Bootcamp name is required",
            "string.max": "Bootcamp name cannot be more than 50 characters",
            "any.required": "Bootcamp name is required"
        }),

        slug: Joi.string().optional(),

        description: Joi.string().max(200).required().messages({
            "string.empty": "Bootcamp description is required",
            "string.max": "Bootcamp description cannot be more than 200 characters",
            "any.required": "Bootcamp description is required"
        }),

        website: Joi.string().pattern(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        ).optional().allow("").messages({
            "string.pattern.base": "Please use a valid URL with HTTP or HTTPS"
        }),

        address: Joi.string().required().messages({
            "string.empty": "Bootcamp address is required",
            "any.required": "Bootcamp address is required"
        }),

        caarers: Joi.array().items(
            Joi.string().valid(
                "Web Development",
                "Mobile Development",
                "UI/UX",
                "Data Science",
                "Business",
                "Other"
            )
        ).required().messages({
            "any.required": "Careers array is required"
        }),

        averageRating: Joi.number().min(1).max(10).optional().messages({
            "number.min": "Rating must be at least 1",
            "number.max": "Rating must can not be more than 10"
        }),

        cost: Joi.number().optional(),

        photo: Joi.string().optional(),

        housing: Joi.boolean().optional()
    });

    // abortEarly: false returns all errors at once, rather than stopping at the first one
    return schema.validate(bootcamp, { abortEarly: false });
};
export const validateUpdateBootcamp = (bootcamp) => {
    const schema = Joi.object({
        name: Joi.string().max(50).messages({
            "string.empty": "Bootcamp name cannot be empty",
            "string.max": "Bootcamp name cannot be more than 50 characters"
        }),

        slug: Joi.string(),

        description: Joi.string().max(200).messages({
            "string.empty": "Bootcamp description cannot be empty",
            "string.max": "Bootcamp description cannot be more than 200 characters"
        }),

        website: Joi.string().pattern(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        ).allow("").messages({
            "string.pattern.base": "Please use a valid URL with HTTP or HTTPS"
        }),

        address: Joi.string().messages({
            "string.empty": "Bootcamp address cannot be empty"
        }),

        caarers: Joi.array().items(
            Joi.string().valid(
                "Web Development",
                "Mobile Development",
                "UI/UX",
                "Data Science",
                "Business",
                "Other"
            )
        ),

        averageRating: Joi.number().min(1).max(10).messages({
            "number.min": "Rating must be at least 1",
            "number.max": "Rating must can not be more than 10"
        }),

        cost: Joi.number(),
        photo: Joi.string(),
        housing: Joi.boolean()
    }).min(1); // 

    return schema.validate(bootcamp, { abortEarly: false });
};