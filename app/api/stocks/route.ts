import { NextResponse } from "next/server";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const FINNHUB_API_URL = "https://finnhub.io/api/v1/quote";
const FINNHUB_API_TOKEN = process.env.FINNHUB_API_TOKEN;

const prisma = new PrismaClient();


async function fetchStockPrice(ticker: string) {
  try {
    const response = await axios.get(
      `${FINNHUB_API_URL}?symbol=${ticker}&token=${FINNHUB_API_TOKEN}`
    );
    const { c: currentPrice, pc: previousClose } = response.data; // c = current price, pc = previous close
    const returns = (((currentPrice - previousClose) / previousClose) * 100).toFixed(2);

    return {
      currentPrice,
      returns,
    };
  } catch (error: any) {
    console.error(`Error fetching price for ${ticker}:`, error.response?.data || error.message);
    throw new Error("Failed to fetch stock price");
  }
}



export async function GET() {
  try {
    // Fetch stocks from the database
    const dbStocks = await prisma.stock.findMany();

    // Fetch current price and returns for each stock
    const stocksData = await Promise.all(
      dbStocks.map(async (stock) => {
        const { currentPrice, returns } = await fetchStockPrice(stock.ticker);
        return {
          ...stock,
          currentPrice,
          // currentValue: currentPrice * stock.quantity,
          currentValue: stock.quantity * (currentPrice-stock.buyPrice),
          // returns,
          returns : (((currentPrice-stock.buyPrice)/(stock.buyPrice))*100).toFixed(2),
        };
      })
    );

    return NextResponse.json(stocksData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}


// export async function GET() {
//   try {
//     const stocksData = await Promise.all(
//       STOCKS.map(async (stock) => {
//         const { currentPrice, returns } = await fetchStockPrice(stock.ticker);
//         return {
//           ...stock,
//           quantity: 0, // Placeholder for quantity
//           buyPrice: 0, // Placeholder for buy price
//           currentPrice,
//           currentValue: currentPrice * 0, // Placeholder: current price * quantity
//           returns,
//         };
//       })
//     );

//     return NextResponse.json(stocksData);
//   } catch (error) {
//     console.error("Error fetching stock data:", error);
//     return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
//   }
// }


// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import axios from 'axios';

// const prisma = new PrismaClient();

// const FINNHUB_API_URL = 'https://finnhub.io/api/v1/quote';
// const FINNHUB_API_TOKEN = process.env.FINNHUB_API_TOKEN; // Ensure to set this in your .env

// // In-memory cache for stock prices
// const priceCache: Record<string, { price: number; timestamp: number }> = {};

// async function fetchStockPrice(ticker: string): Promise<number> {
//   const now = Date.now();
//   const cached = priceCache[ticker];

//   if (cached && now - cached.timestamp < 60000) { // 1 minute cache
//     return cached.price;
//   }

//   try {
//     const response = await axios.get(`${FINNHUB_API_URL}?symbol=${ticker}&token=${FINNHUB_API_TOKEN}`);
//     console.log("Response : ", response)
//     const currentPrice = response.data.c;
//     priceCache[ticker] = { price: currentPrice, timestamp: now };
//     return currentPrice;
//   } catch (error) {
//     console.error(`Error fetching price for ${ticker}:`, error);
//     throw new Error('Failed to fetch stock price');
//   }
// }

// // Handler for GET and POST requests
// export async function GET() {
//   try {
//     const stocks = await prisma.stock.findMany();
//     return NextResponse.json(stocks);
//   } catch (error) {
//     console.error('Error fetching stocks:', error);
//     return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const { name, ticker, quantity, buyPrice } = await req.json();

//     if (!name || !ticker || !quantity || !buyPrice) {
//       return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
//     }

//     // Optionally, validate the ticker by fetching its price
//     await fetchStockPrice(ticker);

//     const stock = await prisma.stock.create({
//       data: { name, ticker, quantity, buyPrice },
//     });

//     return NextResponse.json(stock, { status: 201 });
//   } catch (error) {
//     console.error('Error adding stock:', error);
//     return NextResponse.json({ error: 'Failed to add stock' }, { status: 500 });
//   }
// }
