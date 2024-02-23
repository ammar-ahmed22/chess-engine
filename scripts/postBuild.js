const { join, resolve, basename } = require("path");
const { writeFileSync, readFileSync } = require("fs");

const packagePath = process.cwd();
const distPath = join(packagePath, "./dist");


const writeJSON = (targetPath, obj) => {
  writeFileSync(targetPath, JSON.stringify(obj, null, 2), "utf-8");
}

const copy = (source, target) => {
  const sourceData = readFileSync(source, "utf-8");
  writeFileSync(target, sourceData, "utf-8");
}

const includeFile = (file) => {
  const sourcePath = resolve(packagePath, file);
  const targetPath = resolve(distPath, basename(file));
  copy(sourcePath, targetPath);
  console.log(`Copied ${sourcePath} to ${targetPath}`);
}

function createPackageFile() {
  const packageData = readFileSync(resolve(packagePath, "./package.json"), "utf-8");
  const { scripts, devDependencies, jest, ...packageOthers } = JSON.parse(packageData);
  const updatedPackageData = {
    ...packageOthers,
    private: false,
    typings: "./index.d.ts",
    module: "./index.js",
    main: "./cjs/index.js"
  }
  const targetPath = resolve(distPath, "./package.json");
  writeJSON(targetPath, updatedPackageData);
  console.log(`Created package.json in ${targetPath}`);
}


function run() {
  try {
    createPackageFile()
    includeFile("./README.md")
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

run();