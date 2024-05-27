import * as BufferLayout from '@solana/buffer-layout';

import {
  decodeData,
  InstructionType,
  IInstructionInputData,
} from '../instruction';
import { PublicKey } from '../publickey';
import { TransactionInstruction } from '../transaction';

export type InitializeBufferBpfUpgradeableLoaderParams = {
  accountPubkey: PublicKey;
  authorityPubkey?: PublicKey;
};

export type WriteBpfUpgradeableLoaderParams = {
  authorityPubkey: PublicKey;
  accountPubkey: PublicKey;
  offset: number;
  bytes: Uint8Array;
};

export type DeployWithMaxDataLenBpfUpgradeableLoaderParams = {
  maxDataLen: number;
  payerAccountPubkey: PublicKey;
  programDataAccountPubkey: PublicKey;
  programAccountPubkey: PublicKey;
  bufferAccountPubkey: PublicKey;
  rentSysvarPubkey: PublicKey;
  clockSysvarPubkey: PublicKey;
  systemProgramPubkey: PublicKey;
  authorityPubkey: PublicKey;
};

export type UpgradeBpfUpgradeableLoaderParams = {
  programDataAccountPubkey: PublicKey;
  programAccountPubkey: PublicKey;
  bufferAccountPubkey: PublicKey;
  spillAccountPubkey: PublicKey;
  rentSysvarPubkey: PublicKey;
  clockSysvarPubkey: PublicKey;
  authorityPubkey: PublicKey;
};

export type SetAuthorityBpfUpgradeableLoaderParams = {
  accountPubkey: PublicKey;
  authorityPubkey: PublicKey;
  newAuthorityPubkey?: PublicKey;
};

export type SetAuthorityCheckedBpfUpgradeableLoaderParams = {
  accountPubkey: PublicKey;
  authorityPubkey: PublicKey;
  newAuthorityPubkey: PublicKey;
};

export type CloseBpfUpgradeableLoaderParams = {
  accountPubkey: PublicKey;
  recipientPubkey: PublicKey;
  authorityPubkey: PublicKey;
  programAccountPubkey: PublicKey;
};

export type ExtendProgramBpfUpgradeableLoaderParams = {
  additionalBytes: number;
  programDataAccountPubkey: PublicKey;
  programAccountPubkey: PublicKey;
  systemProgramPubkey?: PublicKey;
  payerAccountPubkey?: PublicKey;
};

/**
 * BPF loader Instruction class
 */
export class BpfUpgradeableLoaderInstruction {
  /**
   * @internal
   */
  constructor() {}

  /**
   * Decode a bpf loader instruction and retrieve the instruction type.
   */
  static decodeInstructionType(
    instruction: TransactionInstruction,
  ): BpfUpgradeableLoaderInstructionType {
    this.checkProgramId(instruction.programId);

    const instructionTypeLayout = BufferLayout.u32('instruction');
    const typeIndex = instructionTypeLayout.decode(instruction.data);

    let type: BpfUpgradeableLoaderInstructionType | undefined;
    for (const [ixType, layout] of Object.entries(BPF_UPGRADEABLE_LOADER_INSTRUCTION_LAYOUTS)) {
      if (layout.index == typeIndex) {
        type = ixType as BpfUpgradeableLoaderInstructionType;
        break;
      }
    }

    if (!type) {
      throw new Error('Instruction type incorrect; not a BpfLoaderInstruction');
    }

    return type;
  }

  static decodeInitializeBuffer(
    instruction: TransactionInstruction,
  ): InitializeBufferBpfUpgradeableLoaderParams {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 1);

    decodeData(BPF_UPGRADEABLE_LOADER_INSTRUCTION_LAYOUTS.InitializeBuffer, instruction.data,);

    return {
      accountPubkey: instruction.keys[0].pubkey,
      authorityPubkey: instruction.keys[1] && instruction.keys[1].pubkey,
    };
  }

  static decodeWrite(
      instruction: TransactionInstruction,
  ): WriteBpfUpgradeableLoaderParams {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 2);

    const { offset, bytes } = decodeData(
        BPF_UPGRADEABLE_LOADER_INSTRUCTION_LAYOUTS.Write,
        instruction.data,
    );

    return {
      accountPubkey: instruction.keys[0].pubkey,
      authorityPubkey: instruction.keys[1].pubkey,
      offset,
      bytes: new Uint8Array(bytes),
    };
  }

  static decodeDeployWithMaxLen(
      instruction: TransactionInstruction,
  ): DeployWithMaxDataLenBpfUpgradeableLoaderParams {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 8);

    const { maxDataLen } = decodeData(
        BPF_UPGRADEABLE_LOADER_INSTRUCTION_LAYOUTS.DeployWithMaxDataLen,
        instruction.data,
    );

    return {
      maxDataLen,
      payerAccountPubkey: instruction.keys[0].pubkey,
      programDataAccountPubkey: instruction.keys[1].pubkey,
      programAccountPubkey: instruction.keys[2].pubkey,
      bufferAccountPubkey: instruction.keys[3].pubkey,
      rentSysvarPubkey: instruction.keys[4].pubkey,
      clockSysvarPubkey: instruction.keys[5].pubkey,
      systemProgramPubkey: instruction.keys[6].pubkey,
      authorityPubkey: instruction.keys[7].pubkey,
    };
  }

  static decodeUpgrade(
      instruction: TransactionInstruction,
  ): UpgradeBpfUpgradeableLoaderParams {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 7);

    decodeData(
      BPF_UPGRADEABLE_LOADER_INSTRUCTION_LAYOUTS.Upgrade,
      instruction.data,
    );

    return {
      programDataAccountPubkey: instruction.keys[0].pubkey,
      programAccountPubkey: instruction.keys[1].pubkey,
      bufferAccountPubkey: instruction.keys[2].pubkey,
      spillAccountPubkey: instruction.keys[3].pubkey,
      rentSysvarPubkey: instruction.keys[4].pubkey,
      clockSysvarPubkey: instruction.keys[5].pubkey,
      authorityPubkey: instruction.keys[6].pubkey,
    };
  }

  static decodeSetAuthority(
      instruction: TransactionInstruction,
  ): SetAuthorityBpfUpgradeableLoaderParams {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 2);

    decodeData(
      BPF_UPGRADEABLE_LOADER_INSTRUCTION_LAYOUTS.SetAuthority,
      instruction.data,
    );

    return {
      accountPubkey: instruction.keys[0].pubkey,
      authorityPubkey: instruction.keys[1].pubkey,
      newAuthorityPubkey: instruction.keys[2] && instruction.keys[2].pubkey,
    };
  }

  static decodeSetAuthorityChecked(
      instruction: TransactionInstruction,
  ): SetAuthorityCheckedBpfUpgradeableLoaderParams {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);

    decodeData(
      BPF_UPGRADEABLE_LOADER_INSTRUCTION_LAYOUTS.SetAuthorityChecked,
      instruction.data,
    );

    return {
      accountPubkey: instruction.keys[0].pubkey,
      authorityPubkey: instruction.keys[1].pubkey,
      newAuthorityPubkey: instruction.keys[2].pubkey,
    };
  }

  static decodeClose(
      instruction: TransactionInstruction,
  ): CloseBpfUpgradeableLoaderParams {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);

    decodeData(
      BPF_UPGRADEABLE_LOADER_INSTRUCTION_LAYOUTS.Close,
      instruction.data,
    );

    return {
      accountPubkey: instruction.keys[0].pubkey,
      recipientPubkey: instruction.keys[1].pubkey,
      authorityPubkey: instruction.keys[2].pubkey,
      programAccountPubkey: instruction.keys[3] && instruction.keys[3].pubkey,
    };
  }

  static decodeExtendProgram(
      instruction: TransactionInstruction,
  ): ExtendProgramBpfUpgradeableLoaderParams {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 1);

    const { additionalBytes } = decodeData(
        BPF_UPGRADEABLE_LOADER_INSTRUCTION_LAYOUTS.ExtendProgram,
        instruction.data,
    );

    return {
      additionalBytes,
      programDataAccountPubkey: instruction.keys[0].pubkey,
      programAccountPubkey: instruction.keys[1].pubkey,
      systemProgramPubkey: instruction.keys[2] && instruction.keys[2].pubkey,
      payerAccountPubkey: instruction.keys[3] && instruction.keys[3].pubkey,
    };
  }

  /**
   * @internal
   */
  static checkProgramId(programId: PublicKey) {
    if (!programId.equals(BpfUpgradeableLoaderProgram.programId)) {
      throw new Error('invalid instruction; programId is not BpfUpgradeableLoaderProgram');
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

export type BpfUpgradeableLoaderInstructionType =
  | 'InitializeBuffer'
  | 'Write'
  | 'DeployWithMaxDataLen'
  | 'Upgrade'
  | 'SetAuthority'
  | 'SetAuthorityChecked'
  | 'Close'
  | 'ExtendProgram';

type BpfUpgradeableLoaderInstructionInputData = {
  InitializeBuffer: IInstructionInputData;
  Write: IInstructionInputData & {
    offset: number;
    bytesLength: number;
    bytesLengthPadding: number;
    bytes: number[];
  };
  DeployWithMaxDataLen: IInstructionInputData & {
    maxDataLen: number;
  };
  Upgrade: IInstructionInputData;
  SetAuthority: IInstructionInputData;
  SetAuthorityChecked: IInstructionInputData;
  Close: IInstructionInputData;
  ExtendProgram: IInstructionInputData & {
    additionalBytes: number;
  };
};

/**
 * An enumeration of valid bpf-loader InstructionType's
 * @internal
 */
export const BPF_UPGRADEABLE_LOADER_INSTRUCTION_LAYOUTS = Object.freeze<{
  [Instruction in BpfUpgradeableLoaderInstructionType]: InstructionType<
    BpfUpgradeableLoaderInstructionInputData[Instruction]
  >;
}>({
  InitializeBuffer: {
    index: 0,
    layout: BufferLayout.struct<BpfUpgradeableLoaderInstructionInputData['InitializeBuffer']>([
      BufferLayout.u32('instruction'),
    ]),
  },
  Write: {
    index: 1,
    layout: BufferLayout.struct<BpfUpgradeableLoaderInstructionInputData['Write']>([
      BufferLayout.u32('instruction'),
      BufferLayout.u32('offset'),
      BufferLayout.u32('bytesLength'),
      BufferLayout.u32('bytesLengthPadding'),
      BufferLayout.seq(
          BufferLayout.u8('byte'),
          BufferLayout.offset(BufferLayout.u32(), -8),
          'bytes',
      ),
    ]),
  },
  DeployWithMaxDataLen: {
    index: 2,
    layout: BufferLayout.struct<BpfUpgradeableLoaderInstructionInputData['DeployWithMaxDataLen']>([
      BufferLayout.u32('instruction'),
      BufferLayout.u32('maxDataLen'),
    ]),
  },
  Upgrade: {
    index: 3,
    layout: BufferLayout.struct<BpfUpgradeableLoaderInstructionInputData['Upgrade']>([
      BufferLayout.u32('instruction'),
    ]),
  },
  SetAuthority: {
    index: 4,
    layout: BufferLayout.struct<BpfUpgradeableLoaderInstructionInputData['SetAuthority']>([
      BufferLayout.u32('instruction'),
    ]),
  },
  SetAuthorityChecked: {
    index: 5,
    layout: BufferLayout.struct<BpfUpgradeableLoaderInstructionInputData['SetAuthorityChecked']>([
      BufferLayout.u32('instruction'),
    ]),
  },
  Close: {
    index: 6,
    layout: BufferLayout.struct<BpfUpgradeableLoaderInstructionInputData['Close']>([
      BufferLayout.u32('instruction'),
    ]),
  },
  ExtendProgram: {
    index: 7,
    layout: BufferLayout.struct<BpfUpgradeableLoaderInstructionInputData['ExtendProgram']>([
      BufferLayout.u32('instruction'),
      BufferLayout.u32('additionalBytes'),
    ]),
  },
});

/**
 * Factory class for transactions to interact with the BPF loader program
 */
export class BpfUpgradeableLoaderProgram {
  /**
   * @internal
   */
  constructor() {}

  /**
   * Public key that identifies the BPF loader program
   */
  static programId: PublicKey = new PublicKey(
    'BPFLoaderUpgradeab1e11111111111111111111111',
  );
}
