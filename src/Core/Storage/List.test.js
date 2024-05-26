import "fake-indexeddb/auto";

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

import { testCompare, testInstance, testMethod, testPermutations } from "../Util/Test";

import * as StorageListDb from "./List/Db";
import * as StorageListLocal from "./List/Local";
import * as StorageListMemory from "./List/Memory";
import * as StorageListRedis from "./List/Redis";
import * as StorageListS3 from "./List/S3";
import * as StorageListMongo from "./List/Mongo";

const implementations = {
    StorageListRedis,
    StorageListDb,
    StorageListS3,
    StorageListLocal,
    StorageListMongo,
    StorageListMemory
};

const permutations = testPermutations(implementations);

const timeout = undefined;

describe.each(permutations)('List - %s vs %s', (_source, _target, components) => {
    let instances;

    beforeEach(async () => {
        instances = testInstance(components);
        await testMethod(instances, 'isSupported');
        await testMethod(instances, 'open');
    }, timeout);

    afterEach(async () => {
        await testMethod(instances, 'reset');
        await testMethod(instances, 'close');
        jest.clearAllMocks();
    }, timeout);

    it('set and get', async () => {
        await testMethod(instances, 'set', 'key', 'value');
        testCompare(await testMethod(instances, 'get', 'key'));
        await testMethod(instances, 'exists', 'key');
        await testMethod(instances, 'deleteKey', 'key');
        testCompare(await testMethod(instances, 'get', 'key'));
    }, timeout);

    it('list', async () => {
        await testMethod(instances, 'set', 'key1', 'value1');
        await testMethod(instances, 'set', 'key2', 'value2');
        testCompare(await testMethod(instances, 'keys'));
    }, timeout);
});
