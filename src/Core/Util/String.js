/**
 * Get the folder path from a file path.
 * @param {string} filePath - The file path from which to extract the folder path.
 * @returns {string|null} - The folder path or null if there is no folder path.
 */
export function getFolderPath(filePath) {
    if (!filePath) {
        return null;
    }
    const lastSlashIndex = filePath.lastIndexOf("/");
    if (lastSlashIndex === -1) {
        // No slash found, which means it's a file in the root directory.
        return null;
    }

    const folderPath = filePath.substring(0, lastSlashIndex + 1);
    return folderPath;
}

export function normalizePath(filePath) {
    return filePath.replace(/\\/g, "/").replace(/\/$/, "");
}
