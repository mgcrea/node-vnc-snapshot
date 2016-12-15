# node-vnc-snapshot

Easily take a snapshot from a running VNC server.

- Grab a readStream:

```
takeStreamSnapshot({host, password}, {w: 1024, h: 768})
  .then((readStream) => {
  })
```

- Grab a buffer:

```
takeSnapshot({host, password}, {w: 1024, h: 768})
  .then((buffer) => {
    expect(buffer).toBeA(Buffer);
    expect(buffer.slice(0, 8).compare(PNG_HEADER)).toEqual(0);
  })
```

- Save to file:

```
saveSnapshot('./tmp/out.png', {host, password}, {w: 1024, h: 768})
  .then((filePath) => {
    expect(filePath).toBeA('string');
    expect(filePath).toEqual('./tmp/out.png');
  })
```
