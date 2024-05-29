import { Layout, NearUInt64 } from '@solana/buffer-layout';
import * as BufferLayout from '@solana/buffer-layout';

export class COptionTimestampLayout extends Layout<number | undefined> {
  private timestampLayout: NearUInt64;

  constructor(property?: string | undefined) {
    super(-1, property);
    this.timestampLayout = BufferLayout.nu64();
  }

  decode(buffer: Uint8Array, offset = 0): number | undefined {
    const option = buffer[offset];
    if (option === 0) {
      return undefined;
    }
    return this.timestampLayout.decode(buffer, offset + 1);
  }

  encode(src: number | undefined, buffer: Uint8Array, offset = 0): number {
    if (src === undefined) {
      buffer[offset] = 0;
      return 1;
    } else {
      buffer[offset] = 1;
      this.timestampLayout.encode(src, buffer, offset + 1);
      return 33;
    }
  }

  getSpan(buffer?: Uint8Array, offset = 0): number {
    if (buffer) {
      const option = buffer[offset];
      return option === 0 ? 1 : 1 + this.timestampLayout.span;
    }
    return 1 + this.timestampLayout.span;
  }
}
