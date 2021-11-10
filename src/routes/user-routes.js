const express = require("express");
const router = express.Router();
const Auth = require("../middleware/authenticate-request");
const LoginHandler = require("../middleware/handle-login");
const { validateUserRegistration } = require("../middleware/Validator");

const {
    getUsers,
    getUser,
    addUser,
    updateUser,
    removeUser,
    generateApiKey,
    getApiKey,
} = require("../controller/user.controller");
router.get("/users", getUsers);
router.post("/users", validateUserRegistration, addUser);
router
    .route("/users/:id")
    .get(Auth, getUser)
    .put(Auth, updateUser)
    .delete(Auth, removeUser);
router.post("/auth", LoginHandler);
router.get("/api/key", Auth, getApiKey);
router.put("/api/key", Auth, generateApiKey);
module.exports = router;
