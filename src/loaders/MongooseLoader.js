const mongoose = require("mongoose");

const uri = process.env.REMOTE_MONGODB;
const options = {
    useNewUrlParser: true,
    autoIndex: false,
    keepAlive: true,
    useUnifiedTopology: true,
    keepAliveInitialDelay: 5e6,
    serverSelectionTimeoutMS: 10e3,
    socketTimeoutMS: 5000,
};
const launchDB = () => {
    try {
        mongoose.connect(uri, options);
        let db = mongoose.connection;
        db.on("connected", () => {
            console.log("Connected to the database");
        });
        db.on("disconnected", () => {
            console.log("Disconnected from the database");
        });
        db.on("error", () => {
            console.log("An Error occured");
        });
        process.on("SIGINT", () => {
            mongoose.connection.close(() => {
                console.log("Mongoose terminated. Process ended");
            });
            process.exit(0);
        });
    } catch (error) {
        console.error(error);
    }
};

module.exports = launchDB;
