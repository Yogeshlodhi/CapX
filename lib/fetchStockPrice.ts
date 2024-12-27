"use client";
import { useState, useEffect } from 'react';

export default function useStockPrices (symbols: string[]){
    const [prices, setPrices] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!symbols.length) return;

        const socket = new WebSocket(
            'wss://ws.finnhub.io/?token=ctn8vp9r01qjlgirn0s0ctn8vp9r01qjlgirn0sg'
        );

        socket.addEventListener('open', () => {
            console.log('WebSocket connected');
            symbols.forEach((symbol) => {
                socket.send(JSON.stringify({ type: 'subscribe', symbol }));
            });
        });

        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'trade') {
                const updates = data.data.reduce((acc: Record<string, number>, trade: any) => {
                    acc[trade.s] = trade.p;
                    return acc;
                }, {});
                setPrices((prevPrices) => ({ ...prevPrices, ...updates }));
            }
        });

        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });

        socket.addEventListener('close', () => {
            console.log('WebSocket closed');
        });

        return () => {
            symbols.forEach((symbol) => {
                socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
            });
            socket.close();
        };
    }, [symbols]);

    return prices;
};


// import { useEffect, useState } from 'react';

// const token = "ctn8vp9r01qjlgirn0s0ctn8vp9r01qjlgirn0sg";

// export default function useStockPrices (symbols: any){
//     const [prices, setPrices] = useState({});

//     useEffect(() => {
//         const socket = new WebSocket(`wss://ws.finnhub.io?token=${token}`);

//         socket.addEventListener('open', () => {
//             symbols.forEach((symbol:any) => {
//                 socket.send(JSON.stringify({ type: 'subscribe', symbol }));
//             });
//         });

//         socket.addEventListener('message', (event) => {
//             const data = JSON.parse(event.data);
//             if (data.type === 'trade') {
//                 const { s: symbol, p: price } = data.data[0]; // Symbol and price
//                 setPrices((prevPrices) => ({ ...prevPrices, [symbol]: price }));
//             }
//         });

//         return () => {
//             symbols.forEach((symbol: any) => {
//                 socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
//             });
//             socket.close();
//         };
//     }, [symbols]);

//     return prices;
// };

