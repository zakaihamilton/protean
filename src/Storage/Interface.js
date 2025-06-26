class StorageInterface {
    async connect() {
        throw new Error("Method 'connect()' must be implemented.");
    }
    async disconnect() {
        throw new Error("Method 'disconnect()' must be implemented.");
    }
    isSupported() {
        throw new Error("Method 'isSupported()' must be implemented.");
    }
    isConnected() {
        throw new Error("Method 'isConnected()' must be implemented.");
    }
    async keys() {
        throw new Error("Method 'keys()' must be implemented.");
    }
    async get() {
        throw new Error("Method 'get()' must be implemented.");
    }
    async set() {
        throw new Error("Method 'set()' must be implemented.");
    }
}

export default StorageInterface;
