# How to start

**Note** requires node v4.x.x or higher and npm 2.14.7.

```bash
git clone https://github.com/valor-software/ng2-dragula.git
cd ng2-dragula
npm install       # or `npm run reinstall` if you get an error
npm start         # start with --env dev
```

# Configuration

Default application server configuration

```javascript
var PORT             = 5555;
var LIVE_RELOAD_PORT = 4002;
var DOCS_PORT        = 4003;
var APP_BASE         = '/';
```

Configure at runtime

```bash
npm start -- --port 8080 --reload-port 4000 --base /my-app/
```

# Running test

```bash
npm test

# Debug - In two different shell windows
npm run build.test.watch      # 1st window
npm run karma.start           # 2nd window
```

## Submitting Pull Requests

**Please follow these basic steps to simplify pull request reviews - if you don't you'll probably just be asked to anyway.**

* Please rebase your branch against the current master
* Run ```npm install``` to make sure your development dependencies are up-to-date
* Please ensure that the test suite passes **and** that code is lint free before submitting a PR by running:
 * ```npm test```
* If you've added new functionality, **please** include tests which validate its behaviour
* Make reference to possible [issues](https://github.com/valor-software/ng2-dragula/issues) on PR comment

## Submitting bug reports

* Please detail the affected browser(s) and operating system(s)
* Please be sure to state which version of node **and** npm you're using
