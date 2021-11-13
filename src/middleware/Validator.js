const Joi = require("joi");
const { ApplicationError, BadRequestError } = require("./error-handler");

class Validator {
    static async validateUserRegistration(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const schema = Joi.object({
                name: Joi.string()
                    .alphanum()
                    .min(2)
                    .required()
                    .message("Please , provide a valid name"),
                password: Joi.string()
                    .min(8)
                    .alphanum()
                    .pattern(new RegExp("[A-Z]+"))
                    .pattern(new RegExp("[a-z]+"))
                    .pattern(new RegExp("[0-9]+"))
                    .required()
                    .message("Password does not match the requirement"),
                email: Joi.string()
                    .email({
                        minDomainSegments: 2,
                        tlds: { allow: ["com", "net"] },
                    })
                    .message("Provide a valid email"),
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
    }

    static async validateTodoData(req, res, next) {
        try {
            const { title, description } = req.body;

            const schema = Joi.object({
                title: Joi.string().min(2).required(),
                description: Joi.string().required(),
            });

            const { error, value } = schema.validate({
                title: title,
                description: description,
            });
            if (error) {
                return next(new BadRequestError(error.message));
            }
            next();
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
}

module.exports = Validator;
