const fs = require('fs');
const path = require('path');

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

module.exports = {
  deleteFile,
  copyFolder
}