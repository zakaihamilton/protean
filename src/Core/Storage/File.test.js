import "fake-indexeddb/auto";

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

import { testCompare, testInstance, testMethod, testPermutations } from "../Util/Test";

import * as StorageFileList from "./File/List";
import * as StorageFileS3 from "./File/S3";

import * as StorageListLocal from "./List/Local";

const implementations = {
    StorageFileList,
    StorageFileS3
};

const params = {
    StorageFileList: [StorageListLocal]
};

const permutations = testPermutations(implementations, params);

const timeout = undefined;

describe.each(permutations)('File - %s vs %s', (_source, _target, components, params) => {
    let instances;

    beforeEach(async () => {
        instances = testInstance(components, params);
        testCompare(await testMethod(instances, 'isSupported'));
        await testMethod(instances, 'open');
    }, timeout);

    afterEach(async () => {
        await testMethod(instances, 'reset');
        await testMethod(instances, 'close');
        jest.clearAllMocks();
    }, timeout);

    it('folder lifecycle', async () => {
        await testMethod(instances, 'createFolder', '/test');
        testCompare(await testMethod(instances, 'folderExists', '/test'));
        await testMethod(instances, 'deleteFolder', '/test');
        testCompare(await testMethod(instances, 'folderExists', '/test'));
    });

    it('file lifecycle', async () => {
        await testMethod(instances, 'writeFile', '/test', 'test');
        testCompare(await testMethod(instances, 'fileExists', '/test'));
        testCompare(await testMethod(instances, 'readFile', '/test'));
        await testMethod(instances, 'deleteFile', '/test');
        testCompare(await testMethod(instances, 'fileExists', '/test'));
    });

    it('list', async () => {
        await testMethod(instances, 'createFolder', '/folder');
        await testMethod(instances, 'writeFile', '/folder/test', 'test');
        await testMethod(instances, 'writeFile', '/folder/test2', 'test2');
        testCompare(await testMethod(instances, 'listFolder', "/folder"));
    })
});
