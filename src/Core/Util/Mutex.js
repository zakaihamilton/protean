const locks = {};

export function getMutex({ id }) {
  try {
    let lock = locks[id];
    if (!lock) {
      lock = locks[id] = {};
      lock._locking = Promise.resolve();
      lock._locks = 0;
      lock._disabled = false;
      lockMutex({ id })
        .then((unlock) => {
          if (lock._disabled) {
            lock._disabled = unlock;
          } else {
            unlock();
          }
        })
        .catch((err) => {
          console.error('Error acquiring lock:', err);
        });
    }
    return lock;
  } catch (err) {
    console.error('Unexpected error in getMutex:', err);
  }
}

export function isMutexLocked({ id }) {
  try {
    const lock = getMutex({ id });
    if (lock) {
      return lock._locks > 0;
    }
  } catch (err) {
    console.error('Unexpected error in isMutexLocked:', err);
  }
}

export function lockMutex({ id }) {
  try {
    const lock = getMutex({ id });
    if (lock) {
      lock._locks += 1;
      let unlockNext;
      const willLock = new Promise(
        (resolve) =>
          (unlockNext = () => {
            lock._locks -= 1;
            resolve();
          }),
      );
      const willUnlock = lock._locking.then(() => unlockNext);
      lock._locking = lock._locking.then(() => willLock);
      return willUnlock;
    }
  } catch (err) {
    console.error('Unexpected error in lockMutex:', err);
  }
}
