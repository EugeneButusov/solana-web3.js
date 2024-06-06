import { Layout, NearUInt64 } from '@solana/buffer-layout';
import * as BufferLayout from '@solana/buffer-layout';

export class COptionLayout<T> extends Layout<T | undefined> {
    private innerLayout: Layout<T>;

    constructor(innerLayout: Layout<T>, property?: string | undefined) {
        super(-1, property);
        this.innerLayout = innerLayout;
    }

    decode(buffer: Uint8Array, offset = 0): T | undefined {
        const option = buffer[offset];
        if (option === 0) {
        return undefined;
        }
        return this.innerLayout.decode(buffer, offset + 1);
    }

    encode(src: T | undefined, buffer: Uint8Array, offset = 0): number {
        if (src === undefined) {
        buffer[offset] = 0;
        return 1;
        } else {
        buffer[offset] = 1;
        return 1 + this.innerLayout.encode(src, buffer, offset + 1);
        }
    }

    getSpan(buffer?: Uint8Array, offset = 0): number {
        if (buffer) {
        const option = buffer[offset];
        return option === 0 ? 1 : 1 + this.innerLayout.getSpan(buffer, offset + 1);
        }
        return 1 + this.innerLayout.span;
    }
}

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

export class CVarintLayout extends Layout<number> {
  constructor(property?: string | undefined) {
    super(-1, property);
  }

  private hasMostSignificantBit(val: number): boolean {
    return (val & 0b10000000) !== 0;
  }

  decode(buffer: Uint8Array, offset = 0): number {
    let bytesRead = 0;
    let shiftAmount = 0;
    let decodedValue = 0;

    do {
      const nextByte = buffer[offset + bytesRead];
      bytesRead += 1;
      decodedValue |= (nextByte & 0b01111111) << shiftAmount;
      if (this.hasMostSignificantBit(nextByte)) {
        shiftAmount += 7;
      } else {
        return decodedValue;
      }
    } while(buffer.length > offset + bytesRead);

    throw new Error('Offset out of range');
  }

  encode(): number {
    throw new Error('Not implemented');
  }

  getSpan(buffer?: Uint8Array, offset = 0): number {
    if (!buffer) {
      throw new Error('getSpan: buffer is required');
    }
    let bytesRead = 0;

    do {
      const nextByte = buffer[offset + bytesRead];
      bytesRead += 1;
      if (!this.hasMostSignificantBit(nextByte)) {
        return bytesRead;
      }
    } while(buffer.length > offset + bytesRead);

    throw new Error('Offset out of range');
  }
}
