import "fake-indexeddb/auto";

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

import { testCompare, testInstance, testMethod, testPermutations, testResults } from "../Util/Test";

import FileStorageList from "./FileSystem/List";
import FileStorageS3 from "./FileSystem/S3";

import ListStorageLocal from "./List/Local";

const implementations = [
    FileStorageList,
    FileStorageS3
];

const params = [
    [new ListStorageLocal]
];

const permutations = testPermutations(implementations, params);

describe.each(permutations)('File - %s vs %s', (_source, _target, components, params) => {
    let instances;

    beforeEach(async () => {
        await testResults(await testMethod(components, 'isSupported'), (result, index) => {
            if (!result) {
                throw new Error("Storage is not supported", components[index]);
            }
        });

        instances = testInstance(components, params);
        await testMethod(instances, 'open');
    }, 10000);

    afterEach(async () => {
        await testMethod(instances, 'reset');
        await testMethod(instances, 'close');
        jest.clearAllMocks();
    }, 10000);

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
