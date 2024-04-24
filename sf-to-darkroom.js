#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

function detectPackageManager() {
  if (fs.existsSync("pnpm-lock.yaml")) {
    return "pnpm"
  } else if (fs.existsSync("yarn.lock")) {
    return "yarn"
  } else {
    return "npm"
  }
}

function getLatestPackageVersion(packageName) {
  const command = `npm view ${packageName} version`
  return execSync(command, { encoding: "utf8" }).trim()
}

function processFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8")
  const updatedContent = fileContent
    .replace(/@studio-freight\/lenis/g, "lenis")
    .replace(/@studio-freight\/react-lenis/g, "lenis/react")
    .replace(/@studio-freight\//g, "@darkroom.engineering/")
  fs.writeFileSync(filePath, updatedContent, "utf8")
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      processDirectory(fullPath)
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".js") &&
      entry.name !== "sf-to-darkroom.js"
    ) {
      processFile(fullPath)
    }
  })
}

console.log("Detecting package manager...")
const packageManager = detectPackageManager()
console.log(`Package manager detected: ${packageManager}`)

console.log("Reading package.json...")
const packageJsonPath = path.join(process.cwd(), "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

console.log("Updating dependencies...")
const dependencies = packageJson.dependencies || {}
const updatedDependencies = {}

for (const [packageName, version] of Object.entries(dependencies)) {
  if (packageName.startsWith("@studio-freight/")) {
    if (
      packageName === "@studio-freight/lenis" ||
      packageName === "@studio-freight/react-lenis"
    ) {
      console.log(`Updating ${packageName} to lenis...`)
      const latestVersion = getLatestPackageVersion("lenis")
      updatedDependencies["lenis"] = `^${latestVersion}`
    } else {
      const newPackageName = packageName.replace(
        "@studio-freight/",
        "@darkroom.engineering/"
      )
      console.log(`Updating ${packageName} to ${newPackageName}...`)
      const latestVersion = getLatestPackageVersion(newPackageName)
      updatedDependencies[newPackageName] = `^${latestVersion}`
    }
  } else {
    updatedDependencies[packageName] = version
  }
}

console.log("Updating package.json...")
packageJson.dependencies = updatedDependencies
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8")

console.log("Removing @studio-freight packages from the lockfile...")
if (packageManager === "npm") {
  execSync("npm install --package-lock-only")
} else if (packageManager === "yarn") {
  execSync("yarn install --mode=update-lockfile")
} else if (packageManager === "pnpm") {
  execSync("pnpm install --lockfile-only")
}

console.log("Installing updated dependencies...")
execSync(`${packageManager} install`)

console.log("Processing files...")
processDirectory(process.cwd())

console.log(
  "Package import renaming, dependency updates, and lockfile cleanup completed!"
)
