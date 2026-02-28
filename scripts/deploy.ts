import { ethers } from "hardhat";

/** USDC-like mock address – replace with a real ERC-20 on live networks */
const MOCK_TOKEN = "0x0000000000000000000000000000000000000001";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "MATIC"
  );

  // ── Deploy MarketFactory ─────────────────────────────────────────────────
  const Factory = await ethers.getContractFactory("MarketFactory");
  const factory = await Factory.deploy(deployer.address);
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log("\nMarketFactory deployed to:", factoryAddr);

  // ── Sample Markets ───────────────────────────────────────────────────────
  const now = Math.floor(Date.now() / 1000);
  const oneWeek   = now + 7  * 24 * 3600;
  const twoWeeks  = now + 14 * 24 * 3600;
  const oneMonth  = now + 30 * 24 * 3600;

  const samples: {
    question: string;
    description: string;
    category: string;
    resolutionDate: number;
  }[] = [
    {
      question: "Will Bitcoin exceed $100,000 by end of 2025?",
      description:
        "Resolves YES if the BTC/USD closing price on Coinbase exceeds $100,000 on any day before 31 Dec 2025.",
      category: "Crypto",
      resolutionDate: oneWeek,
    },
    {
      question: "Will the Fed cut rates at the next FOMC meeting?",
      description:
        "Resolves YES if the Federal Reserve reduces its target federal funds rate at the next scheduled FOMC meeting.",
      category: "Finance",
      resolutionDate: twoWeeks,
    },
    {
      question: "Will Ethereum complete the next major upgrade in Q3?",
      description:
        "Resolves YES if Ethereum's next hard fork activates on mainnet before the end of Q3.",
      category: "Technology",
      resolutionDate: oneMonth,
    },
  ];

  for (const s of samples) {
    const tx = await factory.createMarket(
      s.question,
      s.description,
      s.category,
      s.resolutionDate,
      MOCK_TOKEN
    );
    const receipt = await tx.wait();

    // Extract market address from the MarketDeployed event
    const event = receipt?.logs
      .map((log) => {
        try {
          return factory.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e) => e?.name === "MarketDeployed");

    const marketAddr = event?.args[0] ?? "unknown";
    console.log(`  ✓ Market "${s.question.slice(0, 50)}..." → ${marketAddr}`);
  }

  console.log("\n── Summary ──────────────────────────────────────────────");
  console.log("MarketFactory:", factoryAddr);
  console.log("Total markets:", (await factory.getMarketCount()).toString());
  console.log("\nAdd to .env.local:");
  console.log(`NEXT_PUBLIC_MARKET_FACTORY_ADDRESS=${factoryAddr}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
