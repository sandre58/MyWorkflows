#!/usr/bin/env node
import { execSync } from "child_process";
import { analyzeCommits } from "@semantic-release/commit-analyzer";
import semver from "semver";

const workingDir = process.argv[2] || ".";
const tagPattern = process.argv[3] || "v{version}";

// Helper to extract version from tag using pattern
function extractVersionFromTag(tag) {
  // Convert pattern to regex, escaping special chars except placeholders
  let regex = tagPattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape all special chars
    .replace(/\\\{version\\\}/g, "{version}") // restore the placeholder
    .replace("{version}", "(\\d+\\.\\d+\\.\\d+(?:-[^\\s]+)?)"); // inject the regex

  const match = tag.match(new RegExp(`^${regex}$`));
  return match ? match[1] : null;
}

// Helper to create tag search pattern
function createTagSearchPattern() {
  return tagPattern
    .replace("{version}", "*");
}

// Helper to print JSON and exit
function printResult(version, changed) {
  console.log(JSON.stringify({ version, changed }));
  process.exit(0);
}

const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
let suffix;
if (branch === "main") {
    suffix = "pre";
} else {
    suffix = "beta";
}

// 1️⃣ Check if we are on a tag
let currentTag = "";
try {
  currentTag = execSync("git describe --tags --exact-match", { stdio: ["pipe", "pipe", "ignore"] }).toString().trim();
} catch {
  currentTag = "";
}
const currentVersion = extractVersionFromTag(currentTag);
if (currentVersion) {
  printResult(currentVersion, false);
}

// 2️⃣ Get the latest existing tag
let lastTag = null;
const searchPattern = createTagSearchPattern();
try {
  const allTags = execSync(`git tag -l "${searchPattern}" --sort=-version:refname`, {
    stdio: ["pipe", "pipe", "ignore"],
  })
    .toString()
    .trim()
    .split('\n')
    .filter(tag => tag.trim());
  
  for (const tag of allTags) {
    const version = extractVersionFromTag(tag.trim());
    if (version) {
      lastTag = tag.trim();
      break;
    }
  }
} catch {
  lastTag = null;
}
let lastVersion = lastTag ? extractVersionFromTag(lastTag) : "0.0.0";

// 3️⃣ Extract commits since last tag (or all history if no tag)
const fromRef = lastTag ? `${lastTag}..HEAD` : "";
const rawCommitsCmd = fromRef
  ? `git log ${fromRef} --pretty=format:%s -- ${workingDir}/`
  : `git log --pretty=format:%s -- ${workingDir}/`;
const rawCommits = execSync(rawCommitsCmd).toString().trim();

if (!rawCommits) {
    // No commits found, return current version without changes
    printResult(lastVersion, false);
}

const commits = rawCommits
  .split("\n")
  .map((message, index) => ({
    message: message.trim(),
    hash: `commit${index}`,
    subject: message.trim(),
  }))
  .filter((commit) => commit.message);

(async () => {
  // 4️⃣ Determine release type from commits
  const releaseType = await analyzeCommits(
    { preset: "conventionalcommits" }, // ou 'conventionalcommits' si installé
    {
      commits,
      logger: {
        log: console.error,
        error: console.error,
      },
    }
  );

  if (!releaseType) {
    printResult(lastVersion, false);
  }

  // 5️⃣ Calculate version based on context
  let nextVersion = semver.inc(lastVersion, releaseType || "patch", suffix);

  printResult(nextVersion, true);
})();