// Function to create or open an IndexedDB database.
export async function openDatabase(dbName, version, upgradeCallback) {
    return new Promise((resolve, reject) => {
        console.log("opening database", dbName, "version", version);
        const request = indexedDB.open(dbName, version);

        request.onupgradeneeded = async (event) => {
            console.log("upgrade needed on database", dbName);
            const db = event.target.result;
            await upgradeCallback(db);
            console.log("upgrade completed for database", dbName);
            resolve(db);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            console.log("database opened successfully", dbName);
            resolve(db);
        };

        request.onerror = (event) => {
            console.error("error opening database", dbName, event.target.error);
            reject(event.target.error);
        };
    });
}

//Function to delete indexedb database.
export async function deleteDatabase(dbName) {
    return new Promise((resolve, reject) => {
        console.log("deleting database", dbName);
        const request = indexedDB.deleteDatabase(dbName);
        request.onsuccess = (event) => {
            console.log("database deleted successfully", dbName);
            resolve();
        }
        request.onerror = (event) => {
            console.error("error deleting database", dbName, event.target.error);
            reject(event.target.error);
        }
    });
}

// Function to create an object store within the database.
export async function createObjectStore(db, objectStoreName, options) {
    return new Promise((resolve, reject) => {
        console.log("creating object store", objectStoreName);
        const objectStore = db.createObjectStore(objectStoreName, options);

        objectStore.transaction.oncomplete = () => {
            console.log("object store created successfully", objectStoreName);
            resolve(objectStore);
        };

        objectStore.transaction.onerror = (event) => {
            console.error("error creating object store", objectStoreName, event.target.error);
            reject(event.target.error);
        };
    });
}

//Function to create a record in an object store.
export async function createRecord(store, record, key) {
    return new Promise((resolve, reject) => {
        const request = store.add(record, key);
        request.onsuccess = (event) => {
            const recordId = event.target.result;
            console.log("record created successfully", recordId);
            resolve(recordId);
        };

        request.onerror = (event) => {
            console.error("error creating record", event.target.error);
            reject(event.target.error);
        };
    });
}

//Function to update a record in an object store.
export async function updateRecord(store, record) {
    return new Promise((resolve, reject) => {
        const request = store.put(record);
        request.onsuccess = (event) => {
            const recordId = event.target.result;
            console.log("record created successfully", recordId);
            resolve(recordId);
        };

        request.onerror = (event) => {
            console.error("error updating record", event.target.error);
            reject(event.target.error);
        };
    });
}

//Function to get record in an object store.
export async function getRecord(store, recordId) {
    return new Promise((resolve, reject) => {
        const request = store.get(recordId);
        request.onsuccess = (event) => {
            const record = event.target.result;
            console.log("record retrieved successfully", recordId, "record", record);
            resolve(record);
        };
        request.onerror = (event) => {
            console.error("error getting record", recordId, event.target.error);
            reject(event.target.error);
        };
    });
}

//Function to delete record in an object store.
export async function deleteRecord(store, recordId) {
    return new Promise((resolve, reject) => {
        const request = store.delete(recordId);
        request.onsuccess = (event) => {
            console.log("record deleted successfully", recordId);
            resolve();
        };
        request.onerror = (event) => {
            console.error("error deleting record", recordId, event.target.error);
            reject(event.target.error);
        };
    });
}

//Function to iterate over records in an object store
export async function iterateRecords(store, callback) {
    return new Promise((resolve, reject) => {
        let listing = [];
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = async (event) => {
            const cursor = event.target.result;
            if (cursor) {
                if (callback) {
                    const result = callback(cursor.value, cursor.key);
                    if (result) {
                        listing.push(result);
                    }
                }
                else {
                    listing.push(cursor.key);
                }
                cursor.continue();
            }
            else {
                resolve(listing);
            }
        };

        cursorRequest.onerror = (event) => {
            console.error("error iterating over records", event.target.error);
            reject(event.target.error);
        };

    });
}