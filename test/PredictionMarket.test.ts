import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import {
  MarketFactory,
  PredictionMarket,
} from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

// ── Minimal ERC-20 stub deployed inline ──────────────────────────────────────

const ERC20_ABI = [
  "function mint(address to, uint256 amount) external",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];

describe("PredictionMarket", function () {
  let factory: MarketFactory;
  let market: PredictionMarket;
  let token: Awaited<ReturnType<typeof ethers.getContractAt>>;
  let owner: HardhatEthersSigner;
  let creator: HardhatEthersSigner;
  let trader1: HardhatEthersSigner;
  let trader2: HardhatEthersSigner;
  let resolutionDate: number;

  // ── Deploy a simple MintableERC20 for collateral ─────────────────────────
  before(async function () {
    [owner, creator, trader1, trader2] = await ethers.getSigners();

    // Deploy a minimal ERC-20 (uses OpenZeppelin's ERC20 via hardhat)
    const ERC20 = await ethers.getContractFactory("MockERC20");
    token = await ERC20.deploy("Mock USDC", "mUSDC");
    await token.waitForDeployment();

    // Mint tokens to traders
    const amount = ethers.parseEther("100000");
    await token.mint(trader1.address, amount);
    await token.mint(trader2.address, amount);

    // Deploy factory
    const Factory = await ethers.getContractFactory("MarketFactory");
    factory = (await Factory.deploy(owner.address)) as MarketFactory;
    await factory.waitForDeployment();
  });

  describe("Market creation", function () {
    it("should deploy a new market via the factory", async function () {
      resolutionDate = (await time.latest()) + 7 * 24 * 3600; // 1 week

      const tx = await factory
        .connect(creator)
        .createMarket(
          "Will BTC hit $100k?",
          "Resolves YES if BTC > 100 000 USD on Coinbase.",
          "Crypto",
          resolutionDate,
          await token.getAddress()
        );

      const receipt = await tx.wait();
      const event = receipt?.logs
        .map((log) => {
          try {
            return factory.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((e) => e?.name === "MarketDeployed");

      expect(event).to.not.be.undefined;

      const marketAddr = event!.args[0] as string;
      market = (await ethers.getContractAt(
        "PredictionMarket",
        marketAddr
      )) as PredictionMarket;

      expect(await factory.getMarketCount()).to.equal(1);
      expect(await factory.isMarket(marketAddr)).to.be.true;
    });

    it("should store correct market info", async function () {
      const info = await market.getMarketInfo();
      expect(info.question).to.equal("Will BTC hit $100k?");
      expect(info.category).to.equal("Crypto");
      expect(info.creator).to.equal(creator.address);
      expect(info.resolved).to.be.false;
    });

    it("should revert when question is empty", async function () {
      await expect(
        factory.createMarket(
          "",
          "desc",
          "Crypto",
          resolutionDate,
          await token.getAddress()
        )
      ).to.be.revertedWith("Empty question");
    });
  });

  describe("Buying shares", function () {
    const tradeAmount = ethers.parseEther("100"); // 100 tokens

    it("trader1 buys YES shares", async function () {
      await token
        .connect(trader1)
        .approve(await market.getAddress(), ethers.MaxUint256);

      const before = await token.balanceOf(trader1.address);

      await expect(market.connect(trader1).buyShares(true, tradeAmount, 0))
        .to.emit(market, "SharesPurchased")
        .withArgs(
          trader1.address,
          true,
          tradeAmount,
          /* sharesOut – any */ (v: bigint) => v > 0n,
          /* newYesPrice – any */ (v: bigint) => v > 0n
        );

      const after = await token.balanceOf(trader1.address);
      expect(before - after).to.equal(tradeAmount);

      const [yes] = await market.getShares(trader1.address);
      expect(yes).to.be.gt(0n);
    });

    it("trader2 buys NO shares", async function () {
      await token
        .connect(trader2)
        .approve(await market.getAddress(), ethers.MaxUint256);

      await market.connect(trader2).buyShares(false, tradeAmount, 0);

      const [, no] = await market.getShares(trader2.address);
      expect(no).to.be.gt(0n);
    });

    it("YES price should increase after buying YES shares", async function () {
      // After buying YES, noReserve is larger → yesPrice = noReserve/total > 0.5
      const yesPrice = await market.getYesPrice();
      expect(yesPrice).to.be.gt(ethers.parseEther("0.5"));
    });

    it("should revert with slippage error when minSharesOut is too high", async function () {
      await expect(
        market
          .connect(trader1)
          .buyShares(true, tradeAmount, ethers.MaxUint256)
      ).to.be.revertedWith("Slippage exceeded");
    });
  });

  describe("Resolving market", function () {
    it("should revert if called before resolutionDate", async function () {
      await expect(
        market.connect(owner).resolveMarket(true)
      ).to.be.revertedWith("Too early");
    });

    it("owner can resolve after resolutionDate", async function () {
      await time.increaseTo(resolutionDate + 1);

      await expect(market.connect(owner).resolveMarket(true))
        .to.emit(market, "MarketResolved")
        .withArgs(true, /* timestamp */ (v: bigint) => v > 0n);

      const info = await market.getMarketInfo();
      expect(info.resolved).to.be.true;
      expect(info.outcome).to.be.true;
    });

    it("non-owner cannot resolve", async function () {
      // Deploy a fresh market for this test
      const rd = (await time.latest()) + 3600;
      const tx = await factory
        .connect(creator)
        .createMarket(
          "Another market",
          "desc",
          "Sports",
          rd,
          await token.getAddress()
        );
      const receipt = await tx.wait();
      const event = receipt?.logs
        .map((l) => {
          try { return factory.interface.parseLog(l); } catch { return null; }
        })
        .find((e) => e?.name === "MarketDeployed");
      const addr = event!.args[0] as string;
      const m2 = await ethers.getContractAt("PredictionMarket", addr);

      await time.increase(3601);
      await expect(
        m2.connect(trader1).resolveMarket(true)
      ).to.be.reverted;
    });
  });

  describe("Claiming winnings", function () {
    it("winning trader (YES) can claim after resolution", async function () {
      const [yes] = await market.getShares(trader1.address);
      expect(yes).to.be.gt(0n);

      const before = await token.balanceOf(trader1.address);

      await expect(market.connect(trader1).claimWinnings())
        .to.emit(market, "WinningsClaimed")
        .withArgs(trader1.address, yes, (v: bigint) => v > 0n);

      const after = await token.balanceOf(trader1.address);
      expect(after).to.be.gt(before);
    });

    it("losing trader (NO) cannot claim", async function () {
      await expect(
        market.connect(trader2).claimWinnings()
      ).to.be.revertedWith("No winning shares");
    });

    it("cannot claim twice", async function () {
      await expect(
        market.connect(trader1).claimWinnings()
      ).to.be.revertedWith("No winning shares");
    });
  });
});
