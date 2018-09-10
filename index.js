const https = require('https');
const unzip = require('unzip');
const os = require('os');
const path = require('path');
const fs = require('fs');

function getInstallPath({
  platform,
  version,
  arch,
}) {
  return path.resolve(__dirname, 'bin', platform, arch, version);
}

const COMPLETE_FILE = '.complete';

function writeComplete(installPath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(installPath, COMPLETE_FILE), '', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function verifyCompleteInstallation(installPath) {
  return new Promise((resolve) => {
    fs.stat(path.resolve(installPath, COMPLETE_FILE), (err, stat) => {
      resolve(!err && stat.isFile());
    });
  });
}

function getBinaryPaths(options) {
  let files = {};
  switch (options.platform) {
    case 'windows': {
      files = {
        convert: 'convert.exe',
        identify: 'identify.exe',
      };
      break;
    }
  }
  const installPath = getInstallPath(options);
  Object.keys(files).forEach((name) => {
    files[name] = path.resolve(installPath, files[name]);
  });
  files.path = installPath;
  return files;
}

function getDefaultOptions() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    mirror: 'https://imagemagick.org/download/',
  };
}

function getOptions(options) {
  if (!options) {
    return Promise.reject(new Error('Must provide options.'));
  }
  if (!options.version) {
    return Promise.reject(new Error(`Must provide a version number (ie. 7.0.8-11).`));
  }
  const arch = ({
    'x64': 'x64',
    'ia32': 'x86',
    'x86': 'x86',
  })[options.arch];
  if (!arch) {
    return Promise.reject(new Error(`Unsupported arch ${options.arch}.`));
  }
  const platform = ({
    'win32': 'windows',
    'windows': 'windows',
  })[options.platform];
  if (!platform) {
    return Promise.reject(new Error(`Unsupported platform ${options.platform}.`));
  }
  return Promise.resolve({
    platform,
    arch,
    version: options.version,
    mirror: options.mirror,
  });
}

function download(_options) {
  return getOptions(Object.assign({}, getDefaultOptions(), _options))
    .then((options) => {
      const path = getInstallPath(options);
      const binaries = getBinaryPaths(options);
      return verifyCompleteInstallation(path)
        .then((installed) => {
          if (installed) {
            return binaries;
          } else {
            switch (options.platform) {
              case 'windows': {
                return new Promise((resolve, reject) => {
                  const url = `${options.mirror}/binaries/ImageMagick-${options.version}-portable-Q16-${options.arch}.zip`;
                  const req = https.get(url, (res) => {
                    if (res.statusCode === 404) {
                      reject(new Error(`Version ${options.version} not found.`));
                      return;
                    }
                    res.pipe(unzip.Extract({ path }));
                    res.on('end', () => {
                      writeComplete(path)
                        .then(() => resolve(binaries))
                        .catch(reject);
                    });
                  });
                  req.on('error', err => reject(err));
                  req.end();
                });
              }
            }
          }
        });
    });
}

function bin(_options) {
  return getOptions(Object.assign({}, getDefaultOptions(), _options))
    .then((options) => getBinaryPaths(options));
}

module.exports = {
  download,
  bin,
};

//  await download({
//    platform: 'windows',
//    arch: 'x64',
//    version: '7.0.8-11',
//  });
