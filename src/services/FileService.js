class FileService {
    constructor(uploader) {
        this.uploader = uploader;
    }
    async uploadToGoogle(file) {
        return this.uploader.uploadImage(file);
    }

    async uploadToDisk(fileName, uploadDir, fileDir) {
        let date = new Date().getDate();
        let parseName = `${date}-${fileName}`;
        this.uploader.createDirectory(fileDir);
        return await this.uploader.moveFile(parseName, uploadDir, fileDir);
    }
}

module.exports = FileService;
