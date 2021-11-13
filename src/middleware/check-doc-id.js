let castId = require("../lib/is-bson");
let { BadRequestError, ApplicationError } = require("./error-handler");
const checkDocumentId = (req, res, next) => {
    try {
        if (castId(req.params.id)) {
            next();
        } else {
            next(new BadRequestError("Wrong Document id"));
        }
    } catch (error) {
        next(new ApplicationError(error));
    }
};
module.exports = checkDocumentId;
