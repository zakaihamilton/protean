/**
 * Generates the parent folder path from the provided path.
 *
 * @param {string} path - The path to extract the folder path from.
 * @return {string} The parent folder path or null if no parent folder exists.
*/
export function pathFolder(path) {
    if (!path) {
        return null;
    }
    const lastSlashIndex = path.lastIndexOf("/");
    if (lastSlashIndex === -1) {
        // No slash found, which means it's a file in the root directory.
        return null;
    }

    path = path.substring(0, lastSlashIndex);
    return path;
}

/**
 * Generates the file name from a given path.
 *
 * @param {string} path - The path from which to extract the file name.
 * @return {string} The extracted file name.
 */
export function pathFileName(path) {
    if (!path) {
        return null;
    }
    const lastSlashIndex = path.lastIndexOf("/");
    if (lastSlashIndex === -1) {
        return path;
    }
    return path.substring(lastSlashIndex + 1);
}

/**
 * Replaces backslashes with forward slashes in the file path and removes trailing slashes.
 *
 * @param {string} filePath - The file path to normalize.
 * @return {string} The normalized file path.
 */
export function pathNormalize(filePath) {
    return filePath.replace(/\\/g, "/").replace(/\/$/, "");
}
