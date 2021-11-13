const fs = require("fs").promises;
const path = require("path");
const currentPath = __dirname;
const directoryName = path.dirname(currentPath);

exports.moveFile = async (fileName, oldPath, newPath) => {
    try {
        let oldLocation = `${oldPath}/${fileName}`;
        let newLocation = `${newPath}/${fileName}`;
        await fs.rename(
            path.join(directoryName, oldLocation),
            path.join(directoryName, newLocation)
        );
        return path.join(directoryName, newLocation);
    } catch (error) {
        return error;
    }
};
exports.createDirectory = async (name) => {
    try {
        let createDir = await fs.mkdir(path.join(directoryName, name));
        if (createDir) {
            return "The directory was created";
        } else {
            throw new Error("Problem while trying to create dir");
        }
    } catch (error) {
        return error;
    }
};
exports.deleteFile = async (fileLocation) => {
    try {
        await fs
            .unlink(fileLocation)
            .then((res) => {
                return "The file was removed successfully";
            })
            .catch((err) => {
                throw new Error(err);
            });
    } catch (error) {
        return error;
    }
};
