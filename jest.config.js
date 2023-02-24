module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
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
