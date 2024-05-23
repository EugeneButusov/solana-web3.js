import * as BufferLayout from '@solana/buffer-layout';

import {
  decodeData,
  InstructionType,
  IInstructionInputData,
} from '../instruction';
import { PublicKey } from '../publickey';
import { TransactionInstruction } from '../transaction';

export type WriteBpfLoaderParams = {
  account: PublicKey;
  offset: number;
  bytes: Uint8Array;
};

export type FinalizeBpfLoaderParams = {
  account: PublicKey;
};

/**
 * BPF loader Instruction class
 */
export class BpfLoaderInstruction {
  /**
   * @internal
   */
  constructor() {}

  /**
   * Decode a bpf loader instruction and retrieve the instruction type.
   */
  static decodeInstructionType(
    instruction: TransactionInstruction,
  ): BpfLoaderInstructionType {
    this.checkProgramId(instruction.programId);

    const instructionTypeLayout = BufferLayout.u32('instruction');
    const typeIndex = instructionTypeLayout.decode(instruction.data);

    let type: BpfLoaderInstructionType | undefined;
    for (const [ixType, layout] of Object.entries(BPF_LOADER_INSTRUCTION_LAYOUTS)) {
      if (layout.index == typeIndex) {
        type = ixType as BpfLoaderInstructionType;
        break;
      }
    }

    if (!type) {
      throw new Error('Instruction type incorrect; not a BpfLoaderInstruction');
    }

    return type;
  }

  static decodeWrite(
    instruction: TransactionInstruction,
  ): WriteBpfLoaderParams {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 1);

    const { offset, bytes } = decodeData(
      BPF_LOADER_INSTRUCTION_LAYOUTS.Write,
      instruction.data,
    );

    return {
      account: instruction.keys[0].pubkey,
      offset,
      bytes,
    };
  }

  static decodeFinalize(
      instruction: TransactionInstruction,
  ): FinalizeBpfLoaderParams {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 2);

    decodeData(
      BPF_LOADER_INSTRUCTION_LAYOUTS.Finalize,
      instruction.data,
    );

    return {
      account: instruction.keys[0].pubkey,
    };
  }

  /**
   * @internal
   */
  static checkProgramId(programId: PublicKey) {
    if (!programId.equals(BpfLoaderProgram.programId)) {
      throw new Error('invalid instruction; programId is not BpfLoaderProgram');
    }
  }

  /**
   * @internal
   */
  static checkKeyLength(keys: Array<any>, expectedLength: number) {
    if (keys.length < expectedLength) {
      throw new Error(
        `invalid instruction; found ${keys.length} keys, expected at least ${expectedLength}`,
      );
    }
  }
}

export type BpfLoaderInstructionType = 'Write' | 'Finalize';

type BpfLoaderInstructionInputData = {
  Write: IInstructionInputData & {
    offset: number;
    bytes: Uint8Array;
  };
  Finalize: IInstructionInputData;
};

/**
 * An enumeration of valid bpf-loader InstructionType's
 * @internal
 */
export const BPF_LOADER_INSTRUCTION_LAYOUTS = Object.freeze<{
  [Instruction in BpfLoaderInstructionType]: InstructionType<
    BpfLoaderInstructionInputData[Instruction]
  >;
}>({
  Write: {
    index: 0,
    layout: BufferLayout.struct<BpfLoaderInstructionInputData['Write']>([
      BufferLayout.u32('instruction'),
      BufferLayout.u32('offset'),
      BufferLayout.blob(BufferLayout.greedy(BufferLayout.u8().span), 'bytes'),
    ]),
  },
  Finalize: {
    index: 0,
    layout: BufferLayout.struct<BpfLoaderInstructionInputData['Finalize']>([
      BufferLayout.u32('instruction'),
    ]),
  }
});

/**
 * Factory class for transactions to interact with the BPF loader program
 */
export class BpfLoaderProgram {
  /**
   * @internal
   */
  constructor() {}

  /**
   * Public key that identifies the BPF loader program
   */
  static programId: PublicKey = new PublicKey(
    'BPFLoader2111111111111111111111111111111111',
  );
}
