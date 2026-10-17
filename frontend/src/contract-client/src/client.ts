import {Evidence} from './types.js';
import {Spec, AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions, ExternalExecutableRef} from '@stellar/stellar-sdk/contract';
import {Address} from '@stellar/stellar-sdk';

export interface Client {
  /**
   * Indica si una huella ya está registrada.
   */
  exists(args: { decision_hash: Uint8Array }, options?: MethodOptions): Promise<AssembledTransaction<boolean>>;
  /**
   * Recupera la evidencia asociada a un hash.
   */
  get_decision(args: { decision_hash: Uint8Array }, options?: MethodOptions): Promise<AssembledTransaction<Evidence | null>>;
  /**
   * Registra una huella SHA-256 de 32 bytes.
   *
   * Devuelve:
   * - true: la evidencia fue registrada.
   * - false: ese hash ya existía y no fue sobrescrito.
   */
  register_decision(args: { owner: string | Address; decision_hash: Uint8Array }, options?: MethodOptions): Promise<AssembledTransaction<boolean>>;
}

export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new Spec(["AAAAAQAAAAAAAAAAAAAACEV2aWRlbmNlAAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAA1yZWdpc3RlcmVkX2F0AAAAAAAABg==", "AAAAAAAAAClJbmRpY2Egc2kgdW5hIGh1ZWxsYSB5YSBlc3TDoSByZWdpc3RyYWRhLgAAAAAAAAZleGlzdHMAAAAAAAEAAAAAAAAADWRlY2lzaW9uX2hhc2gAAAAAAAPuAAAAIAAAAAEAAAAB", "AAAAAAAAAClSZWN1cGVyYSBsYSBldmlkZW5jaWEgYXNvY2lhZGEgYSB1biBoYXNoLgAAAAAAAAxnZXRfZGVjaXNpb24AAAABAAAAAAAAAA1kZWNpc2lvbl9oYXNoAAAAAAAD7gAAACAAAAABAAAD6AAAB9AAAAAIRXZpZGVuY2U=", "AAAAAAAAAIxSZWdpc3RyYSB1bmEgaHVlbGxhIFNIQS0yNTYgZGUgMzIgYnl0ZXMuCgpEZXZ1ZWx2ZToKLSB0cnVlOiBsYSBldmlkZW5jaWEgZnVlIHJlZ2lzdHJhZGEuCi0gZmFsc2U6IGVzZSBoYXNoIHlhIGV4aXN0w61hIHkgbm8gZnVlIHNvYnJlc2NyaXRvLgAAABFyZWdpc3Rlcl9kZWNpc2lvbgAAAAAAAAIAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAANZGVjaXNpb25faGFzaAAAAAAAA+4AAAAgAAAAAQAAAAE="]),
      options
    );
  }

   static deploy<T = Client>(options: MethodOptions & Omit<ContractClientOptions, 'contractId'> & { salt?: Uint8Array; address?: string; } & ({ wasmHash: Uint8Array | string; format?: "hex" | "base64"; externalRef?: never; } | { externalRef: ExternalExecutableRef; wasmHash?: never; format?: never; })): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options);
  }
  public readonly fromJson = {
    exists : this.txFromJson<boolean>,  get_decision : this.txFromJson<Evidence | null>,  register_decision : this.txFromJson<boolean>
  };

  /** @deprecated Use fromJson instead. */
  public readonly fromJSON = this.fromJson;

}