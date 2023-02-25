module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "..",
  testMatch: ["**/test/**/*.test.ts"],
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        tsconfig: {
          esModuleInterop: true,
          moduleResolution: "node",
          module: "ESNext",
        },
      },
    ],
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
