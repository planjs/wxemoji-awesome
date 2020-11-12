const request = require('request');
const fs = require('fs');
const path = require('path');
const { deleteFile, copyFolder } = require('./utils')

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

async function update() {
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
    } catch (error) { }
  }
}

update();
