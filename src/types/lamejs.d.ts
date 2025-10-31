declare module "lamejs" {
  export namespace WavHeader {
    function readHeader(dataView: DataView): {
      sampleRate: number;
      channels: number;
      dataLen: number;
      dataOffset: number;
    };
  }

  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, kbps: number);
    encodeBuffer(left: Int16Array, right: Int16Array): Int8Array;
    flush(): Int8Array;
  }
}
