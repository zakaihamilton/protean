import { pathFileName, pathFolder, pathNormalize } from "src/Core/Util/Path";

function getFolderPath(path) {
    return "folder://" + path;
}

function getFilePath(path) {
    return "file://" + path;
}

/**
 * Checks if the storage is supported.
 *
 * @return {boolean} Returns true if the storage is supported, false otherwise.
*/
export async function isSupported(listStorage) {
    return await listStorage.isSupported();
}

/**
 * Opens the storage list export async function hronously.
 *
 */
export async function open(listStorage) {
    await listStorage.open();
}

/**
 * Closes the connection to the list storage.
 *
 * @param {} 
 * @return {} 
 */
export async function close(listStorage) {
    await listStorage.close();
}

/**
 * Creates a folder.
 *
 * @param {string} path - The path where the folder should be created.
 * @return {Promise} - A promise that resolves when the folder has been created.
 */
export async function createFolder(listStorage, path) {
    if (!path) {
        throw new Error("path is null");
    }
    path = pathNormalize(path);
    const folderPath = getFolderPath(path);
    /* check if the folder already exists */
    const folderItem = await listStorage.get(folderPath);
    if (folderItem) {
        throw new Error("Folder already exists: " + folderPath);
    }
    await listStorage.set(folderPath, { path });
}

/**
 * Deletes a folder along with its contents.
 *
 * @param {string} path - The path of the folder to be deleted.
 * @return {Promise} - Returns a promise that resolves when the folder and its contents have been successfully deleted.
 */
export async function deleteFolder(listStorage, path) {
    if (!path) {
        throw new Error("path is null");
    }
    path = pathNormalize(path);
    const listing = await listFolder(listStorage, path);
    for (const item of listing) {
        try {
            if (item.type === "folder") {
                await deleteFolder(listStorage, item.path);
            }
            else if (item.type === "file") {
                await deleteFile(listStorage, item.path);
            }
        }
        catch (err) {
            throw new Error("Error deleting item: " + item.path + " type:" + item.type + " error: " + err);
        }
    }
    const folderPath = getFolderPath(path);
    await listStorage.deleteKey(folderPath);
}

/**
 * Moves a folder to a different location.
 *
 * @param {type} fromPath - the path of the folder to be moved
 * @param {type} toPath - the path where the folder should be moved to
 * @return {type} description of the return value (if any)
 */
export async function moveFolder(listStorage, fromPath, toPath) {
    if (!fromPath) {
        throw new Error("fromPath is null");
    }
    if (!toPath) {
        throw new Error("toPath is null");
    }
    fromPath = pathNormalize(fromPath);
    toPath = pathNormalize(toPath);
    await copyFolder(listStorage, fromPath, toPath);
    await deleteFolder(listStorage, fromPath);
}

/**
 * Copies a folder and its contents to a different location.
 *
 * @param {any} fromPath - the path of the folder to be copied
 * @param {any} toPath - the destination path where the folder will be copied to
 * @return {Promise} a promise that resolves when the folder and its contents have been successfully copied
 */
export async function copyFolder(listStorage, fromPath, toPath) {
    if (!fromPath) {
        throw new Error("fromPath is null");
    }
    if (!toPath) {
        throw new Error("toPath is null");
    }
    fromPath = pathNormalize(fromPath);
    toPath = pathNormalize(toPath);
    if (await folderExists(listStorage, toPath)) {
        throw new Error("Folder already exists: " + toPath);
    }
    await createFolder(listStorage, toPath);
    const listing = await listFolder(listStorage, fromPath);
    for (const item of listing) {
        try {
            const targetPath = getFolderPath(toPath + item.path);
            if (item.type === "folder") {
                await copyFolder(listStorage, item.path, targetPath);
            }
            else if (item.type === "file") {
                await copyFile(listStorage, item.path, targetPath);
            }
        }
        catch (err) {
            throw new Error("Error deleting item: " + item.path + " type:" + item.type + " error: " + err);
        }
    }
}

/**
 * Lists files in a folder
 *
 * @param {string} path - the path of the folder
 * @return {type} - a description of the return value
 */
export async function listFolder(listStorage, path) {
    if (!path) {
        throw new Error("path is null");
    }
    path = pathNormalize(path);
    const folderPath = getFolderPath(path);
    const folderItem = await listStorage.get(folderPath);
    if (!folderItem) {
        throw new Error("Folder does not exist: " + path);
    }
    const keys = await listStorage.keys();
    const listing = [];
    for (const key of keys) {
        const keyFolder = pathFolder(key);
        const keyFile = pathFileName(key);
        if (keyFolder !== folderPath) {
            continue;
        }
        const keyPath = [path, keyFile].join("/");
        const type = key.startsWith("file://") ? "file" : "folder";
        listing.push({ path: keyPath, type });
    }

    return listing;
}

/**
 * Check if a folder exists
 * @param {string} path - the path of the folder
 */
export async function folderExists(listStorage, path) {
    if (!path) {
        throw new Error("path is null");
    }
    path = pathNormalize(path);
    const folderPath = getFolderPath(path);
    const folderItem = await listStorage.get(folderPath);
    return !!folderItem;
}

/**
 * Reads the content of a file.
 *
 * @param {String} path - The path of the file to be read.
 * @return {Promise} A Promise that resolves to the content of the file.
 */
export async function readFile(listStorage, path) {
    if (!path) {
        throw new Error("path is null");
    }
    path = pathNormalize(path);
    const filePath = getFilePath(path);
    return await listStorage.get(filePath);
}

/**
 * Creates or updates a file.
 *
 * @param {string} path - The path of the file.
 * @param {string} content - The content to be written to the file.
 * @return {Promise} - A promise that resolves when the file is successfully created or updated.
 */
export async function writeFile(listStorage, path, content) {
    if (!path) {
        throw new Error("path is null");
    }
    path = pathNormalize(path);
    const filePath = getFilePath(path);
    return await listStorage.set(filePath, content);
}

/**
 * Deletes a file.
 *
 * @param {string} path - The path of the file to be deleted.
 * @return {Promise} A promise that resolves when the file is successfully deleted.
 */
export async function deleteFile(listStorage, path) {
    if (!path) {
        throw new Error("path is null");
    }
    path = pathNormalize(path);
    const filePath = getFilePath(path);
    const exists = await listStorage.exists(filePath);
    if (!exists) {
        throw new Error("File does not exist: " + path);
    }
    await listStorage.deleteKey(filePath);
}

/**
 * Moves a file to a different location.
 *
 * @param {type} fromPath - the current path of the file
 * @param {type} toPath - the new path where the file should be moved
 * @return {type} description of return value
 */
export async function moveFile(listStorage, fromPath, toPath) {
    if (!fromPath) {
        throw new Error("fromPath is null");
    }
    if (!toPath) {
        throw new Error("toPath is null");
    }
    fromPath = pathNormalize(fromPath);
    toPath = pathNormalize(toPath);
    const content = await readFile(listStorage, fromPath);
    await writeFile(listStorage, toPath, content);
    await deleteFile(listStorage, fromPath);
}

/**
 * Copies a file to a different location.
 *
 * @param {type} fromPath - the path of the file to be copied
 * @param {type} toPath - the path of the destination location
 * @return {type} - a description of the return value
 */
export async function copyFile(listStorage, fromPath, toPath) {
    if (!fromPath) {
        throw new Error("fromPath is null");
    }
    if (!toPath) {
        throw new Error("toPath is null");
    }
    if (await fileExists(listStorage, toPath)) {
        throw new Error("File already exists: " + toPath);
    }
    fromPath = pathNormalize(fromPath);
    toPath = pathNormalize(toPath);
    await writeFile(listStorage, toPath, await readFile(listStorage, fromPath));
}

/**
 * Check if a file exists
 * @param {string} path - the path of the file
 */
export async function fileExists(listStorage, path) {
    if (!path) {
        throw new Error("path is null");
    }
    path = pathNormalize(path);
    const filePath = getFilePath(path);
    const fileItem = await listStorage.get(filePath);
    return !!fileItem;
}

/**
 * Removes all folders and files from the storage.
 * @return {Promise<void>} A promise that resolves when the storage is cleared
 */
export async function reset(listStorage) {
    await listStorage.reset();
}
