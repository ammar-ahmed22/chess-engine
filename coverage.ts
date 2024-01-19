import fs from "fs";
import path from "path";

const PATH = path.join(__dirname);
const SUMMARY = fs.readFileSync(
  path.join(PATH, "./coverage/coverage-summary.json"),
  "utf-8",
);
const json = JSON.parse(SUMMARY);
const total = json.total;

// Calculating weighted average of coverage
let fullTotal = 0;
for (let key in total) {
  fullTotal += total[key].total;
}

for (let key in total) {
  total[key].weight = total[key].total / fullTotal;
}

let coverage = 0;
for (let key in total) {
  coverage += total[key].weight * total[key].pct;
}

console.log(Math.round(coverage));
