const express = require("express");
const router = express.Router();
const checkId = require("../middleware/check-doc-id");
const {
    getItems,
    getItem,
    removeItem,
    updateItem,
    createItem,
    getCalenderCode,
    createGoogleEvent,
} = require("../controller/item.controller");
const multerMemory = require("../middleware/save-file-to-memory");
const multerDisk = require("../middleware/save-file-to-disk");
const Auth = require("../middleware/authenticate-request");
const MoveFile = require("../middleware/move-file");
router
    .all("/items", Auth)
    .route("/items")
    .get(getItems)
    .post(multerMemory.single("attachment"), MoveFile.cloudMove, createItem);
// .post(multerDisk.saveToDisk.single("attachment"), createItem);
router.all("/items/:id", checkId, Auth);
router.route("/items/:id").get(getItem).delete(removeItem).put(updateItem);
router.get("/aouth2", getCalenderCode);
router.all("/events", Auth);
router.route("/events").post(createGoogleEvent);
router.get("/v1/todos", Auth, getItems);
router.all("/v1/todos/:id", Auth);
router.route("/v1/todos/:id").get(getItem).put(updateItem).delete(removeItem);
module.exports = router;
