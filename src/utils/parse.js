
export const allocBinaryBuffer = (size) => {
  if (process.versions.node >= '6.0.0') {
    return Buffer.alloc(size);
  }
  return new Buffer(size);
};

export const parseRectAsRGBBuffer = (rect) => {
  const size = rect.width * rect.height * 3;
  const rgb = allocBinaryBuffer(size);
  for (let i = 0; i < size; i += 4) {
    rgb.writeUInt8(rect.data[i + 2], i);
    rgb.writeUInt8(rect.data[i + 1], i + 1);
    rgb.writeUInt8(rect.data[i], i + 2);
  }
  return rgb;
};

export const parseRectAsRGBABuffer = (rect) => {
  const size = rect.width * rect.height * 4;
  const rgba = allocBinaryBuffer(size);
  for (let i = 0; i < size; i += 4) {
    rgba.writeUInt8(rect.data[i + 2], i);
    rgba.writeUInt8(rect.data[i + 1], i + 1);
    rgba.writeUInt8(rect.data[i], i + 2);
    rgba.writeUInt8(255, i + 3);
  }
  return rgba;
};
