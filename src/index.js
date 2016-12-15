
import fs from 'fs';
import rfb from 'rfb2';
import gm from 'gm';
import {PNG} from 'pngjs';

import {parseRectAsRGBABuffer} from './utils/parse';

export class VncSnapshot {

  constructor(config = {host: '127.0.0.1', port: 5900}) {
    this.config = config;
  }

  connect() {
    this.rc = rfb.createConnection(this.config);
    return new Promise((resolve, reject) => {
      this.rc.on('error', reject);
      this.rc.on('connect', () => { resolve(this.rc); });
    });
  }

  take(options = {}) {
    const rc = this.rc;
    return new Promise((resolve, reject) => {
      rc.once('rect', (rect) => {
        // Build PNG
        const png = new PNG({width: rect.width, height: rect.height});
        png.data = parseRectAsRGBABuffer(rect);
        png.on('error', reject);
        let readStream = png.pack();
        // Required to have a proper file
        readStream = gm(readStream);
        if (options.a) {
          readStream = readStream.antialias(!!options.a);
        }
        if (options.w || options.h) {
          readStream = readStream.resize(options.w || null, options.h || null, options.f ? '!' : null);
        }
        readStream = readStream.stream();
        readStream.on('error', reject);
        resolve(readStream);
      });
      rc.requestUpdate(false, 0, 0, rc.width, rc.height);
    });
  }

  end() {
    if (this.rc) {
      this.rc.end();
    }
  }

}

export const takeStreamSnapshot = (opts = {}, takeOpts = {}) => {
  const snapshot = new VncSnapshot(opts);
  return Promise.resolve()
    .then(() => snapshot.connect())
    .then(() => snapshot.take(takeOpts))
    .then((readStream) => {
      snapshot.end();
      return readStream;
    });
};

export const takeSnapshot = (opts = {}, takeOpts = {}) =>
  takeStreamSnapshot(opts, takeOpts)
    .then(readStream =>
      new Promise((resolve, reject) => {
        const buffers = [];
        readStream.on('error', reject);
        readStream.on('data', (data) => { buffers.push(data); });
        readStream.on('end', () => { resolve(Buffer.concat(buffers)); });
      })
    );

export const saveSnapshot = (filePath, opts = {}, takeOpts = {}) =>
  takeStreamSnapshot(opts, takeOpts)
    .then(readStream =>
      new Promise((resolve, reject) => {
        readStream.on('error', reject);
        const writeStream = fs.createWriteStream(filePath);
        writeStream.on('error', reject);
        writeStream.on('finish', () => { resolve(filePath); });
        readStream.pipe(writeStream);
      })
    );

export default takeSnapshot;

/*
rc.once('rect', (rect) => {
  switch (rect.encoding) {
    case rfb.encodings.raw:
      // rect.x, rect.y, rect.width, rect.height, rect.data
      // pixmap format is in r.bpp, r.depth, r.redMask, greenMask, blueMask, redShift, greenShift, blueShift
      break;
    case rfb.encodings.copyRect:
      // pseudo-rectangle
      // copy rectangle from rect.src.x, rect.src.y, rect.width, rect.height, to rect.x, rect.y
      break;
    case rfb.encodings.hextile:
      // not fully implemented
      break;
    default:
      break;
  }
*/
