// app/api/stocks/[id]/route.ts

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

// Handler for PUT and DELETE requests
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { name, ticker, quantity, buyPrice } = await req.json();

    if (!id || !name || !ticker || !quantity || !buyPrice) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Optionally, validate the ticker by fetching its price
    await fetchStockPrice(ticker);

    const stock = await prisma.stock.update({
      where: { id: parseInt(id) },
      data: { name, ticker, quantity, buyPrice },
    });

    return NextResponse.json(stock);
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Stock ID is required' }, { status: 400 });
    }

    await prisma.stock.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    return NextResponse.json({ error: 'Failed to delete stock' }, { status: 500 });
  }
}
