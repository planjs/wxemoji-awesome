const path = require('path');
const { generateSprite } = require('./sprite');

function sprite() {
  return generateSprite(path.resolve(__dirname, './assets'));
}

sprite();
