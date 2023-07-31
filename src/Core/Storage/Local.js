/**
 * StorageLocal - Component to manage folders and files using IndexedDB.
 */

import { createObjectStore, createRecord, deleteRecord, getRecord, iterateRecords, openDatabase, updateRecord } from "../Util/IndexedDB";
import { getFolderPath, normalizePath } from "../Util/String";

const storeOptions = {
    folder: {
        unique: true
    },
    file: {
        unique: true
    },
    data: {
        autoIncrement: true
    }
};

export class StorageLocal {
    /**
     * @param {string} dbName - The name of the IndexedDB database.
     * @param {string} folderStoreName - The name of the object store to manage folders.
     * @param {string} fileStoreName - The name of the object store to manage files.
     * @param {string} dataStoreName - The name of the object store to manage data.
     */
    constructor(dbName = "FileSystem", folderStoreName = "folders", fileStoreName = "files", dataStoreName = "data") {
        this.dbName = dbName;
        this.storeNames = { folder: folderStoreName, file: fileStoreName, data: dataStoreName };
        this.db = null;
    }

    /**
     * Initializes the StorageLocal by opening the IndexedDB database and creating object stores if needed.
     * @returns {Promise<void>} - A promise that resolves when the initialization is complete.
     */
    async init() {
        try {
            this.db = await openDatabase(this.dbName, 1, async (db) => {
                for (const key in this.storeNames) {
                    const storeName = this.storeNames[key];
                    const exists = db.objectStoreNames.contains(storeName);
                    if (!exists) {
                        await createObjectStore(db, storeName, storeOptions[storeName]);
                    }
                }
            });
        } catch (error) {
            throw new Error("Failed to initialize StorageLocal: " + error.message);
        }
    }

    /**
     * Creates a new folder in the database.
     * @param {string} path - The path of the folder.
     * @returns {Promise<number>} - A promise that resolves with the ID of the newly created folder.
     */
    async createFolder(path) {
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call init() before using the manager.");
        }

        path = normalizePath(path);
        console.log("creating folder", path);

        const transaction = this.db.transaction(this.storeNames.folder, "readwrite");
        const folderStore = transaction.objectStore(this.storeNames.folder);

        // Check if folder already exists
        try {
            const folder = await getRecord(folderStore, path);
            if (folder) {
                return folder.path;
            }
        }
        catch (err) {
            console.error("Failed to check if folder", path, "exists");
            throw err;
        }

        const object = {
            path
        };

        try {
            await createRecord(folderStore, object, path);
            console.log("folder created successfully", path);
            return path;
        }
        catch (err) {
            console.error("error creating folder", path, err);
        }
    }

    /**
       * Deletes a folder from the database along with its contents (subfolders and files).
       * @param {string} path - The path of the folder to delete.
       * @returns {Promise<void>} - A promise that resolves when the folder and its contents are deleted.
       */
    async deleteFolder(path) {
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call init() before using the manager.");
        }

        path = normalizePath(path);
        console.log("deleting folder", path);

        const transaction = this.db.transaction(this.storeNames, "readwrite");
        const folderStore = transaction.objectStore(this.storeNames.folder);
        const fileStore = transaction.objectStore(this.storeNames.file);
        const dataStore = transaction.objectStore(this.storeNames.data);

        const folders = await iterateRecords(folderStore, (folder, id) => {
            const match = folder.path.startsWith(path);
            if (match) {
                return id;
            }
        });

        const files = await iterateRecords(fileStore, (file, id) => {
            const match = file.path.startsWith(path);
            if (match) {
                return id;
            }
        });

        try {
            for (const id of files) {
                const file = await getRecord(fileStore, id);
                if (file.data) {
                    await deleteRecord(dataStore, file.data);
                }
                await deleteRecord(fileStore, id);
            }
            for (const id of folders) {
                await deleteRecord(folderStore, id);
            }
        }
        catch (err) {
            console.error("error deleting folder", path, err);
            throw err;
        }
    }

    /**
     * Reads a file from the database.
     * @param {string} path - The path of the file.
     * @returns {Promise<string>} - A promise that resolves with the content of the file.
     */
    async readFile(path) {
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call init() before using the manager.");
        }

        path = normalizePath(path);

        console.log("reading file", path);

        try {
            const transaction = this.db.transaction(this.storeNames.file, "readonly");
            const filesStore = transaction.objectStore(this.storeNames.file);
            const dateStore = transaction.objectStore(this.storeNames.data);
            const file = await getRecord(filesStore, path);
            const data = await getRecord(dateStore, file.data);
            return data;
        }
        catch (err) {
            console.error("error reading file", path, err);
            throw err;
        }
    }

    /**
     * Creates a new file in the database.
     * @param {string} path - The path of the file.
     * @param {string} content - The content of the file.
     * @returns {Promise} - A promise that resolves
     */
    async writeFile(path, content) {
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call init() before using the manager.");
        }

        path = normalizePath(path);
        const folder = getFolderPath(path);
        console.log("creating file", path, "folder", folder);
        const transaction = this.db.transaction(this.storeNames.file, "readwrite");
        const filesStore = transaction.objectStore(this.storeNames.file);
        const dataStore = transaction.objectStore(this.storeNames.data);

        try {
            const data = await createRecord(dataStore, content);
            let file = await getRecord(filesStore, path);
            const createFile = !file;
            const size = content?.length;
            if (createFile) {
                file = {
                    path,
                    size,
                    data
                };
            }
            else {
                file.size = size;
                if (file.data) {
                    await deleteRecord(dataStore, file.data);
                }
                file.data = data;
            }
            if (createFile) {
                await updateRecord(filesStore, file);
                console.log("file created successfully", fileId);
            }
            else {
                await updateRecord(filesStore, file, path);
                console.log("file updated successfully", fileId);
            }
        }
        catch (err) {
            console.error("error creating file", path, err);
            throw err;
        }
    }

    /**
     * Deletes a file from the database.
     * @param {string} path - The path of the file to delete.
     * @returns {Promise<void>} - A promise that resolves when the file is deleted.
     */
    async deleteFile(path) {
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call init() before using the manager.");
        }
        path = normalizePath(path);
        console.log("deleting file", path);
        const transaction = this.db.transaction([this.storeNames.file, this.storeNames.data], "readwrite");
        const fileStore = transaction.objectStore(this.storeNames.file);
        const dataStore = transaction.objectStore(this.storeNames.data);
        let file = await getRecord(fileStore, path);
        if (!file) {
            throw new Error("File not found", path);
        }

        if (file.data) {
            try {
                await deleteRecord(dataStore, file.data);
            }
            catch (err) {
                console.error("error deleting file", path, err);
            }
        }

        try {
            await deleteRecord(fileStore, path);
            console.log("file deleted successfully", path);
        }
        catch (err) {
            console.error("error deleting file", path, err);
            throw err;
        }
    }

    /**
     * Moves a file to a different folder in the database.
     * @param {path} fromPath - The path of the file to move.
     * @param {path} toPath - The target path of the file to move.
     * @returns {Promise<void>} - A promise that resolves when the file is moved.
     */
    async moveFile(fromPath, toPath) {
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call init() before using the manager.");
        }

        fromPath = normalizePath(fromPath);
        toPath = normalizePath(toPath);
        console.log("moving file", fromPath, "to", toPath);
        const transaction = this.db.transaction(this.storeNames.file, "readwrite");
        const fileStore = transaction.objectStore(this.storeNames.file);

        const file = await getRecord(fileStore, fromPath);

        if (!file) {
            reject(new Error("File not found."));
        } else {
            file.path = toPath;
            await createRecord(fileStore, file, toPath);
            await deleteRecord(fromPath);
            console.log("file moved successfully", fromPath, "to", toPath);
        }
    }

    /**
     * Moves a folder to a different location in the database.
     * @param {string} fromPath - The path of the folder to move.
     * @param {string} toPath - The target path of the folder to move.
     * @returns {Promise<void>} - A promise that resolves when the folder is moved.
     */
    async moveFolder(fromPath, toPath) {
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call init() before using the manager.");
        }

        fromPath = normalizePath(fromPath);
        toPath = normalizePath(toPath);
        console.log("moving folder from", fromPath, "to", toPath);

        const transaction = this.db.transaction([this.storeNames.folder, this.storeNames.file], "readwrite");
        const folderStore = transaction.objectStore(this.storeNames.folder);
        const fileStore = transaction.objectStore(this.storeNames.file);

        try {
            const fromFolder = await getRecord(folderStore, fromPath);
            if (!fromFolder) {
                throw new Error("Folder not found: " + fromPath);
            }

            const toFolder = await getRecord(folderStore, toPath);
            if (!toFolder) {
                throw new Error("Destination folder not found: " + toPath);
            }

            const foldersToMove = await iterateRecords(folderStore, (folder) => {
                if (folder.path.startsWith(fromPath)) {
                    folder.path = folder.path.replace(fromPath, toPath);
                    return folder;
                }
            });

            const filesToMove = await iterateRecords(fileStore, (file) => {
                if (file.path.startsWith(fromPath)) {
                    file.path = file.path.replace(fromPath, toPath);
                    return file;
                }
            });

            for (const folder of foldersToMove) {
                await updateRecord(folderStore, folder);
            }

            for (const file of filesToMove) {
                await updateRecord(fileStore, file);
            }

            console.log("folder moved successfully from", fromPath, "to", toPath);
        } catch (err) {
            console.error("error moving folder", fromPath, "to", toPath, err);
            throw err;
        }
    }

    /**
     * Copies a file to a different location in the database.
     * @param {string} fromPath - The path of the file to copy.
     * @param {string} toPath - The target path where the file will be copied.
     * @returns {Promise<void>} - A promise that resolves when the file is copied.
     */
    async copyFile(fromPath, toPath) {
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call init() before using the manager.");
        }

        fromPath = normalizePath(fromPath);
        toPath = normalizePath(toPath);
        console.log("copying file", fromPath, "to", toPath);
        const transaction = this.db.transaction(this.storeNames.file, "readwrite");
        const fileStore = transaction.objectStore(this.storeNames.file);
        const dataStore = transaction.objectStore(this.storeNames.data);

        let data = null, size = null;
        try {
            const file = await getRecord(fileStore, fromPath);
            size = file.size;
            data = await getRecord(dataStore, file.data);
        }
        catch (err) {
            console.error("error copying file", fromPath, err);
            throw err;
        }

        const file = {
            path: toPath,
            size,
            data
        };

        try {
            await createRecord(fileStore, file, toPath);
            await deleteRecord(fromPath);
            console.log("file moved successfully", fromPath, "to", toPath);
        }
        catch (err) {
            console.error("error copying file", fromPath, err);
            throw err;
        }
    }

    /**
     * Copies a folder and its contents to a different location in the database.
     * @param {string} fromPath - The path of the folder to copy.
     * @param {string} toPath - The target path where the folder will be copied.
     * @returns {Promise<void>} - A promise that resolves when the folder and its contents are copied.
     */
    async copyFolder(fromPath, toPath) {
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call init() before using the manager.");
        }

        fromPath = normalizePath(fromPath);
        toPath = normalizePath(toPath);
        console.log("copying folder from", fromPath, "to", toPath);

        const transaction = this.db.transaction([this.storeNames.folder, this.storeNames.file], "readwrite");
        const folderStore = transaction.objectStore(this.storeNames.folder);
        const fileStore = transaction.objectStore(this.storeNames.file);

        const folderToCopy = await getRecord(folderStore, fromPath);
        if (!folderToCopy) {
            throw new Error("Folder not found: " + fromPath);
        }

        const targetFolderExists = await getRecord(folderStore, toPath);
        if (targetFolderExists) {
            throw new Error("Destination folder already exists: " + toPath);
        }

        const foldersToCopy = await iterateRecords(folderStore, (folder) => {
            if (folder.path.startsWith(fromPath)) {
                folder.path = folder.path.replace(fromPath, toPath);
                return folder;
            }
        });

        const filesToCopy = await iterateRecords(fileStore, (file) => {
            if (file.path.startsWith(fromPath)) {
                file.path = file.path.replace(fromPath, toPath);
                return file;
            }
        });

        try {
            await createRecord(folderStore, { path: toPath }, toPath);

            for (const folder of foldersToCopy) {
                await createRecord(folderStore, folder, folder.path);
            }

            for (const file of filesToCopy) {
                const fromData = await getRecord(fileStore, file.data);
                const toData = await createRecord(dataStore, fromData);
                await createRecord(fileStore, { ...file, data: toData }, file.path);
            }

            console.log("folder copied successfully from", fromPath, "to", toPath);
        } catch (err) {
            console.error("error copying folder", fromPath, "to", toPath, err);
            throw err;
        }
    }

    /**
     * List files in a folder from IndexedDB.
     * @param {number} folderId - The ID of the folder whose files are to be listed.
     * @returns {Promise<Array>} - A promise that resolves with an array of files in the folder.
     */
    async listFilesInFolder(path) {
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call init() before using the manager.");
        }

        path = normalizePath(path);
        console.log("listing files in folder", path);

        const transaction = this.db.transaction(this.storeNames.file, "readwrite");
        const fileStore = transaction.objectStore(this.storeNames.file);
        const folderStore = transaction.objectStore(this.storeNames.folder);
        const folder = getFolderPath(path);

        const exists = await getRecord(folderStore, folder);
        if (!exists) {
            throw new Error("Folder not found", path);
        }

        let files = null;
        try {
            files = await iterateRecords(fileStore, (file) => {
                const match = file.path === folder;
                if (match) {
                    return folder.path;
                }
            });
        }
        catch (err) {
            console.error("error listing files in folder", path, err);
            throw err;
        }

        return folders;
    }
}

export default StorageLocal;
