
var VncSnapshot = require('./../lib').VncSnapshot;
var fs = require('fs');

var snapshot = new VncSnapshot({
  // host: '127.0.0.1',
  host: 'player-27e9.local',
  port: 5900,
  password: '*'
});

snapshot.connect(function(err, rc) {
  if(err) throw err;
  console.log('successfully connected and authorised');
  console.log('remote screen name: ' + rc.title + ' width:' + rc.width + ' height: ' + rc.height);
  snapshot.take({w: 192, h: 108}, function(err, stream) {
    stream.pipe(fs.createWriteStream('/tmp/data.png'));
    stream.on('end', function() {
      console.log('snapshot saved to /tmp/data.png');
      process.exit(0);
    });
  });
});