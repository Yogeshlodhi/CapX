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

    const onSelect = () => {
        setSelected(!selected);
    }

    useEffect(() => {
        console.log('Transaction Type Changed:', transactionType ? 'Buy' : 'Sell');
      }, [transactionType]);

    return (
        <div className="p-8 px-20 flex justify-between items-center space-x-4">
            <div className="bg-slate-600 shadow-md rounded-md w-[70%] p-4">
                <div className="w-[80%] pb-6"><StocksToAdd /></div>
                <div className="h-auto">
                    <Metrics />
                    <StockTable />
                </div>
            </div>
            <div className={`w-[30%] bg-white h-auto border-gray-300 rounded-lg p-4 ${selected ? '' : 'hidden'}`}>
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1>Name of Stock</h1>
                        <p>Market Price</p>
                    </div>
                    <Button size="sm" onClick={onSelect}>
                        <X />
                    </Button>
                </div>

                {/* Options Section */}
                <div className="flex justify-center my-4">
                    <div
                        className={`border-r-black border-r-2 p-1 w-[4rem] ${transactionType == true ? 'bg-green-500' : 'bg-white'} text-center cursor-pointer`}
                        onClick={() => setTransactionType(true)}
                    >
                        Buy
                    </div>
                    <div
                        className={`p-1 w-[4rem] ${transactionType == false ? 'bg-red-500': 'bg-white'} text-center cursor-pointer`}
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
                <Button className={`w-full ${transactionType == true ? 'bg-green-500': 'bg-red-500'}`}>
                    {transactionType === true ? 'Buy' : 'Sell'}
                </Button>
            </div>
        </div>
    );
}