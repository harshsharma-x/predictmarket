'use client';

import { useAccount, useChainId, useBalance, useDisconnect } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { formatAddress } from '@/lib/utils';
import { getChainName, getBlockExplorerUrl } from '@/lib/web3Config';

interface UseWeb3Return {
  address: `0x${string}` | undefined;
  shortAddress: string;
  isConnected: boolean;
  chainId: number | undefined;
  chainName: string;
  isCorrectNetwork: boolean;
  isMumbai: boolean;
  isPolygon: boolean;
  nativeBalance: string;
  blockExplorerUrl: string;
  disconnect: () => void;
}

export function useWeb3(): UseWeb3Return {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  const { data: balanceData } = useBalance({
    address,
  });

  const isPolygon = chainId === polygon.id;
  const isMumbai = chainId === polygonMumbai.id;
  const isCorrectNetwork = isPolygon || isMumbai;

  const shortAddress = address ? formatAddress(address) : '';
  const chainName = getChainName(chainId);
  const blockExplorerUrl = getBlockExplorerUrl(chainId);

  const nativeBalance = balanceData
    ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`
    : '0 MATIC';

  return {
    address,
    shortAddress,
    isConnected,
    chainId,
    chainName,
    isCorrectNetwork,
    isMumbai,
    isPolygon,
    nativeBalance,
    blockExplorerUrl,
    disconnect,
  };
}
