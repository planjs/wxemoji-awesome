const path = require('path');
const fs = require('fs');
const { generateSprite } = require('./sprite');
const { deleteFile, copyFolder } = require('./utils')

async function sprite() {
  await generateSprite(path.resolve(__dirname, './assets'));
  deleteFile(path.resolve(__dirname, './assets'));
  fs.rmdirSync(path.resolve(__dirname, './assets'));
}

sprite();
