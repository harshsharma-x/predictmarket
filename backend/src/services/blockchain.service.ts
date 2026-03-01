import { ethers } from 'ethers';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract | null = null;

  // Minimal ABI for event listening
  private readonly contractABI = [
    'event MarketCreated(uint256 indexed marketId, string question, uint256 resolutionDate)',
    'event SharesPurchased(uint256 indexed marketId, address indexed buyer, bool isYes, uint256 shares, uint256 cost)',
    'event MarketResolved(uint256 indexed marketId, bool outcome)',
    'function getMarket(uint256 marketId) view returns (string question, uint256 resolutionDate, bool resolved, bool outcome)',
    'function getPrice(uint256 marketId) view returns (uint256 yesPrice, uint256 noPrice)',
  ];

  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.POLYGON_RPC_URL);
    this.provider.on('error', (err) => {
      logger.error({ err }, 'Blockchain provider error');
    });

    if (config.CONTRACT_ADDRESS) {
      this.contract = new ethers.Contract(config.CONTRACT_ADDRESS, this.contractABI, this.provider);
      this.setupEventListeners();
    } else {
      logger.warn('No contract address configured, blockchain features disabled');
    }
  }

  private setupEventListeners(): void {
    if (!this.contract) return;

    this.contract.on('MarketCreated', (marketId: bigint, question: string, resolutionDate: bigint) => {
      logger.info({ marketId: marketId.toString(), question }, 'Blockchain: MarketCreated event');
    });

    this.contract.on('SharesPurchased', (marketId: bigint, buyer: string, isYes: boolean, shares: bigint, cost: bigint) => {
      logger.info({
        marketId: marketId.toString(),
        buyer,
        isYes,
        shares: ethers.formatEther(shares),
        cost: ethers.formatEther(cost),
      }, 'Blockchain: SharesPurchased event');
    });

    this.contract.on('MarketResolved', (marketId: bigint, outcome: boolean) => {
      logger.info({ marketId: marketId.toString(), outcome }, 'Blockchain: MarketResolved event');
    });
  }

  async getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }

  async getMarketFromChain(marketId: string): Promise<{
    question: string;
    resolutionDate: Date;
    resolved: boolean;
    outcome: boolean;
  } | null> {
    if (!this.contract) return null;
    try {
      const result = await this.contract.getMarket(marketId);
      return {
        question: result[0],
        resolutionDate: new Date(Number(result[1]) * 1000),
        resolved: result[2],
        outcome: result[3],
      };
    } catch (err) {
      logger.error({ err, marketId }, 'Failed to get market from blockchain');
      return null;
    }
  }

  async getPriceFromChain(marketId: string): Promise<{ yesPrice: number; noPrice: number } | null> {
    if (!this.contract) return null;
    try {
      const result = await this.contract.getPrice(marketId);
      return {
        yesPrice: Number(ethers.formatEther(result[0])),
        noPrice: Number(ethers.formatEther(result[1])),
      };
    } catch (err) {
      logger.error({ err, marketId }, 'Failed to get price from blockchain');
      return null;
    }
  }

  isConnected(): boolean {
    return this.contract !== null;
  }
}

let blockchainService: BlockchainService;

export function getBlockchainService(): BlockchainService {
  if (!blockchainService) {
    blockchainService = new BlockchainService();
  }
  return blockchainService;
}
