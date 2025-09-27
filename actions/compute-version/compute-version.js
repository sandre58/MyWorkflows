#!/usr/bin/env node
import { execSync } from "child_process";
import { analyzeCommits } from "@semantic-release/commit-analyzer";
import semver from "semver";

const workingDir = process.argv[2] || ".";
const tagPattern = process.argv[3] || "v{version}";

console.error("▶ Working dir:", workingDir);
console.error("▶ Tag pattern:", tagPattern);

// Helper to extract version from tag using pattern
function extractVersionFromTag(tag) {
  let regex = tagPattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')       // escape all special characters
    .replace(/\\\{version\\\}/g, "{version}")     // restore {version}
    .replace("{version}", "(\\d+\\.\\d+\\.\\d+(?:-[^\\s]+)?)"); // version regex

  console.error("  ↳ Final regex for extraction:", regex);

  const match = tag.match(new RegExp(`^${regex}$`));
  return match ? match[1] : null;
}

// Helper to create tag search pattern
function createTagSearchPattern() {
  return tagPattern.replace("{version}", "*");
}

// Helper to print JSON and exit
function printResult(version, changed) {
  console.log(JSON.stringify({ version, changed }));
  process.exit(0);
}

const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
console.error("▶ Current branch:", branch);

let suffix = branch === "main" ? "pre" : "beta";

// 1️⃣ Check if we are already on a tag
let currentTag = "";
try {
  currentTag = execSync("git describe --tags --exact-match", { stdio: ["pipe", "pipe", "ignore"] }).toString().trim();
} catch {}
console.error("▶ Current tag:", currentTag);

const currentVersion = extractVersionFromTag(currentTag);
console.error("▶ Extracted version from current tag:", currentVersion);
if (currentVersion) {
  printResult(currentVersion, false);
}

// 2️⃣ Find the latest existing tag
let lastTag = null;
const searchPattern = createTagSearchPattern();
console.error("▶ SearchPattern git tag -l:", searchPattern);

try {
  const allTags = execSync(`git tag -l "${searchPattern}" --sort=-version:refname`, {
    stdio: ["pipe", "pipe", "ignore"],
  })
    .toString()
    .trim()
    .split("\n")
    .filter(tag => tag.trim());

console.error("▶ Found tags:", allTags);

  for (const tag of allTags) {
    const version = extractVersionFromTag(tag.trim());
    console.error(`  ↳ Test tag "${tag}" → version:`, version);
    if (version) {
      lastTag = tag.trim();
      break;
    }
  }
} catch (e) {
console.error("⚠️ Error during git tag -l:", e);
  lastTag = null;
}

let lastVersion = lastTag ? extractVersionFromTag(lastTag) : "0.0.0";
console.error("▶ Last selected tag:", lastTag);
console.error("▶ Extracted version from last tag:", lastVersion);

// 3️⃣ Extraire commits depuis le dernier tag
const fromRef = lastTag ? `${lastTag}..HEAD` : "";
const rawCommitsCmd = fromRef
  ? `git log ${fromRef} --pretty=format:%s -- ${workingDir}/`
  : `git log --pretty=format:%s -- ${workingDir}/`;

console.error("▶ Command git log:", rawCommitsCmd);

const rawCommits = execSync(rawCommitsCmd).toString().trim();
console.error("▶ Found raw commits:", rawCommits);

if (!rawCommits) {
  printResult(lastVersion, false);
}

const commits = rawCommits
  .split("\n")
  .map((message, index) => ({
    message: message.trim(),
    hash: `commit${index}`,
    subject: message.trim(),
  }))
  .filter(commit => commit.message);

console.error("▶ Analyzed commits:", commits);

// 4️⃣ Analyse des commits
(async () => {
  const releaseType = await analyzeCommits(
    { preset: "conventionalcommits" },
    {
      commits,
      logger: {
        log: console.error,
        error: console.error,
      },
    }
  );

  console.error("▶ ReleaseType detected:", releaseType);

  if (!releaseType) {
    printResult(lastVersion, false);
  }

  // 5️⃣ Calcul de la version
  let nextVersion = semver.inc(lastVersion, releaseType || "patch", suffix);
  console.error("▶ Next version:", nextVersion);

  printResult(nextVersion, true);
})();
