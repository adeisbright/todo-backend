const Joi = require("joi");
const {
    ApplicationError,
    BadRequestError,
} = require("../middleware/error-handler");

const validateUserRegistration = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const schema = Joi.object({
            name: Joi.string().alphanum().min(2).required(),
            password: Joi.string().min(8).alphanum().required(),
            email: Joi.string(),
        });
        const { error, value } = await schema.validate({
            name: name,
            email: email,
            password: password,
        });
        if (error) {
            return next(new BadRequestError(error.message));
        }
        next();
    } catch (error) {
        return next(new ApplicationError(error));
    }
};

module.exports = validateUserRegistration;
