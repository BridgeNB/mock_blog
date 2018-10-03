module.exports = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/mock-blog',
    MONGO_TEST_URL: process.env.MONGO_TEST_URL || 'mongodb://localhost:21017/test-mock-blog',
    HTTP_STATUS_CODES: {
        OK: 200,
        CREATED: 201,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
    }
};