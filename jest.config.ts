import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./src/setupTests.ts"],
};

export default config;

// export default {
//   preset: "ts-jest",
//   transform: { '^.+\\.ts': 'ts-jest' },
//   clearMocks: true,
//   collectCoverage: true,
//   coverageDirectory: "coverage",
// }
