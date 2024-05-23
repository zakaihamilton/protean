import * as StorageListDb from "src/Core/Storage/List/Db";
import * as StorageListLocal from "src/Core/Storage/List/Local";
import * as StorageListMemory from "src/Core/Storage/List/Memory";
import * as StorageListS3 from "src/Core/Storage/List/S3";
import * as StorageListMongo from "src/Core/Storage/List/Mongo";
import * as StorageListRedis from "src/Core/Storage/List/Redis";

const implementations = [
    {
        id: "db",
        label: "Database",
        Component: StorageListDb
    },
    {
        id: "local",
        label: "Local",
        Component: StorageListLocal
    },
    {
        id: "memory",
        label: "Memory",
        Component: StorageListMemory
    },
    {
        id: "s3",
        label: "S3",
        Component: StorageListS3
    },
    {
        id: "mongo",
        label: "Mongo",
        Component: StorageListMongo
    },
    {
        id: "redis",
        label: "Redis",
        Component: StorageListRedis
    }
];

export default implementations;
