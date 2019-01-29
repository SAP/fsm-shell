
const gitRev = require('git-rev');
const path = require('path');

function gitRevAsync() {
  return new Promise(gitRev.short);
}

function getVersion() {
  return gitRevAsync().then(sha => {

    const packageJson = require(path.resolve('./package.json'));

    const version = packageJson.version;
    const timestamp = Math.round(new Date().getTime()/1000).toString(10);

    return `${version}-${sha}-t${timestamp}`;
  });
}

getVersion()
  .then(console.log)
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
