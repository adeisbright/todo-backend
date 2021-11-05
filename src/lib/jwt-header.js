module.exports = {
    secret: process.env.JWT_SECRET,
    header: {
        algorithm: "HS256",
        expiresIn: "600000000",
        issuer: process.env.JWT_ISSUER,
        subject: "Authorization",
    },
};
