import { normalizePath } from "../Util/String";

export default class FileSystemStorage {
    constructor(listStorage) {
        if (!listStorage) {
            throw new Error("No storage provided");
        }
        if (!listStorage.constructor.isSupported()) {
            throw new Error(`Storage ${listStorage.constructor.name} is not supported`);
        }
        this.listStorage = listStorage;
    }

    #getFolderPath(path) {
        return "folder://" + path;
    }

    #getFilePath(path) {
        return "file://" + path;
    }

    /**
     * Opens the storage list asynchronously.
     *
     */
    async open() {
        await this.listStorage.open();
    }

    /**
     * Closes the connection to the list storage.
     *
     * @param {} 
     * @return {} 
     */
    async close() {
        await this.listStorage.close();
    }

    /**
     * Creates a folder.
     *
     * @param {string} path - The path where the folder should be created.
     * @return {Promise} - A promise that resolves when the folder has been created.
     */
    async createFolder(path) {
        if (!path) {
            throw new Error("path is null");
        }
        path = normalizePath(path);
        const folderPath = this.#getFolderPath(path);
        /* check if the folder already exists */
        const folderItem = await this.listStorage.get(folderPath);
        if (folderItem) {
            throw new Error("Folder already exists: " + folderPath);
        }
        await this.listStorage.set(folderPath, { path });
    }

    /**
     * Deletes a folder along with its contents.
     *
     * @param {string} path - The path of the folder to be deleted.
     * @return {Promise} - Returns a promise that resolves when the folder and its contents have been successfully deleted.
     */
    async deleteFolder(path) {
        if (!path) {
            throw new Error("path is null");
        }
        path = normalizePath(path);
        const listing = await this.listFolder(path);
        for (const item of listing) {
            try {
                if (item.type === "folder") {
                    await this.deleteFolder(item.path);
                }
                else if (item.type === "file") {
                    await this.deleteFile(item.path);
                }
            }
            catch (err) {
                throw new Error("Error deleting item: " + item.path + " type:" + item.type + " error: " + err);
            }
        }
        const folderPath = this.#getFolderPath(path);
        await this.listStorage.delete(folderPath);
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
        path = normalizePath(path);
        const filePath = this.#getFilePath(path);
        return await this.listStorage.get(filePath);
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
        path = normalizePath(path);
        const filePath = this.#getFilePath(path);
        return await this.listStorage.set(filePath, content);
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
        path = normalizePath(path);
        const filePath = this.#getFilePath(path);
        const exists = await this.listStorage.exists(filePath);
        if (!exists) {
            throw new Error("File does not exist: " + path);
        }
        await this.listStorage.delete(filePath);
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
        fromPath = normalizePath(fromPath);
        toPath = normalizePath(toPath);
        const content = await this.readFile(fromPath);
        await this.writeFile(toPath, content);
        await this.deleteFile(fromPath);
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
        fromPath = normalizePath(fromPath);
        toPath = normalizePath(toPath);
        await this.copyFolder(fromPath, toPath);
        await this.deleteFolder(fromPath);
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
        fromPath = normalizePath(fromPath);
        toPath = normalizePath(toPath);
        await this.writeFile(toPath, await this.readFile(fromPath));
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
        fromPath = normalizePath(fromPath);
        toPath = normalizePath(toPath);
        if (await this.folderExists(toPath)) {
            throw new Error("Folder already exists: " + toPath);
        }
        await this.createFolder(toPath);
        const listing = await this.listFolder(fromPath);
        for (const item of listing) {
            try {
                const targetPath = this.#getFolderPath(toPath + item.path);
                if (item.type === "folder") {
                    await this.copyFolder(item.path, targetPath);
                }
                else if (item.type === "file") {
                    await this.copyFile(item.path, targetPath);
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
    async listFolder(path) {
        if (!path) {
            throw new Error("path is null");
        }
        path = normalizePath(path);
        const folderPath = this.#getFolderPath(path);
        const folderItem = await this.listStorage.get(folderPath);
        if (!folderItem) {
            throw new Error("Folder does not exist: " + path);
        }
        const keys = await this.listStorage.keys();
        const listing = [];
        for (const key of keys) {
            if (!key.startsWith("file://")) {
                continue;
            }
            const item = await this.listStorage.get(key);
            if (!item) {
                continue;
            }
            if (item.path.startsWith(folderPath)) {
                listing.push(item);
            }
        }

        return listing;
    }

    /**
     * Check if a folder exists
     * @param {string} path - the path of the folder
     */
    async folderExists(path) {
        if (!path) {
            throw new Error("path is null");
        }
        path = normalizePath(path);
        const folderPath = this.#getFolderPath(path);
        const folderItem = await this.listStorage.get(folderPath);
        return !!folderItem;
    }

    /**
     * Check if a file exists
     * @param {string} path - the path of the file
     */
    async fileExists(path) {
        if (!path) {
            throw new Error("path is null");
        }
        path = normalizePath(path);
        const filePath = this.#getFilePath(path);
        const fileItem = await this.listStorage.get(filePath);
        return !!fileItem;
    }
}
