"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
exports.getBlockchainService = getBlockchainService;
const ethers_1 = require("ethers");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
class BlockchainService {
    constructor() {
        this.contract = null;
        // Minimal ABI for event listening
        this.contractABI = [
            'event MarketCreated(uint256 indexed marketId, string question, uint256 resolutionDate)',
            'event SharesPurchased(uint256 indexed marketId, address indexed buyer, bool isYes, uint256 shares, uint256 cost)',
            'event MarketResolved(uint256 indexed marketId, bool outcome)',
            'function getMarket(uint256 marketId) view returns (string question, uint256 resolutionDate, bool resolved, bool outcome)',
            'function getPrice(uint256 marketId) view returns (uint256 yesPrice, uint256 noPrice)',
        ];
        this.provider = new ethers_1.ethers.JsonRpcProvider(env_1.config.POLYGON_RPC_URL);
        this.provider.on('error', (err) => {
            logger_1.logger.error({ err }, 'Blockchain provider error');
        });
        if (env_1.config.CONTRACT_ADDRESS) {
            this.contract = new ethers_1.ethers.Contract(env_1.config.CONTRACT_ADDRESS, this.contractABI, this.provider);
            this.setupEventListeners();
        }
        else {
            logger_1.logger.warn('No contract address configured, blockchain features disabled');
        }
    }
    setupEventListeners() {
        if (!this.contract)
            return;
        this.contract.on('MarketCreated', (marketId, question, resolutionDate) => {
            logger_1.logger.info({ marketId: marketId.toString(), question }, 'Blockchain: MarketCreated event');
        });
        this.contract.on('SharesPurchased', (marketId, buyer, isYes, shares, cost) => {
            logger_1.logger.info({
                marketId: marketId.toString(),
                buyer,
                isYes,
                shares: ethers_1.ethers.formatEther(shares),
                cost: ethers_1.ethers.formatEther(cost),
            }, 'Blockchain: SharesPurchased event');
        });
        this.contract.on('MarketResolved', (marketId, outcome) => {
            logger_1.logger.info({ marketId: marketId.toString(), outcome }, 'Blockchain: MarketResolved event');
        });
    }
    async getBlockNumber() {
        return this.provider.getBlockNumber();
    }
    async getMarketFromChain(marketId) {
        if (!this.contract)
            return null;
        try {
            const result = await this.contract.getMarket(marketId);
            return {
                question: result[0],
                resolutionDate: new Date(Number(result[1]) * 1000),
                resolved: result[2],
                outcome: result[3],
            };
        }
        catch (err) {
            logger_1.logger.error({ err, marketId }, 'Failed to get market from blockchain');
            return null;
        }
    }
    async getPriceFromChain(marketId) {
        if (!this.contract)
            return null;
        try {
            const result = await this.contract.getPrice(marketId);
            return {
                yesPrice: Number(ethers_1.ethers.formatEther(result[0])),
                noPrice: Number(ethers_1.ethers.formatEther(result[1])),
            };
        }
        catch (err) {
            logger_1.logger.error({ err, marketId }, 'Failed to get price from blockchain');
            return null;
        }
    }
    isConnected() {
        return this.contract !== null;
    }
}
exports.BlockchainService = BlockchainService;
let blockchainService;
function getBlockchainService() {
    if (!blockchainService) {
        blockchainService = new BlockchainService();
    }
    return blockchainService;
}
//# sourceMappingURL=blockchain.service.js.map