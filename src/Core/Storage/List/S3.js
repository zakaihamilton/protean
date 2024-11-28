'use server'

import { pathNormalize } from "src/Core/Util/Path";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    HeadObjectCommand,
    ListObjectsV2Command
} from "@aws-sdk/client-s3";

let client = null;

const accessKeyId = process.env.S3_ID,
    secretAccessKey = process.env.S3_SECRET,
    endpointUrl = process.env.S3_ENDPOINT,
    bucketName = process.env.S3_BUCKET,
    region = process.env.S3_REGION;

/**
 * Checks if the functionality is supported.
 *
 * @return {boolean} Returns true if the functionality is supported, false otherwise.
*/
export async function isSupported() {
    return true;
}

/**
 * Opens the storage asynchronously.
 *
 */
export async function open() {
    if (client) {
        throw new Error("Storage already opened");
    }

    if (!accessKeyId) {
        throw "No Access ID";
    }
    if (!secretAccessKey) {
        throw "No Secret Key";
    }
    if (!endpointUrl) {
        throw "No End Point";
    }

    client = new S3Client({
        region,
        endpoint: endpointUrl,
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    });
}

/**
 * Closes the connection to the list storage.
 *
 * @param {} 
 * @return {} 
 */
export async function close() {
    if (client) {
        await client.destroy();
        client = null;
    }
}

/**
 * Retrieves the value for the given key.
 *
 * @param {string} key - The key to retrieve the value for.
 * @return {type} The value associated with the given key.
 */
export async function get(key) {
    if (!key) {
        throw new Error("path is null");
    }
    key = pathNormalize(key);
    const downloadParams = {
        Bucket: bucketName,
        Key: key
    };
    try {
        const response = await client.send(new GetObjectCommand(downloadParams));
        const data = await new Promise((resolve, reject) => {
            const chunks = [];
            response.Body.on("data", (chunk) => chunks.push(chunk));
            response.Body.on("end", () => resolve(Buffer.concat(chunks)));
            response.Body.on("error", reject);
        });
        return data;
    }
    catch (e) {
        if (e.Code === "NoSuchKey") {
            return undefined;
        }
        throw e;
    }
}

/**
 * Sets the value of a given key in the local storage.
 *
 * @param {string} key - The key to set the value for.
 * @param {any} value - The value to set.
 * @return {Promise<void>} A promise that resolves when the value has been stored.
 */
export async function set(key, value) {
    if (!key) {
        throw new Error("path is null");
    }
    key = pathNormalize(key);
    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: value,
        ACL: "public-read"
    };
    const response = await client.send(new PutObjectCommand(uploadParams));
    return response;
}

/**
 * Checks if the key exists
 */
export async function exists(key) {
    if (!key) {
        throw new Error("path is null");
    }
    key = pathNormalize(key);
    const params = {
        Bucket: bucketName,
        Key: key
    }
    let exists = false;
    try {
        await client.send(new HeadObjectCommand(params));
        exists = true;
    } catch {
        exists = false;
    }
    return exists;
}

/**  
  * Deletes a key from the storage.
  * @param {string} key - the key to delete
  * @return {Promise<void>} A promise that resolves when the key has been deleted
  */
export async function deleteKey(key) {
    if (!key) {
        throw new Error("path is null");
    }
    key = pathNormalize(key);
    const deleteParams = {
        Bucket: bucketName,
        Key: key
    };
    const response = await client.send(new DeleteObjectCommand(deleteParams));
    return response;
}

/**
 * Retrieves a list of the keys.
 *
 * @return {Promise<type>} A promise that resolves with the list of keys
 */
export async function keys() {
    const listing = [];
    const recursiveListing = async token => {
        const listCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            ContinuationToken: token
        });
        let list = await client.send(listCommand);
        if (list.KeyCount) {
            listing.push(...list.Contents.map((item) => ({ Key: item.Key })));
        }
        if (list.NextContinuationToken) {
            recursiveListing(list.NextContinuationToken);
        }
        return listing;
    };
    return await recursiveListing();
}

/**
 * Removes all keys from the storage.
 * @return {Promise<void>} A promise that resolves when the storage is cleared
 */
export async function reset() {
    let count = 0;
    const recursiveDelete = async token => {
        // get the files
        const listCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            ContinuationToken: token
        });
        let list = await client.send(listCommand);
        if (list.KeyCount) {
            const deleteCommand = new DeleteObjectsCommand({
                Bucket: bucketName,
                Delete: {
                    Objects: list.Contents.map((item) => ({ Key: item.Key })),
                    Quiet: false,
                },
            });
            let deleted = await client.send(deleteCommand);
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
    return await recursiveDelete();
}
