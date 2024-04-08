import StorageListDb from "src/Core/Storage/List/Db";
import StorageListLocal from "src/Core/Storage/List/Local";
import StorageListMemory from "src/Core/Storage/List/Memory";

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
    }
];

export default implementations;
