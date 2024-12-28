// app/api/portfolio/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const FINNHUB_API_URL = 'https://finnhub.io/api/v1/quote';
const FINNHUB_API_TOKEN = process.env.FINNHUB_API_TOKEN; // Ensure to set this in your .env

// In-memory cache for stock prices
const priceCache: Record<string, { price: number; timestamp: number }> = {};

async function fetchStockPrice(ticker: string): Promise<number> {
  const now = Date.now();
  const cached = priceCache[ticker];

  if (cached && now - cached.timestamp < 60000) { // 1 minute cache
    return cached.price;
  }

  try {
    const response = await axios.get(`${FINNHUB_API_URL}?symbol=${ticker}&token=${FINNHUB_API_TOKEN}`);
    const currentPrice = response.data.c;
    priceCache[ticker] = { price: currentPrice, timestamp: now };
    return currentPrice;
  } catch (error) {
    console.error(`Error fetching price for ${ticker}:`, error);
    throw new Error('Failed to fetch stock price');
  }
}

export async function GET() {
  try {
    // Fetch all stocks
    const stocks = await prisma.stock.findMany();

    if (stocks.length === 0) {
      return NextResponse.json({
        totalValue: 0,
        topStock: null,
        portfolioDistribution: [],
      });
    }

    // Fetch current prices
    const stocksWithPrices = await Promise.all(
      stocks.map(async (stock) => {
        const currentPrice = await fetchStockPrice(stock.ticker);
        const currentValue = currentPrice * stock.quantity;
        const returns = ((currentPrice - stock.buyPrice) / stock.buyPrice) * 100;

        return {
          ...stock,
          currentPrice,
          currentValue,
          returns: returns.toFixed(2),
        };
      })
    );

    // Calculate total portfolio value
    const totalValue = stocksWithPrices.reduce((acc, stock) => acc + stock.currentValue, 0);

    // Determine top-performing stock based on returns
    const topStock = stocksWithPrices.reduce((prev, current) => {
      return parseFloat(current.returns) > parseFloat(prev.returns) ? current : prev;
    }, stocksWithPrices[0]);

    // Calculate portfolio distribution
    const portfolioDistribution = stocksWithPrices.map((stock) => ({
      name: stock.name,
      value: stock.currentValue,
      percentage: ((stock.currentValue / totalValue) * 100).toFixed(2),
    }));

    return NextResponse.json({
      totalValue,
      topStock,
      portfolioDistribution,
      stocks: stocksWithPrices,
    });
  } catch (error) {
    console.error('Error fetching portfolio metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio metrics' }, { status: 500 });
  }
}
