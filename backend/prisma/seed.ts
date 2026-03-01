import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USERS = [
  { walletAddress: '0x1234567890123456789012345678901234567890', username: 'crypto_whale' },
  { walletAddress: '0x2345678901234567890123456789012345678901', username: 'market_maker' },
  { walletAddress: '0x3456789012345678901234567890123456789012', username: 'poly_trader' },
  { walletAddress: '0x4567890123456789012345678901234567890123', username: 'alpha_seeker' },
  { walletAddress: '0x5678901234567890123456789012345678901234', username: 'defi_degen' },
];

const MARKETS = [
  {
    question: 'Will Bitcoin exceed $150,000 by July 2026?',
    description:
      'This market resolves YES if the price of Bitcoin (BTC) exceeds $150,000 USD on any major exchange before July 1, 2026.',
    category: 'Crypto',
    resolutionDate: new Date('2026-07-01'),
    featured: true,
    yesPrice: 0.42,
  },
  {
    question: 'Will the US Fed cut interest rates in Q2 2026?',
    description:
      'This market resolves YES if the Federal Reserve cuts the federal funds rate at least once during Q2 2026 (April-June).',
    category: 'Politics',
    resolutionDate: new Date('2026-06-30'),
    featured: true,
    yesPrice: 0.65,
  },
  {
    question: 'Will AI pass the bar exam with top 10% score by 2026?',
    description:
      'This market resolves YES if any AI system achieves a score in the top 10% of bar exam takers by December 31, 2026.',
    category: 'Tech',
    resolutionDate: new Date('2026-12-31'),
    featured: true,
    yesPrice: 0.78,
  },
  {
    question: 'Will SpaceX land humans on Mars by 2030?',
    description:
      'Resolves YES if SpaceX successfully lands at least one human on Mars by December 31, 2030.',
    category: 'Science',
    resolutionDate: new Date('2030-12-31'),
    featured: false,
    yesPrice: 0.18,
  },
  {
    question: 'Who will win the 2026 FIFA World Cup?',
    description:
      'This market resolves YES if the pre-tournament favorite wins. Resolution based on official FIFA announcement.',
    category: 'Sports',
    resolutionDate: new Date('2026-07-19'),
    featured: true,
    yesPrice: 0.22,
  },
  {
    question: 'Will Ethereum hit $10,000 by end of 2026?',
    description:
      'Resolves YES if ETH price exceeds $10,000 USD on any major exchange before December 31, 2026.',
    category: 'Crypto',
    resolutionDate: new Date('2026-12-31'),
    featured: true,
    yesPrice: 0.55,
  },
  {
    question: 'Will Apple release AR glasses in 2026?',
    description:
      'Resolves YES if Apple officially releases and sells augmented reality glasses to consumers in 2026.',
    category: 'Tech',
    resolutionDate: new Date('2026-12-31'),
    featured: false,
    yesPrice: 0.48,
  },
  {
    question: 'Will global temperatures exceed 1.5°C above pre-industrial levels in 2026?',
    description:
      'Resolves YES if the annual global mean temperature exceeds 1.5°C above pre-industrial levels as measured by major climate agencies.',
    category: 'Science',
    resolutionDate: new Date('2026-12-31'),
    featured: false,
    yesPrice: 0.71,
  },
  {
    question: 'Will a self-driving car be commercially available in 2026?',
    description:
      'Resolves YES if any company offers fully autonomous (Level 5) vehicles for commercial sale without a safety driver.',
    category: 'Tech',
    resolutionDate: new Date('2026-12-31'),
    featured: false,
    yesPrice: 0.35,
  },
  {
    question: 'Will Twitter/X reach 1 billion monthly active users by 2027?',
    description:
      'Resolves YES if Twitter/X officially reports 1 billion or more monthly active users before January 1, 2027.',
    category: 'Tech',
    resolutionDate: new Date('2027-01-01'),
    featured: false,
    yesPrice: 0.28,
  },
  {
    question: 'Will the 2026 US midterm elections flip the Senate?',
    description:
      'Resolves YES if the party that does not hold the Senate majority after the 2026 midterm elections wins control.',
    category: 'Politics',
    resolutionDate: new Date('2026-11-10'),
    featured: true,
    yesPrice: 0.51,
  },
  {
    question: 'Will Solana flip Ethereum in market cap by 2026?',
    description:
      "Resolves YES if Solana's market cap exceeds Ethereum's market cap at any point before December 31, 2026.",
    category: 'Crypto',
    resolutionDate: new Date('2026-12-31'),
    featured: false,
    yesPrice: 0.15,
  },
  {
    question: 'Will the next iPhone support satellite messaging natively?',
    description:
      'Resolves YES if the next major iPhone release (2026) includes native satellite messaging without third-party hardware.',
    category: 'Tech',
    resolutionDate: new Date('2026-09-30'),
    featured: false,
    yesPrice: 0.62,
  },
  {
    question: 'Will a nuclear fusion power plant deliver net energy to the grid by 2028?',
    description:
      'Resolves YES if any commercial nuclear fusion facility delivers net positive energy to a public electricity grid by December 31, 2028.',
    category: 'Science',
    resolutionDate: new Date('2028-12-31'),
    featured: false,
    yesPrice: 0.19,
  },
  {
    question: 'Will OpenAI release GPT-5 in 2025?',
    description:
      'Resolves YES if OpenAI officially releases and publicly deploys GPT-5 to end users before December 31, 2025.',
    category: 'Tech',
    resolutionDate: new Date('2025-12-31'),
    featured: true,
    yesPrice: 0.88,
  },
  {
    question: 'Will the 2026 Winter Olympics break viewership records?',
    description:
      'Resolves YES if the 2026 Milan-Cortina Winter Olympics surpass the viewership records set by the 2022 Beijing Winter Olympics.',
    category: 'Sports',
    resolutionDate: new Date('2026-03-15'),
    featured: false,
    yesPrice: 0.41,
  },
  {
    question: 'Will Amazon acquire a major Hollywood studio by 2027?',
    description:
      'Resolves YES if Amazon completes the acquisition of a studio with over $1B annual revenue before January 1, 2027.',
    category: 'Entertainment',
    resolutionDate: new Date('2027-01-01'),
    featured: false,
    yesPrice: 0.26,
  },
  {
    question: 'Will the price of gold exceed $3,000/oz in 2026?',
    description:
      'Resolves YES if the spot price of gold exceeds $3,000 per troy ounce on any major exchange in 2026.',
    category: 'Finance',
    resolutionDate: new Date('2026-12-31'),
    featured: false,
    yesPrice: 0.67,
  },
  {
    question: 'Will India overtake the US in total GDP by 2030?',
    description:
      "Resolves YES if India's nominal GDP exceeds that of the United States as reported by the IMF before 2031.",
    category: 'World Events',
    resolutionDate: new Date('2030-12-31'),
    featured: false,
    yesPrice: 0.09,
  },
  {
    question: 'Will a major central bank officially adopt a CBDC in 2026?',
    description:
      'Resolves YES if the Fed, ECB, Bank of England, or Bank of Japan officially launches a retail CBDC in 2026.',
    category: 'Finance',
    resolutionDate: new Date('2026-12-31'),
    featured: false,
    yesPrice: 0.33,
  },
  {
    question: 'Will Lionel Messi retire from professional football by 2026?',
    description:
      'Resolves YES if Lionel Messi officially announces his retirement from professional football before December 31, 2026.',
    category: 'Sports',
    resolutionDate: new Date('2026-12-31'),
    featured: false,
    yesPrice: 0.44,
  },
  {
    question: 'Will a streaming service surpass Netflix in subscribers by 2027?',
    description:
      'Resolves YES if any single streaming service (Disney+, Amazon Prime, etc.) reports more total subscribers than Netflix before 2027.',
    category: 'Entertainment',
    resolutionDate: new Date('2027-01-01'),
    featured: false,
    yesPrice: 0.31,
  },
  {
    question: 'Will the Dow Jones Industrial Average reach 50,000 by end of 2026?',
    description:
      'Resolves YES if the DJIA closes above 50,000 points on any trading day before December 31, 2026.',
    category: 'Finance',
    resolutionDate: new Date('2026-12-31'),
    featured: false,
    yesPrice: 0.58,
  },
  {
    question: 'Will there be a major diplomatic breakthrough with North Korea in 2026?',
    description:
      'Resolves YES if there is a formal, internationally recognized peace agreement or diplomatic normalization involving North Korea in 2026.',
    category: 'World Events',
    resolutionDate: new Date('2026-12-31'),
    featured: false,
    yesPrice: 0.07,
  },
  {
    question: 'Will Dogecoin reach $1.00 in 2026?',
    description:
      'Resolves YES if DOGE price reaches $1.00 USD on any major exchange before December 31, 2026.',
    category: 'Crypto',
    resolutionDate: new Date('2026-12-31'),
    featured: false,
    yesPrice: 0.22,
  },
  {
    question: 'Will the EU ban single-use plastics fully by 2027?',
    description:
      'Resolves YES if the European Union passes legislation effectively banning all single-use plastics by January 1, 2027.',
    category: 'World Events',
    resolutionDate: new Date('2027-01-01'),
    featured: false,
    yesPrice: 0.49,
  },
  {
    question: 'Will quantum computing achieve commercial viability by 2028?',
    description:
      'Resolves YES if a quantum computer is deployed commercially (not research-only) to solve real-world problems faster than classical computers by December 31, 2028.',
    category: 'Science',
    resolutionDate: new Date('2028-12-31'),
    featured: true,
    yesPrice: 0.38,
  },
  {
    question: 'Will the next James Bond film gross over $1 billion worldwide?',
    description:
      'Resolves YES if the next official James Bond film (post-No Time to Die) earns over $1 billion at the worldwide box office.',
    category: 'Entertainment',
    resolutionDate: new Date('2027-12-31'),
    featured: false,
    yesPrice: 0.56,
  },
  {
    question: 'Will the 2026 US elections see record voter turnout?',
    description:
      'Resolves YES if the 2026 US midterm elections have higher turnout than the 2022 midterm elections as reported by official sources.',
    category: 'Politics',
    resolutionDate: new Date('2026-11-15'),
    featured: false,
    yesPrice: 0.53,
  },
  {
    question: 'Will any country achieve 100% renewable energy by 2030?',
    description:
      'Resolves YES if any country with a population over 1 million officially reports running on 100% renewable energy for an entire calendar year before 2031.',
    category: 'Science',
    resolutionDate: new Date('2030-12-31'),
    featured: false,
    yesPrice: 0.62,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const users = [];
  for (const userData of USERS) {
    const user = await prisma.user.upsert({
      where: { walletAddress: userData.walletAddress },
      update: { username: userData.username },
      create: { walletAddress: userData.walletAddress, username: userData.username },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users`);

  // Create markets with outcomes
  const markets = [];
  for (const marketData of MARKETS) {
    const { yesPrice, ...data } = marketData;
    const noPrice = 1 - yesPrice;

    const market = await prisma.market.upsert({
      where: { id: `seed-${marketData.question.slice(0, 30).replace(/\s+/g, '-').toLowerCase()}` },
      update: {
        featured: data.featured,
      },
      create: {
        id: `seed-${marketData.question.slice(0, 30).replace(/\s+/g, '-').toLowerCase()}`,
        ...data,
        status: 'ACTIVE',
        outcomes: {
          create: [
            {
              label: 'YES',
              price: yesPrice,
              totalShares: 1000 + Math.random() * 9000,
              totalVolume: Math.random() * 100000,
            },
            {
              label: 'NO',
              price: noPrice,
              totalShares: 1000 + Math.random() * 9000,
              totalVolume: Math.random() * 100000,
            },
          ],
        },
      },
      include: { outcomes: true },
    });
    markets.push(market);
  }
  console.log(`✅ Created ${markets.length} markets`);

  // Generate 30 days of price history for each market
  const now = new Date();
  for (const market of markets) {
    const yesOutcome = market.outcomes.find((o) => o.label === 'YES');
    const noOutcome = market.outcomes.find((o) => o.label === 'NO');
    if (!yesOutcome || !noOutcome) continue;

    // Delete existing price history for seed markets to allow re-seeding
    await prisma.priceHistory.deleteMany({ where: { marketId: market.id } });

    let currentYesPrice = 0.5;
    const priceHistoryData = [];

    for (let day = 30; day >= 0; day--) {
      const baseTime = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
      // 24 data points per day (hourly)
      for (let hour = 0; hour < 24; hour++) {
        const timestamp = new Date(baseTime.getTime() + hour * 60 * 60 * 1000);
        const meanReversion = (yesOutcome.price - currentYesPrice) * 0.05;
        const randomShock = (Math.random() - 0.5) * 0.03;
        currentYesPrice = Math.min(
          Math.max(currentYesPrice + meanReversion + randomShock, 0.01),
          0.99
        );

        priceHistoryData.push(
          { marketId: market.id, outcomeId: yesOutcome.id, price: currentYesPrice, timestamp },
          { marketId: market.id, outcomeId: noOutcome.id, price: 1 - currentYesPrice, timestamp }
        );
      }
    }

    await prisma.priceHistory.createMany({ data: priceHistoryData });
  }
  console.log('✅ Generated price history');

  // Create trades and positions
  for (let i = 0; i < 3; i++) {
    const user = users[i];
    const market = markets[i % markets.length];
    const yesOutcome = market.outcomes.find((o) => o.label === 'YES');
    if (!yesOutcome) continue;

    const tradePrice = yesOutcome.price * (0.9 + Math.random() * 0.2);
    const tradeAmount = 10 + Math.random() * 90;

    await prisma.trade.create({
      data: {
        marketId: market.id,
        outcomeId: yesOutcome.id,
        buyerId: user.id,
        sellerId: users[(i + 1) % users.length].id,
        price: tradePrice,
        amount: tradeAmount,
      },
    });

    await prisma.position.upsert({
      where: {
        userId_marketId_outcomeId: {
          userId: user.id,
          marketId: market.id,
          outcomeId: yesOutcome.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        marketId: market.id,
        outcomeId: yesOutcome.id,
        shares: tradeAmount,
        avgPrice: tradePrice,
        currentValue: tradeAmount * yesOutcome.price,
        pnl: tradeAmount * (yesOutcome.price - tradePrice),
      },
    });
  }
  console.log('✅ Created sample trades and positions');

  // Create leaderboard entries
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await prisma.leaderboard.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        totalPnl: (Math.random() - 0.3) * 10000,
        totalTrades: Math.floor(Math.random() * 200) + 10,
        winRate: 40 + Math.random() * 40,
        rank: i + 1,
      },
    });
  }
  console.log('✅ Created leaderboard entries');

  // Create sample comments
  const sampleComments = [
    'This market looks very interesting! Strong YES position here.',
    'The fundamentals definitely support a NO outcome on this one.',
    'High volatility expected near resolution date.',
    'Great market, been watching this closely.',
    'The price seems undervalued for YES right now.',
  ];

  for (let i = 0; i < 5; i++) {
    await prisma.comment.create({
      data: {
        userId: users[i % users.length].id,
        marketId: markets[i % markets.length].id,
        content: sampleComments[i],
      },
    });
  }
  console.log('✅ Created sample comments');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
