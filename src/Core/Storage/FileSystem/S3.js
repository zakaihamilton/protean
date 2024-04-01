import { pathNormalize } from "src/Core/Util/Path";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    HeadObjectCommand,
    ListObjectsV2Command
} from "@aws-sdk/client-s3";
import FileStorage from "../File";

export default class FileStorageS3 extends FileStorage {
    constructor() {
        super();
    }

    /** Check if the storage is supported */
    static isSupported() {
        return true;
    }

    /**
     * Opens the storage list asynchronously.
     *
     */
    async open() {
        if (this.client) {
            throw new Error("Storage already opened");
        }

        const accessKeyId = process.env.S3_ID,
            secretAccessKey = process.env.S3_SECRET,
            endpointUrl = process.env.S3_ENDPOINT,
            bucketName = process.env.S3_BUCKET,
            region = process.env.S3_REGION;

        if (!accessKeyId) {
            throw "No Access ID";
        }
        if (!secretAccessKey) {
            throw "No Secret Key";
        }
        if (!endpointUrl) {
            throw "No End Point";
        }

        this.client = new S3Client({
            region,
            endpoint: endpointUrl,
            credentials: {
                accessKeyId,
                secretAccessKey
            }
        });
        this.bucketName = bucketName;
    }

    /**
     * Closes the connection to the list storage.
     *
     * @param {} 
     * @return {} 
     */
    async close() {
        if (this.client) {
            await this.client.destroy();
            this.client = null;
        }
    }

    /**
     * Creates a folder.
     *
     * @param {string} path - The path where the folder should be created.
     * @return {Promise} - A promise that resolves when the folder has been created.
     */
    async createFolder(path) {

    }

    /**
     * Deletes a folder along with its contents.
     *
     * @param {string} path - The path of the folder to be deleted.
     * @return {Promise} - Returns a promise that resolves when the folder and its contents have been successfully deleted.
     */
    async deleteFolder(path) {
        let count = 0;
        if (!path) {
            throw new Error("path is null");
        }
        const recursiveDelete = async (token) => {
            // get the files
            const listCommand = new ListObjectsV2Command({
                Bucket: this.bucketName,
                Prefix: path,
                ContinuationToken: token
            });
            let list = await this.client.send(listCommand);
            if (list.KeyCount) {
                const deleteCommand = new DeleteObjectsCommand({
                    Bucket: this.bucketName,
                    Delete: {
                        Objects: list.Contents.map((item) => ({ Key: item.Key })),
                        Quiet: false,
                    },
                });
                let deleted = await this.client.send(deleteCommand);
                count += deleted?.Deleted?.length;
                if (deleted?.Errors) {
                    deleted.Errors.map((error) => console.log(`${error.Key} could not be deleted - ${error.Code}`));
                }
            }
            if (list.NextContinuationToken) {
                recursiveDelete(list.NextContinuationToken);
            }
            return count;
        };
        return recursiveDelete();
    }

    /**
     * Moves a folder to a different location.
     *
     * @param {type} fromPath - the path of the folder to be moved
     * @param {type} toPath - the path where the folder should be moved to
     * @return {type} description of the return value (if any)
     */
    async moveFolder(fromPath, toPath) {
        if (!fromPath) {
            throw new Error("fromPath is null");
        }
        if (!toPath) {
            throw new Error("toPath is null");
        }
        fromPath = pathNormalize(fromPath);
        toPath = pathNormalize(toPath);
        await this.copyFolder(fromPath, toPath);
        await this.deleteFolder(fromPath);
    }


    /**
     * Copies a folder and its contents to a different location.
     *
     * @param {any} fromPath - the path of the folder to be copied
     * @param {any} toPath - the destination path where the folder will be copied to
     * @return {Promise} a promise that resolves when the folder and its contents have been successfully copied
     */
    async copyFolder(fromPath, toPath) {
        if (!fromPath) {
            throw new Error("fromPath is null");
        }
        if (!toPath) {
            throw new Error("toPath is null");
        }
        fromPath = pathNormalize(fromPath);
        toPath = pathNormalize(toPath);
        if (await this.folderExists(toPath)) {
            throw new Error("Folder already exists: " + toPath);
        }
        let count = 0;
        const recursiveCopy = async token => {
            const listCommand = new ListObjectsV2Command({
                Bucket: this.bucketName,
                Prefix: fromPath,
                ContinuationToken: token
            });
            let list = await this.client.send(listCommand);
            if (list.KeyCount) {
                const fromObjectKeys = list.Contents.map(content => content.Key);
                for (let fromObjectKey of fromObjectKeys) {
                    const toObjectKey = fromObjectKey.replace(fromPath, toPath);
                    const copyCommand = new CopyObjectCommand({
                        ACL: 'public-read',
                        Bucket: this.bucketName,
                        CopySource: `${fromBucket}/${fromObjectKey}`,
                        Key: toObjectKey
                    });
                    await this.client.send(copyCommand);
                    count += 1;
                }
            }
            if (list.NextContinuationToken) {
                recursiveCopy(list.NextContinuationToken);
            }
            return count;
        };
        return recursiveCopy();
    }

    /**
     * Lists files in a folder
     *
     * @param {string} path - the path of the folder
     * @return {type} - a description of the return value
     */
    async listFolder(path) {
        if (!path) {
            throw new Error("path is null");
        }
        path = pathNormalize(path);
        const listing = [];
        const recursiveListing = async token => {
            const listCommand = new ListObjectsV2Command({
                Bucket: this.bucketName,
                Prefix: path,
                ContinuationToken: token
            });
            let list = await this.client.send(listCommand);
            if (list.KeyCount) {
                listing.push(...list.Contents.map((item) => ({ Key: item.Key })));
            }
            if (list.NextContinuationToken) {
                recursiveListing(list.NextContinuationToken);
            }
            return listing;
        };
        return recursiveListing();
    }

    /**
     * Check if a folder exists
     * @param {string} path - the path of the folder
     */
    async folderExists(path) {
        if (!path) {
            throw new Error("path is null");
        }
        if (!path) {
            throw new Error("path is null");
        }
        path = pathNormalize(path);
        const listCommand = new ListObjectsV2Command({
            Bucket: this.bucketName,
            Prefix: path
        });
        let list = await this.client.send(listCommand);
        return !!list.KeyCount;
    }

    /**
     * Reads the content of a file.
     *
     * @param {String} path - The path of the file to be read.
     * @return {Promise} A Promise that resolves to the content of the file.
     */
    async readFile(path) {
        if (!path) {
            throw new Error("path is null");
        }
        path = pathNormalize(path);
        const downloadParams = {
            Bucket: this.bucketName,
            Key: path
        };
        const response = await this.client.send(new GetObjectCommand(downloadParams));
        const data = await new Promise((resolve, reject) => {
            const chunks = [];
            response.Body.on("data", (chunk) => chunks.push(chunk));
            response.Body.on("end", () => resolve(Buffer.concat(chunks)));
            response.Body.on("error", reject);
        });
        return data;
    }

    /**
     * Creates or updates a file.
     *
     * @param {string} path - The path of the file.
     * @param {string} content - The content to be written to the file.
     * @return {Promise} - A promise that resolves when the file is successfully created or updated.
     */
    async writeFile(path, content) {
        if (!path) {
            throw new Error("path is null");
        }
        path = pathNormalize(path);
        const uploadParams = {
            Bucket: this.bucketName,
            Key: path,
            Body: content,
            ACL: "public-read"
        };
        const response = await this.client.send(new PutObjectCommand(uploadParams));
        return response;
    }

    /**
     * Deletes a file.
     *
     * @param {string} path - The path of the file to be deleted.
     * @return {Promise} A promise that resolves when the file is successfully deleted.
     */
    async deleteFile(path) {
        if (!path) {
            throw new Error("path is null");
        }
        path = pathNormalize(path);
        const deleteParams = {
            Bucket: this.bucketName,
            Key: path
        };
        const response = await this.client.send(new DeleteObjectCommand(deleteParams));
        return response;
    }

    /**
     * Moves a file to a different location.
     *
     * @param {type} fromPath - the current path of the file
     * @param {type} toPath - the new path where the file should be moved
     * @return {type} description of return value
     */
    async moveFile(fromPath, toPath) {
        if (!fromPath) {
            throw new Error("fromPath is null");
        }
        if (!toPath) {
            throw new Error("toPath is null");
        }
        await this.copyFile(fromPath, toPath);
        await this.deleteFile(fromPath);
    }

    /**
     * Copies a file to a different location.
     *
     * @param {type} fromPath - the path of the file to be copied
     * @param {type} toPath - the path of the destination location
     * @return {type} - a description of the return value
     */
    async copyFile(fromPath, toPath) {
        if (!fromPath) {
            throw new Error("fromPath is null");
        }
        if (!toPath) {
            throw new Error("toPath is null");
        }
        if (await this.fileExists(toPath)) {
            throw new Error("File already exists: " + toPath);
        }
        fromPath = pathNormalize(fromPath);
        toPath = pathNormalize(toPath);
        const copyParams = {
            Bucket: this.bucketName,
            CopySource: encodeURIComponent(`${this.bucketName}/${fromPath}`),
            Key: toPath
        };
        const copyResponse = await this.client.send(new CopyObjectCommand(copyParams));
        return copyResponse;
    }

    /**
     * Check if a file exists
     * @param {string} path - the path of the file
     */
    async fileExists(path) {
        if (!path) {
            throw new Error("path is null");
        }
        path = pathNormalize(path);
        const params = {
            Bucket: this.bucketName,
            Key: path
        }
        let exists = false;
        try {
            await this.client.send(new HeadObjectCommand(params));
            exists = true;
        } catch (err) {
            exists = false;
        }
        return exists;
    }

    /**
     * Removes all folders and files from the storage.
     * @return {Promise<void>} A promise that resolves when the storage is cleared
     */
    async reset() {
        let count = 0;
        const recursiveDelete = async token => {
            // get the files
            const listCommand = new ListObjectsV2Command({
                Bucket: this.bucketName,
                ContinuationToken: token
            });
            let list = await this.client.send(listCommand);
            if (list.KeyCount) {
                const deleteCommand = new DeleteObjectsCommand({
                    Bucket: this.bucketName,
                    Delete: {
                        Objects: list.Contents.map((item) => ({ Key: item.Key })),
                        Quiet: false,
                    },
                });
                let deleted = await this.client.send(deleteCommand);
                count += deleted?.Deleted?.length;
                if (deleted?.Errors) {
                    console.error(deleted.Errors.map((error) => console.log(`${error.Key} could not be deleted - ${error.Code}`)));
                }
            }
            if (list.NextContinuationToken) {
                recursiveDelete(list.NextContinuationToken);
            }
            return count;
        };
        return recursiveDelete();
    }
}
