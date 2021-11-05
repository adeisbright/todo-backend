const jwt = require("jsonwebtoken");
const tokenHeader = require("../lib/jwt-header");
const {
    ApplicationError,
    BadRequestError,
} = require("../middleware/error-handler");
const UserService = require("../services/UserService");

const authenticateRequest = async (req, res, next) => {
    try {
        if (typeof req.headers.authorization !== "undefined") {
            let token = req.headers.authorization.split(" ")[1];
            jwt.verify(
                token,
                tokenHeader.secret,
                tokenHeader.header,
                async (err, data) => {
                    if (err) {
                        return next(new BadRequestError(err.message));
                    } else {
                        let tokenDetail = await jwt.decode(token);
                        req.id = tokenDetail.id;
                        return next();
                    }
                }
            );
        } else if (typeof req.headers["api-key"] !== "undefined") {
            let key = req.headers["api-key"];
            let user = await UserService.findUser("api_key", key);
            if (!user) {
                return next(new BadRequestError("Invalid API KEY"));
            }
            req.id = user.id;
            return next();
        } else {
            return next(new BadRequestError("Missing Authorization"));
        }
    } catch (error) {
        return next(new ApplicationError(error));
    }
};

module.exports = authenticateRequest;
