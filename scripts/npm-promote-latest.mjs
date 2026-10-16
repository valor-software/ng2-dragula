// Points the npm `latest` dist-tag of ng2-dragula at an already published version.
// Used by .github/workflows/promote-npm-latest.yml; can be run locally with --dry-run.
//
//   node scripts/npm-promote-latest.mjs [--version=X.Y.Z] [--dry-run] [--allow-downgrade]
//
// Without --version, the most recently published stable (non-prerelease) version is promoted.
// Publishing needs an npm token with publish rights in ~/.npmrc or NODE_AUTH_TOKEN.
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

const PACKAGE = 'ng2-dragula';
const STABLE = /^\d+\.\d+\.\d+$/;

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) || '';

const dryRun = flag('dry-run');
const allowDowngrade = flag('allow-downgrade');
const requested = option('version').trim().replace(/^v/, '');

const npm = (...a) => execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', a, { encoding: 'utf8', shell: process.platform === 'win32' }).trim();
const view = (field) => JSON.parse(npm('view', PACKAGE, field, '--json'));
const compare = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};
const fail = (message) => {
  console.error(`::error::${message}`);
  process.exit(1);
};
const summary = (line) => {
  console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n`);
};

const time = view('time');
const published = Object.keys(time).filter((v) => v !== 'created' && v !== 'modified');
const current = view('dist-tags').latest;

let version;
if (requested) {
  if (!STABLE.test(requested)) fail(`"${requested}" is not a stable version (expected X.Y.Z; prereleases are not promoted to latest)`);
  if (!published.includes(requested)) fail(`${PACKAGE}@${requested} is not published on npm`);
  version = requested;
} else {
  const stable = published.filter((v) => STABLE.test(v));
  if (!stable.length) fail(`no stable ${PACKAGE} version is published`);
  version = stable.sort((a, b) => new Date(time[a]) - new Date(time[b])).at(-1);
}

summary(`### Promote ${PACKAGE} to \`latest\``);
summary('');
summary(`- current \`latest\`: ${current}`);
summary(`- version to promote: ${version} (published ${time[version]})${requested ? '' : ', the most recently published stable version'}`);

if (version === current) {
  summary(`- nothing to do: ${version} already is \`latest\``);
  process.exit(0);
}
if (current && STABLE.test(current) && compare(version, current) < 0 && !allowDowngrade) {
  fail(`${version} is lower than the current latest ${current}; re-run with allow_downgrade to move latest backwards`);
}

if (dryRun) {
  summary(`- dry run: would run \`npm dist-tag add ${PACKAGE}@${version} latest\``);
  process.exit(0);
}

npm('dist-tag', 'add', `${PACKAGE}@${version}`, 'latest');
const after = view('dist-tags').latest;
if (after !== version) fail(`npm still reports latest = ${after} after promoting ${version}`);
summary(`- done: \`latest\` is now ${after}`);
