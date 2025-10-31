declare module "browser-id3-writer" {
  export class ID3Writer {
    constructor(arrayBuffer: ArrayBuffer | Uint8Array);
    setFrame(frame: string, value: any): ID3Writer;
    addTag(): void;
    getBlob(): Blob;
  }
}
