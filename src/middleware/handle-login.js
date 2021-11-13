const bcrypt = require("bcryptjs");
const signToken = require("../lib/sign-token");
const { validateEmail } = require("../lib/validators");
const tokenHeader = require("../lib/jwt-header");
const UserService = require("../services/UserService");
const {
    ApplicationError,
    DbError,
    NotFoundError,
    NotAuthorizeError,
    BadRequestError,
} = require("../middleware/error-handler");

const handleLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!validateEmail(email)) {
            return next(new BadRequestError("Fill form correctly"));
        }
        let user = await UserService.findUser("email", email.toLowerCase());
        if (!user)
            return next(
                new NotFoundError("We could not find a user with this record")
            );
        if (!(await bcrypt.compare(password, user.password))) {
            return next(new NotFoundError("Incorrect details provided"));
        }
        let token = await signToken(
            user.id,
            tokenHeader.secret,
            tokenHeader.header
        );

        res.status(200).json({
            token: token,
            email: user.email,
            status: 200,
        });
    } catch (error) {
        return next(new ApplicationError(error));
    }
};

module.exports = handleLogin;
