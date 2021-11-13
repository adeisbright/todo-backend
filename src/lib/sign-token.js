const jwt = require("jsonwebtoken");
/**
 *
 * @param {Object} obj Object token needs to be signed against
 * @param {String} secret Secret for verifying token
 * @param {Object} header Object containing information about jwt
 * @returns {String} token
 */
const signToken = async (id, secret, header) => {
    try {
        const payload = {
            id: id,
        };
        return await jwt.sign(payload, secret, header);
    } catch (error) {
        return error;
    }
};
module.exports = signToken;
