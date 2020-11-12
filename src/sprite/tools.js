class ImageInfo {
  constructor(path, size) {
    this.path = path;
    this.width = size.width;
    this.height = size.height;
    this.area = this.width * this.height;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Region {
  constructor(x, y, width, height, path) {
    this.path = path;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
    this.centerX = (this.left + this.right) / 2;
    this.centerY = (this.top + this.bottom) / 2;
  }

  isCollided(region) {
    var collided =
      Math.abs(this.centerX - region.centerX) < (this.width + region.width) / 2 &&
      Math.abs(this.centerY - region.centerY) < (this.height + region.height) / 2;
    return collided;
  }
}

class SimpleSprite {
  constructor() {
    this.points = [];
    this.regions = [];
    this.initPoints();
  }

  initPoints() {
    const startPoint = new Point(0, 0);
    this.points.push(startPoint);
  }

  getPossibleRegions(width, height, path) {
    const regionList = [];

    this.points.forEach(point => {
      const region_new = new Region(point.x, point.y, width, height, path);
      const len = this.regions.length;
      if (len === 0) {
        regionList.push(region_new);
      } else {
        let isAllNotCollided = true;
        for (let i = 0; i < len; i++) {
          if (this.regions[i].isCollided(region_new)) {
            isAllNotCollided = false;
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        isAllNotCollided ? regionList.push(region_new) : null;
      }
    });
    return regionList;
  }

  getSmallestAreaRegion(width, height, path) {
    const regionList = this.getPossibleRegions(width, height, path);

    let minarea = Number.MAX_VALUE;
    let minRegion;
    regionList.forEach(item => {
      const area = this.getTotalAreaOfRegions(item);
      if (minarea > area) {
        minarea = area;
        minRegion = item;
      }
    });
    return minRegion;
  }

  getTotalAreaOfRegions(region) {
    const w = this.getTotalWidthOfRegions(region);
    const h = this.getTotalHeightOfRegions(region);
    return w * h;
  }

  getTotalWidthOfRegions(region) {
    let _totalWidth = region ? region.right : 0;
    this.regions.forEach(item => {
      _totalWidth = Math.max(_totalWidth, item.right);
    });
    return _totalWidth;
  }

  getTotalHeightOfRegions(region) {
    let _totalHeight = region ? region.bottom : 0;
    this.regions.forEach(item => {
      _totalHeight = Math.max(_totalHeight, item.bottom);
    });
    return _totalHeight;
  }
}

module.exports = {
  ImageInfo,
  Point,
  Region,
  SimpleSprite,
};
