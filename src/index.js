const request = require('request');
const fs = require('fs');
const path = require('path');
const { generateSprite } = require('./sprite');

async function deleteFile(path) {
  const exists = fs.existsSync(path);
  if (!exists) {
    return fs.mkdirSync(path);
  }
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file) {
      var curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFile(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
}

function fetchWxEmoji(opts = {}, path = '') {
  return new Promise((resolve, reject) => {
    request.head(opts.url, (err, res, body) => {
      if (err) {
        return reject(err);
      } else {
        if (res.statusCode !== 200) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject(`${opts.url}:${res.statusMessage}`);
        }

        request
          .get(opts)
          .pipe(fs.createWriteStream(path))
          .on('error', e => {
            resolve(e);
          })
          .on('finish', () => {
            resolve({
              res,
              body,
            });
          });
      }
    });
  });
}

function copyFolder(srcDir, tarDir) {
  function copyFile(srcPath, tarPath) {
    var rs = fs.createReadStream(srcPath);
    var ws = fs.createWriteStream(tarPath);
    rs.pipe(ws);
  }

  fs.readdir(srcDir, function (err, files) {
    if (err) {
      return;
    }

    files.forEach(function (file) {
      var srcPath = path.join(srcDir, file);
      var tarPath = path.join(tarDir, file);

      fs.stat(srcPath, function (err, stats) {
        if (err) {
          return;
        }
        if (stats.isDirectory()) {
          console.log('mkdir', tarPath);
          fs.mkdir(tarPath, function (err) {
            if (err) {
              console.log(err);
              return;
            }

            copyFolder(srcPath, tarPath);
          });
        } else {
          copyFile(srcPath, tarPath);
        }
      });
    });
  });
}

async function run() {
  deleteFile(path.resolve(__dirname, './assets'));
  copyFolder(path.resolve(__dirname, './new'), path.resolve(__dirname, './assets'));
  const urls = [...new Array(110)].map((_v, index) => ({
    url: `https://res.wx.qq.com/mpres/htmledition/images/icon/common/emotion_panel/smiley/smiley_${index}.png`,
    name: `wx-${index + 1}`,
  }));

  for (const item of urls) {
    try {
      console.log(`fetching: ${item.name}`);
      await fetchWxEmoji({ url: item.url }, path.resolve(__dirname, `./assets/${item.name}.png`));
    } catch (error) {}
  }

  setTimeout(async () => {
    await sprite();
    deleteFile(path.resolve(__dirname, './assets'));
    setTimeout(() => {
      fs.rmdirSync(path.resolve(__dirname, './assets'));
    }, 500);
  }, 500);
}

function sprite() {
  return generateSprite(path.resolve(__dirname, './assets'));
}

sprite();
