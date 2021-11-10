const UserService = require("../services/UserService");
const { v4: uuidv4 } = require("uuid");
const {
    ApplicationError,
    DbError,
    NotFoundError,
    NotAuthorizeError,
} = require("../middleware/error-handler");
const bcrypt = require("bcryptjs");

class UserController {
    async getUsers(req, res, next) {
        try {
            const results = await UserService.getUsers();
            res.status(200).json(results);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
    async getUser(req, res, next) {
        try {
            let id = req.params.id;
            const result = await UserService.getUser(id);
            res.status(200).json(result);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async addUser(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const isUser = await UserService.findUser("email", email);
            if (isUser) throw new Error("A user already exist");
            let hashPwd = await bcrypt.hash(password, 10);
            await UserService.addUser([name, email.toLowerCase(), hashPwd]);
            res.status(200).json({
                status: 200,
                message: "The user was added successfully",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async updateUser(req, res, next) {
        try {
            const { name, email } = req.body;
            const id = req.params.id;
            const result = await UserService.updateUser(
                [name, email, id],
                "name",
                "email"
            );
            res.status(200).json(result);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
    async removeUser(req, res, next) {
        try {
            const id = req.params.id;
            const result = await UserService.removeUser(id);
            res.status(200).json(result);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async testTransaction(req, res, next) {
        try {
            const queryValue = ["Joshua Tola", "joshtola@gmail.com"];
            const result = await UserService.transaction(queryValue);
            res.status(200).json(result);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
    async createTable(req, res, next) {
        try {
            const result = await UserService.createTable();
            res.status(200).json(result);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
    async addColumn(req, res, next) {
        try {
            const { table, column, cType } = req.body;
            await UserService.addColumn(table, column, cType);
            res.status(200).json({
                message: "The column was successfully added",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
    async generateApiKey(req, res, next) {
        try {
            let key = uuidv4();
            let id = req.id;
            await UserService.updateColumn("users", "api_key", key, id);
            res.status(200).json({
                data: key,
                message: "ok",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
    async getApiKey(req, res, next) {
        try {
            let id = req.id;
            let key = await UserService.retrieveData("users", "api_key", id);
            res.status(200).json(key);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
}

module.exports = new UserController();
