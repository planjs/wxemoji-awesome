const { ImageInfo, Point, SimpleSprite } = require('./tools');
const fs = require('fs');
const path = require('path');
const images = require('images');
const filenameMap = {};

function generateSprite(targetImagesDirPath) {
  return new Promise(async (resolve, reject) => {
    if (!targetImagesDirPath) {
      return reject(new Error('please input image dir.'));
    }
    const imageInfos = fs
      .readdirSync(targetImagesDirPath)
      .filter(filename => filename !== 'sprite.png')
      .filter(filename => {
        const suffix = filename.substring(filename.indexOf('.')).toLowerCase();
        if (
          suffix !== '.bmp' &&
          suffix !== '.png' &&
          suffix !== '.gif' &&
          suffix !== '.jpg' &&
          suffix !== '.jpeg'
        ) {
          return false;
        }
        return true;
      })
      .map(filename => {
        const filepath = path.join(targetImagesDirPath, filename);
        filenameMap[filepath] = filename;
        return filepath;
      })
      .filter(filepath => fs.statSync(filepath).isFile())
      .map(filepath => new ImageInfo(filepath, images(filepath).size()));

    imageInfos.sort((image1, image2) => image1.area < image2.area);

    const simpleSprite = new SimpleSprite();

    imageInfos.forEach(item => {
      const size = item.width;
      const region = simpleSprite.getSmallestAreaRegion(size, size, item.path);

      if (region) {
        simpleSprite.regions.push(region);
        simpleSprite.points.push(new Point(region.right, region.top));
        simpleSprite.points.push(new Point(region.left, region.bottom));
        const index = simpleSprite.points.findIndex(point => {
          return point.x === region.x && point.y === region.y;
        });
        simpleSprite.points.splice(index, 1);
      }
    });

    const sprintImage = images(
      simpleSprite.getTotalWidthOfRegions(),
      simpleSprite.getTotalHeightOfRegions()
    );
    simpleSprite.regions.forEach(region => {
      sprintImage.draw(images(region.path), region.x, region.y);
    });

    sprintImage.save(path.join(targetImagesDirPath, '../img/sprite.png'));
    // 生成css文件
    let content = `
      .wxem {
        display: inline-block;
        height: 1em;
        width: 1em;
        overflow: hidden;
        line-height: 18px;
        font-size: 24px;
        vertical-align: middle;
        color: transparent !important;
        background: url(../img/sprite.png);
        background-size: 11000%;
        background-repeat: no-repeat;
        position: relative;
        top: -1px;
        overflow: hidden;
      }
      \n
    `;

    simpleSprite.regions.forEach((item, index) => {
      // const name = item.path.split('/').pop().replace('.png', '');
      const name = filenameMap[item.path];
      let _imgCss = '';

      if (!name) {
        return;
      }

      switch (name) {
        case 'wx-new-1':
          _imgCss = 'background-position: 91.78% 0px;';
          break;
        case 'wx-new-2':
          _imgCss = 'background-position: 93.6% 0px;';
          break;
        case 'wx-new-3':
          _imgCss = 'background-position: 94.48% 0px;';
          break;
        case 'wx-new-4':
          _imgCss = 'background-position: 95.4% 0px;';
          break;
        case 'wx-new-5':
          _imgCss = 'background-position: 96.36% 0px;';
          break;
        case 'wx-new-6':
          _imgCss = 'background-position: 97.24% 0px;';
          break;
        case 'wx-new-7':
          _imgCss = 'background-position: 98.2% 0px;';
          break;
        case 'wx-new-8':
          _imgCss = 'background-position: 99.1% 0px;';
          break;
        case 'wx-new-9':
          _imgCss = 'background-position: 99.99% 0px;';
          break;
        case 'wx-new-10':
          _imgCss = 'background-position: 92.7% 0px;';
          break;
        default:
          _imgCss = `background-position: ${index * 0.8735294117647059}% 0px;`;
          break;
      }

      _imgCss = `
        .wxem-${name} {
          ${_imgCss}
        }\n
      `;

      content = content + _imgCss;
    });

    fs.writeFileSync(path.join(targetImagesDirPath, '../css/index.css'), content);

    setTimeout(() => {
      console.info(
        `generate sprite image success,it has been saved in ${targetImagesDirPath}/sprite.png`
      );
      console.info(
        `generate css success,it has been saved in ${targetImagesDirPath}/sprite-css.txt`
      );
      resolve();
    }, 1000);
  });
}

module.exports = {
  generateSprite,
};
