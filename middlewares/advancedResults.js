export const advancedResults = (model, populate) => async (req, res, next) => {
    try {
        let query;
        // copy req.query
        const reqQuery = { ...req.query };
        // remove fields from query
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(field => delete reqQuery[field]);
        // advanced filtering
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        // build the default query object
        query = model.find(JSON.parse(queryStr));
        // populate
        if (populate) {
            query = query.populate(populate);
        }

        // select specific fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const total = await model.countDocuments(JSON.parse(queryStr));

        query = query.skip(skip).limit(limit);

        // execution
        const results = await query;

        const pagination = { page, limit, total };

        if (skip + limit < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (skip > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.advancedResults = {
            success: true,
            count: results.length,
            pagination,
            data: results
        };

        next();
    } catch (err) {
        next(err);
    }
};