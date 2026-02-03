/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@utils$": "<rootDir>/src/utils",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      { tsconfig: "tsconfig.jest.json" },
    ],
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
  coverageDirectory: "coverage",
  verbose: true,
  maxWorkers: 1,
};
