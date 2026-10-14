import { readFile, writeFile } from 'fs/promises';

const packagesGlob = './libs/ng2-dragula/package.json';
const mainPackage = './package.json';

const readJson = async (path: string) => JSON.parse(await readFile(path, 'utf8'));
const writeJson = (path: string, json: unknown) => writeFile(path, JSON.stringify(json, null, 2) + '\n');

(async () => {
  const version = await readJson(mainPackage).then(json => json.version);
  const packages = [packagesGlob]
    .map(async packagePath => {
      const packageJson = await readJson(packagePath);
      if (packageJson.version) {
        packageJson.version = version;
      }

      await writeJson(packagePath, packageJson);
    });

  await Promise.all(packages);
})();
