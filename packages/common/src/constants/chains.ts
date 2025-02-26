export const CHAIN_CONFIGURATIONS: Record<string, ChainConfig> = {
  // Ethereum and L2s
  'ethereum-mainnet': {
    id: 1,
    name: 'Ethereum Mainnet',
    type: 'EVM',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: [
      'https://mainnet.infura.io/v3/${INFURA_API_KEY}',
      'https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}'
    ],
    blockExplorers: {
      default: {
        name: 'Etherscan',
        url: 'https://etherscan.io'
      }
    },
    networkParameters: {
      averageBlockTime: 12,
      chainId: '0x1',
      networkId: 1,
      gasPrice: {
        default: '30000000000',
        max: '100000000000'
      }
    }
  },
  'arbitrum-one': {
    id: 42161,
    name: 'Arbitrum One',
    type: 'EVM',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: [
      'https://arb1.arbitrum.io/rpc',
      'https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}'
    ],
    blockExplorers: {
      default: {
        name: 'Arbiscan',
        url: 'https://arbiscan.io'
      }
    },
    networkParameters: {
      averageBlockTime: 0.25,
      chainId: '0xa4b1',
      networkId: 42161
    }
  },

  // Cosmos Ecosystem
  'cosmos-hub': {
    id: 'cosmoshub-4',
    name: 'Cosmos Hub',
    type: 'COSMOS',
    nativeCurrency: {
      name: 'Atom',
      symbol: 'ATOM',
      decimals: 6
    },
    rpcUrls: [
      'https://rpc.cosmos.network',
      'https://cosmos-rpc.polkachu.com'
    ],
    restUrls: [
      'https://api.cosmos.network',
      'https://cosmos-api.polkachu.com'
    ],
    blockExplorers: {
      default: {
        name: 'Mintscan',
        url: 'https://www.mintscan.io/cosmos'
      }
    },
    networkParameters: {
      averageBlockTime: 6.85,
      chainId: 'cosmoshub-4',
      addressPrefix: 'cosmos',
      validatorPrefix: 'cosmosvaloper'
    },
    ibcConfiguration: {
      enabled: true,
      timeoutHeight: 1000,
      timeoutTimestamp: 1800,
      maxTxSize: 2097152
    }
  },
  'osmosis': {
    id: 'osmosis-1',
    name: 'Osmosis',
    type: 'COSMOS',
    nativeCurrency: {
      name: 'Osmosis',
      symbol: 'OSMO',
      decimals: 6
    },
    rpcUrls: [
      'https://rpc.osmosis.zone',
      'https://osmosis-rpc.polkachu.com'
    ],
    restUrls: [
      'https://lcd.osmosis.zone',
      'https://osmosis-api.polkachu.com'
    ],
    blockExplorers: {
      default: {
        name: 'Mintscan',
        url: 'https://www.mintscan.io/osmosis'
      }
    },
    networkParameters: {
      averageBlockTime: 6,
      chainId: 'osmosis-1',
      addressPrefix: 'osmo',
      validatorPrefix: 'osmovaloper'
    },
    ibcConfiguration: {
      enabled: true,
      timeoutHeight: 1000,
      timeoutTimestamp: 1800,
      maxTxSize: 2097152
    }
  },

  // Solana Networks
  'solana-mainnet': {
    id: '4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
    name: 'Solana Mainnet',
    type: 'SOLANA',
    nativeCurrency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9
    },
    rpcUrls: [
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com'
    ],
    blockExplorers: {
      default: {
        name: 'Solana Explorer',
        url: 'https://explorer.solana.com'
      }
    },
    networkParameters: {
      averageBlockTime: 0.4,
      slotsPerEpoch: 432000,
      stakingEnabled: true,
      maximumTransactionSize: 1232
    }
  }
};

// Network Types and Configurations
export interface ChainConfig {
  id: number | string;
  name: string;
  type: ChainType;
  nativeCurrency: TokenConfig;
  rpcUrls: string[];
  restUrls?: string[];
  blockExplorers: {
    default: ExplorerConfig;
    [key: string]: ExplorerConfig;
  };
  networkParameters: NetworkParameters;
  ibcConfiguration?: IBCConfig;
}

export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ExplorerConfig {
  name: string;
  url: string;
  apiUrl?: string;
  standard?: 'EIP3091' | 'none';
}

export interface NetworkParameters {
  averageBlockTime: number;
  chainId?: string;
  networkId?: number;
  addressPrefix?: string;
  validatorPrefix?: string;
  gasPrice?: GasConfig;
  slotsPerEpoch?: number;
  stakingEnabled?: boolean;
  maximumTransactionSize?: number;
}

export interface GasConfig {
  default: string;
  max?: string;
  priorityFee?: string;
}

export interface IBCConfig {
  enabled: boolean;
  timeoutHeight: number;
  timeoutTimestamp: number;
  maxTxSize: number;
  channels?: IBCChannelConfig[];
}

export interface IBCChannelConfig {
  channelId: string;
  portId: string;
  counterpartyChainId: string;
  counterpartyChannelId: string;
  counterpartyPortId: string;
  ordering: 'ORDERED' | 'UNORDERED';
  version: string;
}

export type ChainType = 'EVM' | 'COSMOS' | 'SOLANA';

// Helper Functions
export function getChainConfig(chainId: string | number): ChainConfig {
  const config = CHAIN_CONFIGURATIONS[chainId.toString()];
  if (!config) {
    throw new Error(`Chain configuration not found for chainId: ${chainId}`);
  }
  return config;
}

export function isSupportedChain(chainId: string | number): boolean {
  return chainId.toString() in CHAIN_CONFIGURATIONS;
}

export function getChainsByType(type: ChainType): ChainConfig[] {
  return Object.values(CHAIN_CONFIGURATIONS).filter(
    chain => chain.type === type
  );
}

export function getChainRpcUrl(
  chainId: string | number,
  index: number = 0
): string {
  const config = getChainConfig(chainId);
  if (!config.rpcUrls || config.rpcUrls.length === 0) {
    throw new Error(`No RPC URLs configured for chainId: ${chainId}`);
  }
  return config.rpcUrls[index % config.rpcUrls.length];
}

export function getExplorerUrl(
  chainId: string | number,
  explorerKey: string = 'default'
): string {
  const config = getChainConfig(chainId);
  const explorer = config.blockExplorers[explorerKey];
  if (!explorer) {
    throw new Error(
      `Explorer not found for chainId: ${chainId}, key: ${explorerKey}`
    );
  }
  return explorer.url;
}