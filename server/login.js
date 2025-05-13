'use server';

import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    NoSuchKey,
} from '@aws-sdk/client-s3';
import bcrypt from 'bcryptjs';

const s3ClientConfigString = process.env.AWS_S3_CLIENT;
const bucketName = process.env.AWS_S3_BUCKET;

if (!s3ClientConfigString || !bucketName) {
    throw new Error(
        'Missing required environment variables: AWS_S3_CLIENT (JSON string) and AWS_S3_BUCKET are required.'
    );
}

let s3ClientConfig;

try {
    const cleanedString = s3ClientConfigString
        .replace(/,\s*}/g, '}')
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

    s3ClientConfig = JSON.parse(cleanedString);

    if (!s3ClientConfig.region) {
        throw new Error("Parsed AWS_S3_CLIENT JSON must include a 'region' property.");
    }
    if (!s3ClientConfig.credentials || !s3ClientConfig.credentials.accessKeyId || !s3ClientConfig.credentials.secretAccessKey) {
        throw new Error("Parsed AWS_S3_CLIENT JSON must include 'credentials' with 'accessKeyId' and 'secretAccessKey'.");
    }

} catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
    throw new Error(
        `Failed to parse AWS_S3_CLIENT environment variable. Ensure it's valid JSON. Error: ${errorMessage}`
    );
}

const s3Client = new S3Client(s3ClientConfig);

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
    const key = `users/${userId}.json`;

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    try {
        const { Body } = await s3Client.send(command);
        if (!Body) {
            return null;
        }
        const bodyContents = await Body.transformToString('utf-8');

        if (!bodyContents || bodyContents.trim() === '') {
            return {};
        }

        try {
            const parsedData = JSON.parse(bodyContents);
            return parsedData;
        } catch (jsonError) {
            return null;
        }

    } catch (error) {
        if (error instanceof NoSuchKey) {
            return null;
        } else {
            const errorMessage = error instanceof Error ? error.message : 'Unknown S3 error';
            throw new Error(`Failed to fetch user data for ${userId}. Reason: ${errorMessage}`);
        }
    }
}

async function saveUserData(rawUserId, data) {
    const userId = normalizeAndValidateUserId(rawUserId);
    const key = `users/${userId}.json`;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json',
    });

    try {
        await s3Client.send(command);
        return true;
    } catch (error) {
        return false;
    }
}

export async function login(rawUserId, passwordOrHash) {
    const userId = normalizeAndValidateUserId(rawUserId);
    if (!passwordOrHash) {
        throw new Error('Password or hash is required.');
    }

    const userData = await getUserData(userId);

    if (userData === null) {
        throw new Error('Login failed: Invalid user ID.');
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
            return storedHash;
        } else {
            throw new Error('Login failed: Incorrect password or hash.');
        }
    }
    else {
        if (passwordOrHash.startsWith('$2a$') || passwordOrHash.startsWith('$2b$')) {
            throw new Error('Login failed: Cannot login with hash, no password set for this user.');
        }

        try {
            if (passwordOrHash.length < 8) {
                throw new Error('Password must be at least 8 characters long.');
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
                return newPasswordHash;
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
