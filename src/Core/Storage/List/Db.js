import ListStorage from "../List";

export default class ListStorageDb extends ListStorage {
    constructor() {
        super();
        this.dbName = "db";
        this.objectStoreName = "list";
    }

    /** Check if the storage is supported */
    static isSupported() {
        try {
            if (indexedDB.open) {
                return true;
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Opens the storage.
     *
     * @return {Promise<void>} A promise that resolves when the storage is opened.
     */
    async open() {
        if (this.db) {
            throw new Error("Storage already opened");
        }
        const request = indexedDB.open(this.dbName, 1);

        return new Promise((resolve, reject) => {
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const objectStoreNames = db.objectStoreNames;
                if (!objectStoreNames.contains(this.objectStoreName)) {
                    db.createObjectStore(this.objectStoreName, { unique: true });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };

            request.onblocked = () => {
                reject(new Error("Database open blocked, another connection is open with a higher version."));
            };
        });
    }


    /**
     * Closes the storage.
     *
     * @return {Promise<void>} A promise that resolves when the storage is closed.
     */
    async close() {
        if (this.db) {
            await this.db.close();
            this.db = null;
        }
    }

    async get(key) {
        if (!key) {
            throw new Error("key cannot be null");
        }
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call open() before using the storage.");
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.objectStoreName, "readonly");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.get(key);

            transaction.onerror = (event) => {
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    /**
     * Sets the value of a given key.
     *
     * @param {string} key - the key to set the value for
     * @param {type} value - the value to set
     * @return {Promise<void>} A promise that resolves when the value has been stored
     */
    async set(key, value) {
        if (!key) {
            throw new Error("key cannot be null");
        }
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call open() before using the storage.");
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.objectStoreName, "readwrite");

            transaction.onerror = (event) => {
                reject(event.target.error);
            };

            const store = transaction.objectStore(this.objectStoreName);
            const request = store.put(value, key);

            request.onsuccess = (event) => {
                resolve();
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    /**
     * Checks if the key exists
     */
    async exists(key) {
        if (!key) {
            throw new Error("key cannot be null");
        }
        const result = (await this.keys()).includes(key);
        return result;
    }

    /**  
      * Deletes a key from the storage.
      * @param {string} key - the key to delete
      * @return {Promise<void>} A promise that resolves when the key has been deleted
      */
    async delete(key) {
        if (!key) {
            throw new Error("key cannot be null");
        }
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call open() before using the storage.");
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.objectStoreName, "readwrite");

            transaction.onerror = (event) => {
                reject(event.target.error);
            }

            const store = transaction.objectStore(this.objectStoreName);
            const request = store.delete(key);

            request.onsuccess = (event) => {
                resolve();
            }

            request.onerror = (event) => {
                reject(event.target.error);
            }
        })
    }

    /**
     * Retrieves a list of the keys.
     *
     * @return {Promise<type>} A promise that resolves with the list of keys
     */
    async keys() {
        if (!this.db) {
            throw new Error("StorageLocal not initialized. Call open() before using the storage.");
        }
        return new Promise((resolve, reject) => {
            let listing = [];
            const transaction = this.db.transaction(this.objectStoreName, "readonly");
            const store = transaction.objectStore(this.objectStoreName);
            const cursorRequest = store.openCursor();

            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    listing.push(cursor.key);
                    cursor.continue();
                } else {
                    resolve(listing);
                }
            };

            cursorRequest.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    /**
     * Removes all keys from the storage.
     * @return {Promise<void>} A promise that resolves when the storage is cleared
     */
    async reset() {
        const wasOpen = this.db;
        if (wasOpen) {
            await this.close();
        }
        const request = indexedDB.deleteDatabase(this.dbName);

        await new Promise((resolve, reject) => {
            request.onsuccess = resolve;
            request.onerror = (event) => reject(event.target.error);
            request.onblocked = () => reject(new Error("Database deletion blocked, another connection is open."));
        });
        if (wasOpen) {
            await this.open();
        }
    }
}
