"use strict";
class ApplicationError extends Error {
    get name() {
        return this.constructor.name;
    }
    get statusCode() {
        return 500;
    }
}

/**
 * @description DBError are classes of errors for a faulty Database Operation
 */
class DbError extends ApplicationError {
    constructor(message) {
        super(message);
    }
    get statusCode() {
        return 500;
    }
}
class BadRequestError extends ApplicationError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {
        return 400;
    }
}

class NotFoundError extends ApplicationError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {
        return 404;
    }
}

class NotAuthorizeError extends ApplicationError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {
        return 401;
    }
}

class ForbiddenError extends ApplicationError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {
        return 403;
    }
}

const errorParser = (err, req, res, next) => {
    if (err instanceof ApplicationError) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        res.status(500).json({ message: "ERROR 500 : Internal Server Error" });
    }
    console.log(err);
};

module.exports = {
    ApplicationError,
    BadRequestError,
    NotAuthorizeError,
    NotFoundError,
    DbError,
    ForbiddenError,
    errorParser,
};
