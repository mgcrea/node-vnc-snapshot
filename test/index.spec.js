
import 'debug-utils';

import fs from 'fs';
// import stream from 'stream';
import expect from 'expect';
import Promise from 'bluebird';
import {PNG} from 'pngjs';

import {saveSnapshot, takeSnapshot} from './../src';

Promise.promisifyAll(fs);

const PNG_HEADER = new Buffer([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const host = process.env.NODE_VNC_HOST || 'localhost';
const port = process.env.NODE_VNC_PORT || '5900';
const password = process.env.NODE_VNC_PASSWORD || '';

describe('parser', () => {
  it('should have a valid signature and be parsable', () =>
    takeSnapshot({host, port, password}, {})
      .then((buffer) => {
        expect(buffer).toBeA(Buffer);
        expect(buffer.slice(0, 8).compare(PNG_HEADER)).toEqual(0);
        return new Promise((resolve, reject) => {
          new PNG().parse(buffer, (err, data) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(data);
          });
        });
      })
      .then((buffer) => {
        expect(buffer).toBeA(Object);
      })
  ).timeout(5000);
  it('should properly save screenshot', () =>
    saveSnapshot('./tmp/out.png', {host, port, password}, {})
      .then((filePath) => {
        expect(filePath).toBeA('string');
        expect(filePath).toEqual('./tmp/out.png');
        return fs.readFileAsync('./tmp/out.png')
          .then((buffer) => {
            expect(buffer).toBeA(Buffer);
          });
      })
  ).timeout(5000);
});
