import { BigNumber, utils } from 'ethers';
import { bech32 } from 'bech32';

export class FormattingUtils {
  /**
   * Formats a number to a specified number of decimal places
   * with optional grouping and currency symbol
   */
  public static formatNumber(
    value: number | string | BigNumber,
    options: NumberFormatOptions = {}
  ): string {
    const {
      decimals = 2,
      groupSeparator = ',',
      decimalSeparator = '.',
      prefix = '',
      suffix = '',
      padDecimals = false,
      roundingMode = 'ROUND'
    } = options;

    try {
      // Convert to string and split into integer and decimal parts
      const stringValue = BigNumber.from(value).toString();
      const [integerPart, decimalPart = ''] = stringValue.split('.');

      // Format integer part with group separators
      const formattedInteger = this.addGroupSeparators(
        integerPart,
        groupSeparator
      );

      // Format decimal part
      let formattedDecimal = decimalPart;
      if (decimals > 0) {
        formattedDecimal = this.formatDecimalPart(
          decimalPart,
          decimals,
          padDecimals,
          roundingMode
        );
      }

      // Combine parts
      const formattedValue = formattedDecimal
        ? `${formattedInteger}${decimalSeparator}${formattedDecimal}`
        : formattedInteger;

      return `${prefix}${formattedValue}${suffix}`;
    } catch (error) {
      throw new FormattingError('Failed to format number', { value, options });
    }
  }

  /**
   * Formats wei value to ETH with specified decimals
   */
  public static formatEther(
    wei: BigNumber | string | number,
    decimals: number = 6
  ): string {
    try {
      const ethValue = utils.formatEther(wei.toString());
      return this.formatNumber(ethValue, { decimals });
    } catch (error) {
      throw new FormattingError('Failed to format ether value', { wei });
    }
  }

  /**
   * Formats a blockchain address according to chain type
   */
  public static formatAddress(
    address: string,
    options: AddressFormatOptions = {}
  ): string {
    const {
      chainType = 'EVM',
      truncate = false,
      truncateLength = 6,
      checksumFormat = true
    } = options;

    try {
      switch (chainType) {
        case 'EVM':
          let formatted = checksumFormat
            ? utils.getAddress(address)
            : address.toLowerCase();
          if (truncate) {
            formatted = this.truncateAddress(formatted, truncateLength);
          }
          return formatted;

        case 'COSMOS':
          return this.formatCosmosAddress(address, truncate, truncateLength);

        case 'SOLANA':
          return this.formatSolanaAddress(address, truncate, truncateLength);

        default:
          throw new Error(`Unsupported chain type: ${chainType}`);
      }
    } catch (error) {
      throw new FormattingError('Failed to format address', { address, options });
    }
  }

  /**
   * Formats a timestamp into a human-readable date string
   */
  public static formatTimestamp(
    timestamp: number | string | Date,
    options: TimestampFormatOptions = {}
  ): string {
    const {
      format = 'FULL',
      timezone = 'UTC',
      locale = 'en-US'
    } = options;

    try {
      const date = new Date(timestamp);
      
      switch (format) {
        case 'FULL':
          return date.toLocaleString(locale, {
            timeZone: timezone,
            dateStyle: 'full',
            timeStyle: 'long'
          });

        case 'DATE_ONLY':
          return date.toLocaleDateString(locale, {
            timeZone: timezone,
            dateStyle: 'medium'
          });

        case 'TIME_ONLY':
          return date.toLocaleTimeString(locale, {
            timeZone: timezone,
            timeStyle: 'long'
          });

        case 'RELATIVE':
          return this.formatRelativeTime(date);

        default:
          throw new Error(`Unsupported timestamp format: ${format}`);
      }
    } catch (error) {
      throw new FormattingError('Failed to format timestamp', { timestamp, options });
    }
  }

  /**
   * Formats transaction data for display
   */
  public static formatTransactionData(
    data: string,
    options: TransactionDataFormatOptions = {}
  ): string {
    const {
      format = 'HEX',
      prefix = true,
      uppercase = true
    } = options;

    try {
      let formatted = data;

      // Remove 0x prefix if present
      if (formatted.startsWith('0x')) {
        formatted = formatted.slice(2);
      }

      switch (format) {
        case 'HEX':
          formatted = uppercase ? formatted.toUpperCase() : formatted.toLowerCase();
          break;

        case 'BYTES':
          formatted = this.formatAsBytes(formatted);
          break;

        case 'UTF8':
          formatted = this.formatAsUTF8(formatted);
          break;

        default:
          throw new Error(`Unsupported data format: ${format}`);
      }

      return prefix ? `0x${formatted}` : formatted;
    } catch (error) {
      throw new FormattingError('Failed to format transaction data', { data, options });
    }
  }

  /**
   * Formats gas values for display
   */
  public static formatGas(
    value: BigNumber | string | number,
    options: GasFormatOptions = {}
  ): string {
    const {
      format = 'GWEI',
      decimals = 2,
      includeUnit = true
    } = options;

    try {
      let formatted: string;
      const bigValue = BigNumber.from(value);

      switch (format) {
        case 'GWEI':
          formatted = utils.formatUnits(bigValue, 'gwei');
          break;

        case 'WEI':
          formatted = bigValue.toString();
          break;

        default:
          throw new Error(`Unsupported gas format: ${format}`);
      }

      formatted = this.formatNumber(formatted, { decimals });
      return includeUnit ? `${formatted} ${format.toLowerCase()}` : formatted;
    } catch (error) {
      throw new FormattingError('Failed to format gas value', { value, options });
    }
  }

  // Private helper methods
  private static addGroupSeparators(
    integerPart: string,
    separator: string
  ): string {
    return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  private static formatDecimalPart(
    decimalPart: string,
    decimals: number,
    padDecimals: boolean,
    roundingMode: RoundingMode
  ): string {
    if (decimalPart.length <= decimals) {
      return padDecimals
        ? decimalPart.padEnd(decimals, '0')
        : decimalPart;
    }

    switch (roundingMode) {
      case 'ROUND':
        return this.roundDecimal(decimalPart, decimals);
      case 'TRUNCATE':
        return decimalPart.slice(0, decimals);
      case 'CEIL':
        return this.ceilDecimal(decimalPart, decimals);
      case 'FLOOR':
        return decimalPart.slice(0, decimals);
      default:
        throw new Error(`Unsupported rounding mode: ${roundingMode}`);
    }
  }

  private static roundDecimal(decimal: string, places: number): string {
    const digit = parseInt(decimal[places]);
    if (digit >= 5) {
      // Implement rounding logic
      return decimal.slice(0, places);
    }
    return decimal.slice(0, places);
  }

  private static ceilDecimal(decimal: string, places: number): string {
    // Implement ceiling logic
    return decimal.slice(0, places);
  }

  private static formatCosmosAddress(
    address: string,
    truncate: boolean,
    truncateLength: number
  ): string {
    const decoded = bech32.decode(address);
    const formatted = bech32.encode(decoded.prefix, decoded.words);
    return truncate ? this.truncateAddress(formatted, truncateLength) : formatted;
  }

  private static formatSolanaAddress(
    address: string,
    truncate: boolean,
    truncateLength: number
  ): string {
    return truncate ? this.truncateAddress(address, truncateLength) : address;
  }

  private static truncateAddress(
    address: string,
    truncateLength: number
  ): string {
    return `${address.slice(0, truncateLength)}...${address.slice(-truncateLength)}`;
  }

  private static formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  }

  private static formatAsBytes(hex: string): string {
    const bytes: string[] = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(hex.slice(i, i + 2));
    }
    return bytes.join(' ');
  }

  private static formatAsUTF8(hex: string): string {
    const bytes = Buffer.from(hex, 'hex');
    return bytes.toString('utf8');
  }
}

// Types and Interfaces
interface NumberFormatOptions {
  decimals?: number;
  groupSeparator?: string;
  decimalSeparator?: string;
  prefix?: string;
  suffix?: string;
  padDecimals?: boolean;
  roundingMode?: RoundingMode;
}

interface AddressFormatOptions {
  chainType?: ChainType;
  truncate?: boolean;
  truncateLength?: number;
  checksumFormat?: boolean;
}

interface TimestampFormatOptions {
  format?: TimestampFormat;
  timezone?: string;
  locale?: string;
}

interface TransactionDataFormatOptions {
  format?: DataFormat;
  prefix?: boolean;
  uppercase?: boolean;
}

interface GasFormatOptions {
  format?: GasFormat;
  decimals?: number;
  includeUnit?: boolean;
}

type ChainType = 'EVM' | 'COSMOS' | 'SOLANA';
type RoundingMode = 'ROUND' | 'TRUNCATE' | 'CEIL' | 'FLOOR';
type TimestampFormat = 'FULL' | 'DATE_ONLY' | 'TIME_ONLY' | 'RELATIVE';
type DataFormat = 'HEX' | 'BYTES' | 'UTF8';
type GasFormat = 'GWEI' | 'WEI';

// Error Classes
class FormattingError extends Error {
  constructor(
    message: string,
    public readonly context: Record<string, unknown>
  ) {
    super(message);
    this.name = 'FormattingError';
  }
}