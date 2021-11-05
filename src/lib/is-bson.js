"use strict";
const mongoose = require("mongoose");
/**
 * @description Tries to Cast a provided string to BSON
 * @param {String} id
 * @returns {Boolean} true or false depending if String can be casted to BSON
 */
const isBSON = (id) => (mongoose.Types.ObjectId.isValid(id) ? true : false);

module.exports = isBSON;
