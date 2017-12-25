module.exports = wallaby => ({
  files: [
    "package.json",
    "tsconfig.json",
    "src/setupJest.ts",
    "src/**/*.ts?(x)",
    "src/**/*.html",
    "src/**/*.snap",
    "src/**/*.json",
    "src/**/*.diff",
    "!src/**/*-tests.ts?(x)",
  ],
  tests: ["src/**/*-tests.ts?(x)"],

  preprocessors: {
    "**/*.js?(x)": file =>
      require("babel-core").transform(file.content, {
        sourceMap: true,
        presets: ["react-native", "babel-preset-jest"],
        plugins: ["relay"],
      }),
  },

  env: {
    type: "node",
    runner: "node",
  },

  setup: wallaby => {
    const path = require("path")
    const jestConfig = require("./package.json").jest
    jestConfig.setupFiles = [path.join(wallaby.projectCacheDir, "src", "setupJest.ts")]
    wallaby.testFramework.configure(jestConfig)
  },

  testFramework: "jest",
  debug: true,
})
