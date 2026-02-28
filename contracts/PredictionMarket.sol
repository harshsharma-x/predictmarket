// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IPredictionMarket.sol";

/// @title PredictionMarket
/// @notice AMM-based binary prediction market (YES / NO outcomes)
/// @dev Uses a constant-product AMM (x * y = k).  Initial liquidity is
///      seeded with 1 000 virtual shares on each side so that pricing is
///      well-defined before real trades arrive.
contract PredictionMarket is IPredictionMarket, ReentrancyGuard, Ownable {
    // ── Constants ─────────────────────────────────────────────────────────────

    /// @dev 2 % protocol fee (200 basis points)
    uint256 public constant FEE_BPS = 200;
    uint256 public constant BPS_DENOM = 10_000;

    /// @dev Virtual liquidity seeded at initialisation (1 000 shares each)
    uint256 public constant INITIAL_LIQUIDITY = 1_000 * 1e18;

    // ── State ─────────────────────────────────────────────────────────────────

    MarketInfo private _market;

    /// @dev AMM reserves (include virtual + real liquidity)
    uint256 public yesReserve;
    uint256 public noReserve;

    /// @dev Accumulated protocol fees (denominated in collateral token)
    uint256 public feesCollected;

    /// @dev Share balances per user
    mapping(address => uint256) public yesSharesOf;
    mapping(address => uint256) public noSharesOf;

    bool private _initialized;

    // ── Constructor ───────────────────────────────────────────────────────────

    /// @dev Ownable requires an initial owner; the factory passes the real
    ///      owner via `initialize` so we use address(1) as a placeholder and
    ///      transfer immediately.
    constructor() Ownable(address(this)) {}

    // ── Initialiser ───────────────────────────────────────────────────────────

    /// @notice One-shot initialiser called by the factory right after `new`.
    function initialize(
        string calldata _question,
        string calldata _description,
        string calldata _category,
        uint256 _resolutionDate,
        address _creator,
        address _collateralToken,
        address _owner
    ) external override {
        require(!_initialized, "Already initialized");
        require(_resolutionDate > block.timestamp, "Resolution in the past");
        require(_collateralToken != address(0), "Invalid token");
        require(_creator != address(0), "Invalid creator");
        require(_owner != address(0), "Invalid owner");

        _initialized = true;

        _market.question = _question;
        _market.description = _description;
        _market.category = _category;
        _market.resolutionDate = _resolutionDate;
        _market.creator = _creator;
        _market.collateralToken = _collateralToken;
        _market.resolved = false;

        // Seed virtual AMM liquidity
        yesReserve = INITIAL_LIQUIDITY;
        noReserve  = INITIAL_LIQUIDITY;

        // Transfer ownership to factory owner
        _transferOwnership(_owner);

        emit MarketCreated(
            address(this),
            _creator,
            _question,
            _resolutionDate,
            _collateralToken
        );
    }

    // ── Trading ───────────────────────────────────────────────────────────────

    /// @notice Buy YES or NO shares using the collateral token.
    /// @param isYes          true → buy YES shares, false → buy NO shares
    /// @param amountIn       Gross collateral amount (includes fee)
    /// @param minSharesOut   Minimum shares to receive (slippage guard)
    function buyShares(
        bool isYes,
        uint256 amountIn,
        uint256 minSharesOut
    ) external override nonReentrant {
        require(_initialized, "Not initialized");
        require(!_market.resolved, "Market resolved");
        require(block.timestamp < _market.resolutionDate, "Market expired");
        require(amountIn > 0, "Zero amount");

        // Pull collateral from caller
        IERC20(_market.collateralToken).transferFrom(msg.sender, address(this), amountIn);

        // Deduct 2 % fee
        uint256 fee = (amountIn * FEE_BPS) / BPS_DENOM;
        uint256 netAmount = amountIn - fee;
        feesCollected += fee;

        // AMM: x * y = k  →  sharesOut = reserve_out - k / (reserve_in + netAmount)
        uint256 sharesOut;
        if (isYes) {
            sharesOut = _getAmountOut(netAmount, noReserve, yesReserve);
            noReserve  += netAmount;
            yesReserve -= sharesOut;
            yesSharesOf[msg.sender] += sharesOut;
            _market.yesShares += sharesOut;
        } else {
            sharesOut = _getAmountOut(netAmount, yesReserve, noReserve);
            yesReserve += netAmount;
            noReserve  -= sharesOut;
            noSharesOf[msg.sender] += sharesOut;
            _market.noShares += sharesOut;
        }

        require(sharesOut >= minSharesOut, "Slippage exceeded");

        _market.totalVolume += amountIn;

        uint256 newYesPrice = getYesPrice();

        emit SharesPurchased(msg.sender, isYes, amountIn, sharesOut, newYesPrice);
    }

    // ── Resolution ────────────────────────────────────────────────────────────

    /// @notice Resolve the market.  Only the owner (factory owner) may call.
    /// @param _outcome true = YES wins, false = NO wins
    function resolveMarket(bool _outcome) external override onlyOwner {
        require(_initialized, "Not initialized");
        require(!_market.resolved, "Already resolved");
        require(block.timestamp >= _market.resolutionDate, "Too early");

        _market.resolved = true;
        _market.outcome  = _outcome;

        emit MarketResolved(_outcome, block.timestamp);
    }

    // ── Claiming ──────────────────────────────────────────────────────────────

    /// @notice Claim winnings after resolution.
    function claimWinnings() external override nonReentrant {
        require(_market.resolved, "Not resolved");

        uint256 winningShares;
        if (_market.outcome) {
            // YES won
            winningShares = yesSharesOf[msg.sender];
            require(winningShares > 0, "No winning shares");
            yesSharesOf[msg.sender] = 0;
        } else {
            // NO won
            winningShares = noSharesOf[msg.sender];
            require(winningShares > 0, "No winning shares");
            noSharesOf[msg.sender] = 0;
        }

        // Each winning share redeems 1 unit of collateral (1e18 normalised)
        uint256 totalWinningShares = _market.outcome
            ? _market.yesShares
            : _market.noShares;
        require(totalWinningShares > 0, "No winning shares exist");

        uint256 pool = IERC20(_market.collateralToken).balanceOf(address(this)) - feesCollected;
        uint256 payout = (winningShares * pool) / totalWinningShares;

        IERC20(_market.collateralToken).transfer(msg.sender, payout);

        emit WinningsClaimed(msg.sender, winningShares, payout);
    }

    // ── Owner Utilities ───────────────────────────────────────────────────────

    /// @notice Withdraw accumulated protocol fees.
    function withdrawFees(address recipient) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        uint256 amount = feesCollected;
        require(amount > 0, "No fees");
        feesCollected = 0;
        IERC20(_market.collateralToken).transfer(recipient, amount);
    }

    // ── View Functions ────────────────────────────────────────────────────────

    function getMarketInfo() external view override returns (MarketInfo memory) {
        return _market;
    }

    function getShares(address user)
        external
        view
        override
        returns (uint256 yes, uint256 no)
    {
        return (yesSharesOf[user], noSharesOf[user]);
    }

    /// @notice YES price as a fraction of 1e18 (i.e. 0.6e18 = 60 %)
    function getYesPrice() public view override returns (uint256) {
        uint256 total = yesReserve + noReserve;
        if (total == 0) return 0.5e18;
        // Price of YES = noReserve / total  (higher noReserve → more demand for YES)
        return (noReserve * 1e18) / total;
    }

    /// @notice NO price as a fraction of 1e18
    function getNoPrice() public view override returns (uint256) {
        return 1e18 - getYesPrice();
    }

    // ── Internal AMM Math ──────────────────────────────────────────────────────

    /// @dev Constant-product output: amountOut = reserveOut - k/(reserveIn+amountIn)
    function _getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256) {
        require(reserveIn > 0 && reserveOut > 0, "Empty reserve");
        uint256 k = reserveIn * reserveOut;
        uint256 newReserveIn = reserveIn + amountIn;
        uint256 newReserveOut = k / newReserveIn;
        require(newReserveOut < reserveOut, "Math underflow");
        return reserveOut - newReserveOut;
    }
}
