const locks = {};

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
