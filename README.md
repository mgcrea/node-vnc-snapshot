# VNC Snapshot

[![project status](https://img.shields.io/badge/status-stable-green.svg?style=flat)](https://github.com/mgcrea/node-vnc-snapshot) [![license](https://img.shields.io/github/license/mgcrea/node-vnc-snapshot.svg?style=flat)](https://tldrlegal.com/license/mit-license) [![build status](http://img.shields.io/travis/mgcrea/node-vnc-snapshot/master.svg?style=flat)](http://travis-ci.org/mgcrea/node-vnc-snapshot) [![dependencies status](https://img.shields.io/david/mgcrea/node-vnc-snapshot.svg?style=flat)](https://david-dm.org/mgcrea/node-vnc-snapshot) [![devDependencies status](https://img.shields.io/david/dev/mgcrea/node-vnc-snapshot.svg?style=flat)](https://david-dm.org/mgcrea/node-vnc-snapshot#info=devDependencies) [![coverage status](http://img.shields.io/codeclimate/coverage/github/mgcrea/node-vnc-snapshot.svg?style=flat)](https://codeclimate.com/github/mgcrea/node-vnc-snapshot) [![climate status](https://img.shields.io/codeclimate/github/mgcrea/node-vnc-snapshot.svg?style=flat)](https://codeclimate.com/github/mgcrea/node-vnc-snapshot)

Easily take a snapshot from a running VNC server.

## Usage

### Quickstart

- Grab a readStream:

```js
takeStreamSnapshot({host, password}, {w: 1024, h: 768})
  .then((readStream) => {
  })
```

- Grab a buffer:

```js
takeSnapshot({host, password}, {w: 1024, h: 768})
  .then((buffer) => {
    expect(buffer).toBeA(Buffer);
    expect(buffer.slice(0, 8).compare(PNG_HEADER)).toEqual(0);
  })
```

- Save to file:

```js
saveSnapshot('./tmp/out.png', {host, password}, {w: 1024, h: 768})
  .then((filePath) => {
    expect(filePath).toBeA('string');
    expect(filePath).toEqual('./tmp/out.png');
  })
```

### Available scripts

| **Script** | **Description** |
|----------|-------|
| start | Alias of test:watch |
| test | Run mocha unit tests |
| test:watch | Run and watch mocha unit tests |
| lint | Run eslint static tests |
| compile | Compile the library |
| compile:watch | Compile and watch the library |


## Authors

**Olivier Louvignes**

+ http://olouv.com
+ http://github.com/mgcrea


## License

```
The MIT License

Copyright (c) 2016 Olivier Louvignes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
