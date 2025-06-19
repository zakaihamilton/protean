'use server';

import bcrypt from 'bcryptjs';
import StorageS3 from "src/Storage/S3";

let storage = null;

async function getStorageInstance() {
    if (storage) {
        return storage;
    }
    const storageEnv = process.env["STORAGE_USERS"];
    if (!storageEnv) {
        throw new Error("Storage users not found");
    }
    const instance = new StorageS3();
    await instance.connect(JSON.parse(storageEnv));
    return instance;
}

function normalizeAndValidateUserId(rawUserId) {
    if (!rawUserId || typeof rawUserId !== 'string') {
        throw new Error('User ID must be a non-empty string.');
    }
    const normalizedId = rawUserId.toLowerCase();
    if (!/^[a-z0-9]+$/.test(normalizedId)) {
        throw new Error('User ID must only contain letters (a-z) and numbers (0-9).');
    }
    return normalizedId;
}

async function getUserData(rawUserId) {
    const userId = normalizeAndValidateUserId(rawUserId);
    const key = `${userId}.json`;

    const instance = await getStorageInstance();
    return await instance.get(key);
}

async function saveUserData(rawUserId, data) {
    const userId = normalizeAndValidateUserId(rawUserId);
    const key = `users/${userId}.json`;

    const instance = await getStorageInstance();
    return await instance.set(key, data);
}

export async function login(rawUserId, passwordOrHash) {
    const userId = normalizeAndValidateUserId(rawUserId);
    if (!passwordOrHash) {
        throw new Error('Password or hash is required.');
    }

    const userData = await getUserData(userId);

    if (userData === null) {
        return {
            error: 'USER_NOT_FOUND'
        };
    }

    const storedHash = userData.passwordHash;

    if (storedHash) {
        let passwordsMatch = false;
        if (passwordOrHash.startsWith('$2a$') || passwordOrHash.startsWith('$2b$')) {
            passwordsMatch = passwordOrHash === storedHash;
        } else {
            try {
                passwordsMatch = await bcrypt.compare(passwordOrHash, storedHash);
            } catch (compareError) {
                throw new Error('Login failed due to a server error during password check.');
            }
        }

        if (passwordsMatch) {
            return {
                hash: storedHash
            };
        } else {
            return {
                error: 'INCORRECT_PASSWORD'
            };
        }
    }
    else {
        if (passwordOrHash.startsWith('$2a$') || passwordOrHash.startsWith('$2b$')) {
            throw new Error('Login failed: Cannot login with hash, no password set for this user.');
        }

        try {
            if (passwordOrHash.length < 8) {
                return {
                    error: 'PASSWORD_TOO_SHORT'
                };
            }
            const saltRounds = 10;
            const newPasswordHash = await bcrypt.hash(passwordOrHash, saltRounds);

            const dataToSave = typeof userData === 'object' ? userData : {};
            dataToSave.passwordHash = newPasswordHash;
            if (!dataToSave.info) {
                dataToSave.info = {};
            }

            const saved = await saveUserData(userId, dataToSave);

            if (saved) {
                return {
                    hash: newPasswordHash
                };
            } else {
                throw new Error('Failed to save initial password.');
            }
        } catch (registrationError) {
            const message = registrationError instanceof Error ? registrationError.message : 'Server error during initial password registration.';
            throw new Error(`Password registration failed: ${message}`);
        }
    }
}

export async function changePassword(rawUserId, newPassword) {
    const userId = normalizeAndValidateUserId(rawUserId);
    if (!newPassword) {
        return { success: false, message: 'New password is required.' };
    }
    if (newPassword.length < 8) {
        return { success: false, message: 'Password must be at least 8 characters long.' };
    }

    let userData = await getUserData(userId);

    if (userData === null) {
        userData = { info: {} };
    }
    if (typeof userData !== 'object') {
        userData = {};
    }
    if (!userData.info) {
        userData.info = {};
    }

    try {
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        userData.passwordHash = newPasswordHash;

        const saved = await saveUserData(userId, userData);

        if (saved) {
            return { success: true, message: 'Password changed successfully.' };
        } else {
            return { success: false, message: 'Failed to save updated user data.' };
        }
    } catch (hashError) {
        return { success: false, message: 'Server error during password hashing.' };
    }
}

export async function setInfo(rawUserId, info) {
    const userId = normalizeAndValidateUserId(rawUserId);
    if (typeof info !== 'object' || info === null || Array.isArray(info)) {
        return { success: false, message: 'Info must be a valid JSON object (not an array or null).' };
    }

    let userData = await getUserData(userId);

    if (userData === null) {
        return { success: false, message: 'User not found or file invalid. Cannot set info.' };
    }
    if (typeof userData !== 'object') {
        userData = {};
    }

    if (!userData.info) {
        userData.info = {};
    }

    userData.info = info;

    const saved = await saveUserData(userId, userData);

    if (saved) {
        return { success: true, message: 'User information updated successfully.' };
    } else {
        return { success: false, message: 'Failed to save updated user information.' };
    }
}

export async function getInfo(rawUserId) {
    const userId = normalizeAndValidateUserId(rawUserId);

    try {
        const userData = await getUserData(userId);

        if (userData && typeof userData === 'object' && userData.info) {
            return userData.info;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
