import { BigNumber } from 'ethers';

export class ValidationUtils {
  /**
   * Validates an Ethereum address
   * @param address The address to validate
   * @returns boolean indicating if address is valid
   */
  public static isValidEthereumAddress(address: string): boolean {
    if (!address) return false;
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;
    return true;
  }

  /**
   * Validates a Cosmos address for a specific chain prefix
   * @param address The address to validate
   * @param prefix Expected address prefix (e.g., 'cosmos', 'osmo')
   */
  public static isValidCosmosAddress(address: string, prefix: string): boolean {
    if (!address || !prefix) return false;
    const regex = new RegExp(`^${prefix}1[0-9a-zA-Z]{38}$`);
    return regex.test(address);
  }

  /**
   * Validates a Solana public key
   * @param publicKey The public key to validate
   */
  public static isValidSolanaPublicKey(publicKey: string): boolean {
    if (!publicKey) return false;
    return /^[0-9a-zA-Z]{32,44}$/.test(publicKey);
  }

  /**
   * Validates transaction hash format
   * @param hash The transaction hash to validate
   * @param chainType The type of blockchain
   */
  public static isValidTransactionHash(
    hash: string,
    chainType: ChainType
  ): boolean {
    if (!hash) return false;

    switch (chainType) {
      case 'EVM':
        return /^0x[0-9a-fA-F]{64}$/.test(hash);
      case 'COSMOS':
        return /^[0-9A-F]{64}$/.test(hash);
      case 'SOLANA':
        return /^[0-9a-zA-Z]{87,88}$/.test(hash);
      default:
        return false;
    }
  }

  /**
   * Validates amount is within safe numeric bounds
   * @param amount The amount to validate
   * @param maxDecimals Maximum allowed decimal places
   */
  public static isValidAmount(
    amount: string | number | BigNumber,
    maxDecimals: number = 18
  ): boolean {
    try {
      const stringAmount = amount.toString();
      
      // Check for valid numeric format
      if (!/^\d*\.?\d*$/.test(stringAmount)) return false;
      
      // Check decimal places
      const parts = stringAmount.split('.');
      if (parts[1] && parts[1].length > maxDecimals) return false;
      
      // Check if within safe bounds
      const value = BigNumber.from(stringAmount);
      return value.gte(0) && value.lte(ValidationUtils.MAX_SAFE_VALUE);
    } catch {
      return false;
    }
  }

  /**
   * Validates a contract method signature
   * @param signature The method signature to validate
   */
  public static isValidMethodSignature(signature: string): boolean {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*\((|\s*[a-zA-Z_$][a-zA-Z0-9_$]*(\[\])?(\s*,\s*[a-zA-Z_$][a-zA-Z0-9_$]*(\[\])?)*\s*)\)$/.test(signature);
  }

  /**
   * Validates gas parameters
   * @param gasLimit The gas limit to validate
   * @param gasPrice The gas price to validate
   */
  public static isValidGasParams(
    gasLimit?: BigNumber | number | string,
    gasPrice?: BigNumber | number | string
  ): boolean {
    try {
      if (gasLimit) {
        const limit = BigNumber.from(gasLimit);
        if (limit.lte(0) || limit.gt(ValidationUtils.MAX_GAS_LIMIT)) {
          return false;
        }
      }

      if (gasPrice) {
        const price = BigNumber.from(gasPrice);
        if (price.lte(0) || price.gt(ValidationUtils.MAX_GAS_PRICE)) {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validates chain ID
   * @param chainId The chain ID to validate
   */
  public static isValidChainId(chainId: number | string): boolean {
    try {
      const id = BigNumber.from(chainId);
      return id.gt(0) && id.lte(ValidationUtils.MAX_CHAIN_ID);
    } catch {
      return false;
    }
  }

  /**
   * Validates smart contract bytecode
   * @param bytecode The bytecode to validate
   */
  public static isValidBytecode(bytecode: string): boolean {
    if (!bytecode) return false;
    if (!bytecode.startsWith('0x')) return false;
    if (bytecode.length % 2 !== 0) return false;
    return /^0x[0-9a-fA-F]*$/.test(bytecode);
  }

  /**
   * Validates ABI interface format
   * @param abi The ABI to validate
   */
  public static isValidABI(abi: unknown): boolean {
    if (!Array.isArray(abi)) return false;
    
    return abi.every(item => {
      if (typeof item !== 'object' || item === null) return false;
      
      // Check required fields based on type
      switch (item.type) {
        case 'function':
          return this.isValidFunctionABI(item);
        case 'event':
          return this.isValidEventABI(item);
        case 'constructor':
        case 'fallback':
        case 'receive':
          return true;
        default:
          return false;
      }
    });
  }

  private static isValidFunctionABI(item: any): boolean {
    return (
      typeof item.name === 'string' &&
      Array.isArray(item.inputs) &&
      Array.isArray(item.outputs) &&
      typeof item.stateMutability === 'string'
    );
  }

  private static isValidEventABI(item: any): boolean {
    return (
      typeof item.name === 'string' &&
      Array.isArray(item.inputs) &&
      typeof item.anonymous === 'boolean'
    );
  }

  // Constants
  private static readonly MAX_SAFE_VALUE = BigNumber.from('115792089237316195423570985008687907853269984665640564039457584007913129639935'); // 2^256 - 1
  private static readonly MAX_GAS_LIMIT = BigNumber.from('18446744073709551615'); // 2^64 - 1
  private static readonly MAX_GAS_PRICE = BigNumber.from('115792089237316195423570985008687907853269984665640564039457584007913129639935');
  private static readonly MAX_CHAIN_ID = BigNumber.from('115792089237316195423570985008687907853269984665640564039457584007913129639935');
}

// Types
type ChainType = 'EVM' | 'COSMOS' | 'SOLANA';