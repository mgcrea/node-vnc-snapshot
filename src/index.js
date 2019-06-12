
import fs from 'fs';
import rfb from 'rfb2';
import {PNG} from 'pngjs';
import {Readable} from 'stream';

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
      let fullPng = new PNG({width: rc.width, height: rc.height});
      let pixelsToReceive = rc.width * rc.height;
      let resolved = false;
      rc.on('rect', (rect) => {
	if (resolved)
	  return;
        // Build PNG
        const png = new PNG({width: rect.width, height: rect.height});
        png.data = parseRectAsRGBABuffer(rect);
	png.bitblt(fullPng, 0, 0, rect.width, rect.height, rect.x, rect.y);
	pixelsToReceive -= rect.width * rect.height;
	// XXX this is an approximation: we count on receiving just the right number of pixels without overlap.
	// If the server sends the same part of the screen two or more times, we may be missing other parts.
	if (pixelsToReceive <= 0) {
	  fullPng.on('error', reject);
	  // pngjs (as of 3.4.0 at least) returns an "old-style" stream, which does not implement the full Readable interface.
	  // This causes the first 'data' events to be lost during the Promise handling
	  // Avoid this by wrapping it in a "new-style" stream
	  // See https://nodejs.org/api/stream.html#stream_readable_wrap_stream
	  let readStream = new Readable().wrap(png.pack());
	  resolved = true;
	  resolve(readStream);
	}
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
