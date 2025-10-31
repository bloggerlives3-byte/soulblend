import lamejs from "lamejs";

export const tagWavBlob = async (wavBlob: Blob) => {
  const buffer = await wavBlob.arrayBuffer();
  const text = "Created with SoulBlend";
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text + "\u0000");
  const needsPadding = textBytes.length % 2 === 1;
  const paddedLength = textBytes.length + (needsPadding ? 1 : 0);
  const listChunkSize = 4 + 8 + paddedLength;

  const totalLength = buffer.byteLength + 8 + listChunkSize;
  const output = new ArrayBuffer(totalLength);
  const outputView = new Uint8Array(output);
  outputView.set(new Uint8Array(buffer), 0);
  const dataView = new DataView(output);

  let offset = buffer.byteLength;
  // 'LIST'
  outputView.set([0x4c, 0x49, 0x53, 0x54], offset);
  offset += 4;

  dataView.setUint32(offset, listChunkSize, true);
  offset += 4;

  // 'INFO'
  outputView.set([0x49, 0x4e, 0x46, 0x4f], offset);
  offset += 4;

  // 'ICMT'
  outputView.set([0x49, 0x43, 0x4d, 0x54], offset);
  offset += 4;

  dataView.setUint32(offset, textBytes.length, true);
  offset += 4;

  outputView.set(textBytes, offset);
  offset += textBytes.length;

  if (needsPadding) {
    outputView[offset] = 0;
    offset += 1;
  }

  // Update RIFF chunk length (bytes 4-7)
  dataView.setUint32(4, totalLength - 8, true);

  return new Blob([output], { type: "audio/wav" });
};

const wavToSamples = (buffer: ArrayBuffer) => {
  const dataView = new DataView(buffer);
  const header = lamejs.WavHeader.readHeader(dataView);

  if (!header.dataOffset || !header.dataLen || !header.channels || !header.sampleRate) {
    throw new Error("Invalid WAV header");
  }

  const samples = buffer.slice(header.dataOffset, header.dataOffset + header.dataLen);
  const sampleBuffer = new Int16Array(samples);

  return {
    channels: header.channels,
    sampleRate: header.sampleRate,
    samples: sampleBuffer
  };
};

export const convertWavBlobToMp3 = async (wavBlob: Blob) => {
  const buffer = await wavBlob.arrayBuffer();
  const { channels, sampleRate, samples } = wavToSamples(buffer);

  const mp3Encoder = new lamejs.Mp3Encoder(channels, sampleRate, 160);
  const sampleBlocks = 1152;

  const left: number[] = [];
  const right: number[] = [];

  for (let i = 0; i < samples.length; i += channels) {
    left.push(samples[i]);
    if (channels > 1) {
      right.push(samples[i + 1]);
    }
  }

  const mp3Data: Int8Array[] = [];

  for (let i = 0; i < left.length; i += sampleBlocks) {
    const leftChunk = left.slice(i, i + sampleBlocks);
    const rightChunk = channels > 1 ? right.slice(i, i + sampleBlocks) : leftChunk;
    const mp3buf = mp3Encoder.encodeBuffer(
      Int16Array.from(leftChunk),
      Int16Array.from(rightChunk)
    );
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  const mp3buf = mp3Encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }

  return new Blob(mp3Data, { type: "audio/mpeg" });
};
