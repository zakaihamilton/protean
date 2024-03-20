'use server'

import Redis from "ioredis"

let client = null
if (process.env.REDIS_URL) {
    client = new Redis(process.env.REDIS_URL);
}
else {
    throw new Error("REDIS_URL environment variable is not set");
}

export async function write() {
    await client.set('test', new Date());
}

export async function read() {
    return await client.get('test');
}