'use strict';

var rfb = require('rfb2');
var pngjs = require('pngjs');
var gm = require('gm');

exports.VncSnapshot = class VncSnapshot {

  constructor(config = {host: '127.0.0.1', port: 5900}) {
    this._config = config;
  }

  connect(callback = function() {}) {
    const rc = this.connection = rfb.createConnection(this._config);
    rc.on('error', callback)
    rc.on('connect', function() {
      callback(null, rc);
    });
  }

  take(options = {}, callback = function() {}) {

    const rc = this.connection;
    if(typeof options === 'function') {
      callback = options;
      options = {};
    }

    rc.on('rect', function(rect) {

      const png = new pngjs.PNG({width: rect.width, height: rect.height});
      png.data = parseRectAsRGBABuffer(rect);
      png.on('error', callback);

      var readStream = png.pack();

      if(options.w || options.h) {
        readStream = gm(readStream)
          .antialias(options.a ? false : true)
          .resize(options.w || null, options.h || null, options.f ? '!' : null)
          .stream();
        readStream.on('error', function(err) {
          throw err;
        });
      }

      callback(null, readStream);
    });

    rc.requestUpdate(false, 0, 0, rc.width, rc.height);
  }

  end() {
    if(this.connection) {
      this.connection.end();
    }
  }

}

function parseRectAsRGBBuffer(rect) {

  var rgb = new Buffer(rect.width * rect.height * 3, 'binary');
  for (var i = 0, j = 0; i < rect.data.length; i += 4) {
    rgb[j++] = rect.data[i + 2];
    rgb[j++] = rect.data[i + 1];
    rgb[j++] = rect.data[i];
  }

  return rgb;

}

function parseRectAsRGBABuffer(rect) {

  var rgba = new Buffer(rect.width * rect.height * 4, 'binary');
  for (var i = 0, j = 0; i < rect.data.length; i += 4) {
    rgba[j++] = rect.data[i + 2];
    rgba[j++] = rect.data[i + 1];
    rgba[j++] = rect.data[i];
    rgba[j++] = rect.data[i + 3];
  }

  return rgba;

}


