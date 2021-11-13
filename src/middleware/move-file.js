const FileService = require("../services/FileService");
const storageHelper = require("../lib/google-storage-helper");
const fileService = new FileService(storageHelper);

class MoveFile {
    static async diskMove(req, res, next) {
        try {
            if (req.file) {
                const avatarName = req.file.originalname;
                const uploadPath = "./public/uploads";
                const todosAvatarPath = "./public/todo_avatars";
                let getFilePath = await fileService.uploadToDisk(
                    avatarName,
                    uploadPath,
                    todosAvatarPath
                );
                req.body.todo_avatar = getFilePath;
                next();
            } else {
                res.status(400).json({ message: "File were expected" });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }

    static async cloudMove(req, res, next) {
        try {
            if (req.file) {
                req.body.todo_avatar = await fileService.uploadToGoogle(
                    req.file
                );
                next();
            } else {
                res.status(400).json({ message: "File were expected" });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = MoveFile;
