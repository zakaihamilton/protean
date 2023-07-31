const nextJest = require("next/jest");
const createJestConfig = nextJest({
    dir: "./",
});
const customJestConfig = {
    moduleDirectories: ["node_modules", "<rootDir>/"],
    testMatch: ["<rootDir>/src/**/*.test.js"],
    testEnvironment: "jest-environment-jsdom",
};
module.exports = createJestConfig(customJestConfig);