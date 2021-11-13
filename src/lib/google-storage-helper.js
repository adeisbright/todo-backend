const util = require("util");
const GoogleCloud = require("@google-cloud/storage");
const path = require("path");
const ServiceKeyFile = process.env.CLOUD_BUCKET_SERVICE_KEY;
const BUCKET_NAME = "bigjara_learn";
const serviceKey = path.join(__dirname, "../../storage_credentials.json");

const { Storage } = GoogleCloud;
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: process.env.GOOGLE_PROJECT_ID,
});

const bucket = storage.bucket(BUCKET_NAME);

class GoogleStorage {
    createBucket = async (bucketName, storageClass, region = "Asia") => {
        try {
            const [bucket] = await storage.createBucket(bucketName, {
                location: region,
                storageClass: storageClass,
            });
            if (!bucket)
                throw new Error(`Unable to create the bucket ${bucketName}`);
            return `${bucketName} was created`;
        } catch (error) {
            return {
                message: error.message,
            };
        }
    };
    deleteBucket = async (bucketName) => {
        try {
            if (await storage.bucket(bucketName).delete()) {
                return `${bucketName} was deleted`;
            }
            throw new Error(`Unable to perform delete on ${bucketName}`);
        } catch (error) {
            return {
                message: error.message,
            };
        }
    };
    /**
     * @description
     * returns a list of buckets for the selected project
     * @return {<String>}
     */
    listBuckets = async () => {
        try {
            const [buckets] = await storage.getBuckets();
            if (buckets) return buckets;
            throw new Error("Issues occured");
        } catch (error) {
            return {
                message: error.message,
            };
        }
    };
    /**
     * @description
     * returns true if bucket exist or false if it does not
     * @param {String} bucketName
     * name of the bucket that is to be searched within the project
     * @return {Boolean}
     */
    findBucket = async (bucketName) => {
        try {
            const [buckets] = await storage.getBuckets();
            if (buckets) {
                const bucketExist = buckets.find((val) => val == bucketName);
                return bucketExist;
            }
            throw new Error("Error finding bucket");
        } catch (error) {
            return {
                message: error.message,
            };
        }
    };
    listFiles = async (bucketName) => {
        try {
            const [files] = await storage.bucket(bucketName).getFiles();
            if (files) return files;
            throw new Error("Issues occured");
        } catch (error) {
            return {
                message: error.message,
            };
        }
    };
    uploadImage = (file) =>
        new Promise((resolve, reject) => {
            const { originalname, buffer } = file;
            const blob = bucket.file(originalname.replace(/ /g, "_"));
            console.log(bucket.name, blob.name);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });
            blobStream
                .on("finish", () => {
                    const publicUrl = util.format(
                        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                    );
                    resolve(publicUrl);
                })
                .on("error", (e) => {
                    console.log(e);
                    reject("Unable to upload image something went wrong");
                })
                .end(buffer);
        });
    deleteFile = async (fileName) => await bucket.file(fileName).delete();
}

module.exports = new GoogleStorage();
