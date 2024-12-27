import {PrismaClient} from '@prisma/client';
import {fetchStockPrice} from "@/lib/fetchStockPrice";

const prisma = new PrismaClient();


export async function updateStockPrices(){
    const stocks = await prisma.stock.findMany();

    for(const stock of stocks){
        const currentPrice = await fetchStockPrice(stock.ticker);
        await prisma.stock.update({
            where: {id: stock.id},
            data: {currentPrice},
        })
    }
}

