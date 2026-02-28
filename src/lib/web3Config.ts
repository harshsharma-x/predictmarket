import { http } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// ── Environment ───────────────────────────────────────────────────────────────

const walletConnectProjectId =
  process.env['NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'] ?? 'placeholder_project_id';

if (
  !process.env['NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'] ||
  process.env['NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'] === 'your_walletconnect_project_id_here'
) {
  console.warn(
    '[web3Config] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. ' +
      'WalletConnect features will not work. Get a project ID at https://cloud.walletconnect.com'
  );
}

const polygonRpcUrl =
  process.env['NEXT_PUBLIC_POLYGON_RPC_URL'] ?? 'https://polygon-rpc.com';

const mumbaiRpcUrl =
  process.env['NEXT_PUBLIC_MUMBAI_RPC_URL'] ?? 'https://rpc-mumbai.maticvigil.com';

// ── Supported Chains ──────────────────────────────────────────────────────────

export const SUPPORTED_CHAINS = [polygon, polygonMumbai] as const;

export type SupportedChain = (typeof SUPPORTED_CHAINS)[number];

// ── Wagmi + RainbowKit Config ─────────────────────────────────────────────────

export const wagmiConfig = getDefaultConfig({
  appName: 'PredictMarket',
  projectId: walletConnectProjectId ?? '',
  chains: SUPPORTED_CHAINS,
  transports: {
    [polygon.id]: http(polygonRpcUrl),
    [polygonMumbai.id]: http(mumbaiRpcUrl),
  },
  ssr: true,
});

// ── RainbowKit Theme overrides are applied in layout.tsx via theme prop ────────

// ── Chain helpers ─────────────────────────────────────────────────────────────

export function isMainnet(chainId?: number): boolean {
  return chainId === polygon.id;
}

export function isTestnet(chainId?: number): boolean {
  return chainId === polygonMumbai.id;
}

export function getBlockExplorerUrl(chainId?: number): string {
  if (chainId === polygonMumbai.id) return 'https://mumbai.polygonscan.com';
  return 'https://polygonscan.com';
}

export function getTxUrl(txHash: string, chainId?: number): string {
  return `${getBlockExplorerUrl(chainId)}/tx/${txHash}`;
}

export function getAddressUrl(address: string, chainId?: number): string {
  return `${getBlockExplorerUrl(chainId)}/address/${address}`;
}

export function getChainName(chainId?: number): string {
  if (chainId === polygon.id) return 'Polygon';
  if (chainId === polygonMumbai.id) return 'Mumbai Testnet';
  return 'Unknown Network';
}

// ── USDC Token Info ───────────────────────────────────────────────────────────

export const USDC_TOKEN = {
  [polygon.id]: {
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' as `0x${string}`,
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin (PoS)',
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  },
  [polygonMumbai.id]: {
    address: '0x0FA8781a83E46826621b3BC094Ea2A0212e71B23' as `0x${string}`,
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin (Mumbai)',
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  },
} as const;

export type ChainId = keyof typeof USDC_TOKEN;

export function getUsdcAddress(chainId: number): `0x${string}` {
  const token = USDC_TOKEN[chainId as ChainId];
  return token?.address ?? ('0x0000000000000000000000000000000000000000' as `0x${string}`);
}

// ── ERC-20 minimal ABI (for balance/allowance reads) ─────────────────────────

export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;
