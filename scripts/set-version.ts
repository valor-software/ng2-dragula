import { readJson, writeJson } from 'fs-extra';

const packagesGlob = './libs/ng2-dragula/package.json';
const mainPackage = './package.json';

(async () => {
  const version = await readJson(mainPackage).then(json => json.version);
  const packages = [packagesGlob]
    .map(async packagePath => {
      const packageJson = await readJson(packagePath);
      if (packageJson.version) {
        packageJson.version = version;
      }

      await writeJson(packagePath, packageJson, { spaces: 2 });
    });

  await Promise.all(packages);
})();
