/**
 * @file Mutex.js
 * @description
 * This module provides functions for managing mutex locks using Promises. It allows you to acquire and release
 * mutex locks associated with unique IDs and check if a mutex is currently locked.
 */

/**
 * A dictionary to store mutex locks.
 * @type {Object}
 */
const locks = {};

/**
 * Get a mutex lock associated with the specified ID.
 * If the lock does not exist, it is created.
 * @param {Object} options - The options object.
 * @param {string} options.id - The unique identifier for the mutex lock.
 * @returns {Object} - The mutex lock object.
 */
export function getMutex({ id }) {
    try {
        var lock = locks[id];
        if (!lock) {
            lock = locks[id] = {};
            lock._locking = Promise.resolve();
            lock._locks = 0;
            lock._disabled = false;
            lockMutex({ id }).then(unlock => {
                if (lock._disabled) {
                    lock._disabled = unlock;
                } else {
                    unlock();
                }
            }).catch(err => {
                // Handle error when acquiring lock
                console.error('Error acquiring lock:', err);
            });
        }
        return lock;
    } catch (err) {
        // Handle unexpected errors here
        console.error('Unexpected error in getMutex:', err);
    }
}

/**
 * Check if a mutex lock associated with the specified ID is currently locked.
 * @param {Object} options - The options object.
 * @param {string} options.id - The unique identifier for the mutex lock.
 * @returns {boolean} - True if the lock is currently held, otherwise false.
 */
export function isMutexLocked({ id }) {
    try {
        var lock = getMutex({ id });
        if (lock) {
            return lock._locks > 0;
        }
    } catch (err) {
        // Handle unexpected errors here
        console.error('Unexpected error in isMutexLocked:', err);
    }
}

/**
 * Acquire a lock on the mutex associated with the specified ID.
 * @param {Object} options - The options object.
 * @param {string} options.id - The unique identifier for the mutex lock.
 * @returns {Promise} - A promise that resolves when the lock is released.
 */
export function lockMutex({ id }) {
    try {
        var lock = getMutex({ id });
        if (lock) {
            lock._locks += 1;
            let unlockNext;
            let willLock = new Promise(resolve => unlockNext = () => {
                lock._locks -= 1;
                resolve();
            });
            let willUnlock = lock._locking.then(() => unlockNext);
            lock._locking = lock._locking.then(() => willLock);
            return willUnlock;
        }
    } catch (err) {
        // Handle unexpected errors here
        console.error('Unexpected error in lockMutex:', err);
    }
}
