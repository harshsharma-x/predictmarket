// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IPredictionMarket - External interface for PredictionMarket contracts
interface IPredictionMarket {
    // ── Structs ───────────────────────────────────────────────────────────────

    struct MarketInfo {
        string question;
        string description;
        string category;
        uint256 resolutionDate;
        address creator;
        uint256 yesShares;
        uint256 noShares;
        uint256 totalVolume;
        bool resolved;
        bool outcome; // true = YES, false = NO
        address collateralToken;
    }

    // ── Events ────────────────────────────────────────────────────────────────

    event MarketCreated(
        address indexed market,
        address indexed creator,
        string question,
        uint256 resolutionDate,
        address collateralToken
    );

    event SharesPurchased(
        address indexed buyer,
        bool isYes,
        uint256 amountIn,
        uint256 sharesOut,
        uint256 newYesPrice
    );

    event MarketResolved(bool outcome, uint256 timestamp);

    event WinningsClaimed(
        address indexed claimer,
        uint256 shares,
        uint256 payout
    );

    // ── Functions ─────────────────────────────────────────────────────────────

    function buyShares(bool isYes, uint256 amountIn, uint256 minSharesOut) external;

    function resolveMarket(bool _outcome) external;

    function claimWinnings() external;

    function getMarketInfo() external view returns (MarketInfo memory);

    function getShares(address user) external view returns (uint256 yesShares, uint256 noShares);

    function getYesPrice() external view returns (uint256);

    function getNoPrice() external view returns (uint256);

    function initialize(
        string calldata _question,
        string calldata _description,
        string calldata _category,
        uint256 _resolutionDate,
        address _creator,
        address _collateralToken,
        address _owner
    ) external;
}
