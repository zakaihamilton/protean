export default class FileStorage {
    constructor() {

    }

    /** Check if the storage is supported */
    static isSupported() {

    }

    /**
     * Opens the storage list asynchronously.
     *
     */
    async open() {

    }

    /**
     * Closes the connection to the list storage.
     *
     * @param {} 
     * @return {} 
     */
    async close() {

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

    }

    /**
     * Moves a folder to a different location.
     *
     * @param {type} fromPath - the path of the folder to be moved
     * @param {type} toPath - the path where the folder should be moved to
     * @return {type} description of the return value (if any)
     */
    async moveFolder(fromPath, toPath) {

    }

    /**
     * Copies a folder and its contents to a different location.
     *
     * @param {any} fromPath - the path of the folder to be copied
     * @param {any} toPath - the destination path where the folder will be copied to
     * @return {Promise} a promise that resolves when the folder and its contents have been successfully copied
     */
    async copyFolder(fromPath, toPath) {

    }

    /**
     * Lists files in a folder
     *
     * @param {string} path - the path of the folder
     * @return {type} - a description of the return value
     */
    async listFolder(path) {

    }

    /**
     * Check if a folder exists
     * @param {string} path - the path of the folder
     */
    async folderExists(path) {

    }

    /**
     * Reads the content of a file.
     *
     * @param {String} path - The path of the file to be read.
     * @return {Promise} A Promise that resolves to the content of the file.
     */
    async readFile(path) {

    }

    /**
     * Creates or updates a file.
     *
     * @param {string} path - The path of the file.
     * @param {string} content - The content to be written to the file.
     * @return {Promise} - A promise that resolves when the file is successfully created or updated.
     */
    async writeFile(path, content) {

    }

    /**
     * Deletes a file.
     *
     * @param {string} path - The path of the file to be deleted.
     * @return {Promise} A promise that resolves when the file is successfully deleted.
     */
    async deleteFile(path) {

    }

    /**
     * Moves a file to a different location.
     *
     * @param {type} fromPath - the current path of the file
     * @param {type} toPath - the new path where the file should be moved
     * @return {type} description of return value
     */
    async moveFile(fromPath, toPath) {

    }

    /**
     * Copies a file to a different location.
     *
     * @param {type} fromPath - the path of the file to be copied
     * @param {type} toPath - the path of the destination location
     * @return {type} - a description of the return value
     */
    async copyFile(fromPath, toPath) {

    }

    /**
     * Check if a file exists
     * @param {string} path - the path of the file
     */
    async fileExists(path) {

    }

    /**
     * Removes all folders and files from the storage.
     * @return {Promise<void>} A promise that resolves when the storage is cleared
     */
    async reset() {

    }
}
