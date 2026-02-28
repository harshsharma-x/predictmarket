// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PredictionMarket.sol";

/// @title MarketFactory
/// @notice Deploys and tracks PredictionMarket instances
contract MarketFactory is ReentrancyGuard, Ownable {
    // ── State ─────────────────────────────────────────────────────────────────

    /// @dev All deployed market addresses in creation order
    address[] private _allMarkets;

    /// @dev creator → list of markets they created
    mapping(address => address[]) private _marketsByCreator;

    /// @dev Address → is a legitimate market deployed by this factory
    mapping(address => bool) public isMarket;

    // ── Events ────────────────────────────────────────────────────────────────

    event MarketDeployed(
        address indexed market,
        address indexed creator,
        string question,
        uint256 resolutionDate,
        address collateralToken,
        uint256 marketIndex
    );

    // ── Constructor ───────────────────────────────────────────────────────────

    constructor(address initialOwner) Ownable(initialOwner) {}

    // ── Market Creation ───────────────────────────────────────────────────────

    /// @notice Deploy a new PredictionMarket.
    /// @param question         Human-readable yes/no question
    /// @param description      Longer description / resolution criteria
    /// @param category         Category string (e.g. "Crypto")
    /// @param resolutionDate   Unix timestamp after which the market can be resolved
    /// @param collateralToken  ERC-20 token used as collateral (e.g. USDC)
    /// @return market Address of the newly deployed PredictionMarket
    function createMarket(
        string calldata question,
        string calldata description,
        string calldata category,
        uint256 resolutionDate,
        address collateralToken
    ) external nonReentrant returns (address market) {
        require(bytes(question).length > 0, "Empty question");
        require(resolutionDate > block.timestamp, "Resolution in the past");
        require(collateralToken != address(0), "Invalid token address");

        PredictionMarket pm = new PredictionMarket();

        pm.initialize(
            question,
            description,
            category,
            resolutionDate,
            msg.sender,
            collateralToken,
            owner()           // factory owner becomes market owner (can resolve)
        );

        market = address(pm);
        _allMarkets.push(market);
        _marketsByCreator[msg.sender].push(market);
        isMarket[market] = true;

        emit MarketDeployed(
            market,
            msg.sender,
            question,
            resolutionDate,
            collateralToken,
            _allMarkets.length - 1
        );
    }

    // ── View Functions ────────────────────────────────────────────────────────

    /// @notice Return all deployed market addresses.
    function getAllMarkets() external view returns (address[] memory) {
        return _allMarkets;
    }

    /// @notice Total number of markets ever deployed.
    function getMarketCount() external view returns (uint256) {
        return _allMarkets.length;
    }

    /// @notice All markets created by a specific address.
    function getMarketsByCreator(address creator)
        external
        view
        returns (address[] memory)
    {
        return _marketsByCreator[creator];
    }

    /// @notice Paginated slice of the markets array.
    function getMarkets(uint256 offset, uint256 limit)
        external
        view
        returns (address[] memory result)
    {
        uint256 total = _allMarkets.length;
        if (offset >= total) return new address[](0);

        uint256 end = offset + limit;
        if (end > total) end = total;

        result = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = _allMarkets[i];
        }
    }
}
