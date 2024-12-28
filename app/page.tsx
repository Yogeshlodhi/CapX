"use client";

import Metrics from "@/components/CustomComponents/Metrics";
import StocksToAdd from "@/components/CustomComponents/StocksToAdd";
import StockTable from "@/components/CustomComponents/StockTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
    const [selected, setSelected] = useState(true);
    const [transactionType, setTransactionType] = useState(true);
    const [selectedStock, setSelectedStock] = useState({});

    const onSelect = () => {
        setSelected(!selected);
    }


    return (
        <div className="p-8 px-20 flex justify-between space-x-4">
            <div className="bg-[#2f2f33] shadow-md rounded-md w-[75%] p-4">
                <div className="w-[80%] pb-6"><StocksToAdd /></div>
                <div className="h-auto">
                    <Metrics />
                    <StockTable />
                </div>
            </div>
            <div className={`w-[25%] bg-white h-[25rem] border-gray-300 rounded-lg p-4 ${selected ? '' : 'hidden'} items-start justify-start`}>
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1>Name of Stock | Ticker</h1>
                        <p>Market Price</p>
                    </div>
                    <Button size="sm" onClick={onSelect}><X className="text-orange-500"/></Button>
                </div>

                {/* Options Section */}
                <div className="flex justify-center my-4">
                    <div
                        className={`border-r-black border-r-2 p-1 w-[4rem] ${transactionType == true ? 'bg-green-500' : 'bg-white'} text-center cursor-pointer ${transactionType == true ? 'text-white' : 'text-orange-500'}`}
                        onClick={() => setTransactionType(true)}
                    >
                        Buy
                    </div>
                    <div
                        className={`p-1 w-[4rem] ${transactionType == false ? 'bg-red-500': 'bg-white'} text-center cursor-pointer ${transactionType == false ? 'text-white' : 'text-orange-500'}`}
                        onClick={() => setTransactionType(false)}
                    >
                        Sell
                    </div>
                </div>

                {/* Form Section */}
                <div className="h-[10rem] flex flex-col space-y-4  justify-center">
                    {/* <h2 className="text-lg font-semibold">{transactionType == true ? 'Buy' : 'Sell'} Stock</h2> */}
                    <div className="flex justify-around items-center">
                        <h2>Quantity : </h2>
                        <Input
                            type="number"
                            className="w-[50%]"
                            // className="w-full border-gray-300 rounded-lg p-2 mb-4"
                            placeholder={`Quantity To ${transactionType == true ? 'Buy' : 'Sell'}`}
                        />
                    </div>
                    <h2>Total Amount : </h2>
                </div>
                
                {/* Submit Button */}
                <Button className={`w-full ${transactionType == true ? 'bg-green-500': 'bg-red-500'} ${transactionType == true ? 'hover:bg-green-600': 'hover:bg-red-600'}`}>
                    {transactionType === true ? 'Buy' : 'Sell'}
                </Button>
            </div>
        </div>
    );
}