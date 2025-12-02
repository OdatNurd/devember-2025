/******************************************************************************/


import { readFileSync, writeFileSync } from "fs";


/******************************************************************************/


// Pull the current package version from package.json
const targetVersion = process.env.npm_package_version;

// Load the current manifest file, pluck out the minimum app version from it,
// and then set the version of the package into the manifest data object and
// write it back out to disk.
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));

// Now update the versions.json file, giving it the plugin version and minimum
// app version as gathered above. This is only done if the target version is not
// already in the versions.json file though.
const versions = JSON.parse(readFileSync('versions.json', 'utf8'));
if (Object.values(versions).includes(minAppVersion) === false) {
  versions[targetVersion] = minAppVersion;
  writeFileSync('versions.json', JSON.stringify(versions, null, '\t'));
}


/******************************************************************************/
