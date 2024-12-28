import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";


interface Stock {
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  currentValue: number;
  returns: string;
}

const StockTable = () => {

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/stocks');
      // const response = await axios.get('http://localhost:3000/api/stocks');
      console.log(response);
      setStocks(response.data);
    }
    catch (error: any) {
      console.error('Error fetching stocks : ', error);
      alert(error.response?.data?.error || "Failed to fetch stocks");
    }
  }

  useEffect(() => {
    fetchStocks();
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Do you want to delete ?")) return;
    try {
      await axios.delete(`/api/stocks/${id}`);
      alert("Stock deleted");
      fetchStocks();
    }
    catch (error: any) {
      console.log("Error in deleting : ", error);
      alert(error.response?.data?.error || "Failed to delete");
    }
  }

  const handleEdit = (stock: Stock) => {
    alert("Edit functionality not implemented");
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-orange-500">
          <TableHead>Name</TableHead>
          <TableHead>Ticker</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Buy Price</TableHead>
          <TableHead>Current Price</TableHead>
          <TableHead>Returns (%)</TableHead>
          <TableHead>Current Value</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => (
          <TableRow key={stock.ticker}>
            <TableCell>{stock.name}</TableCell>
            <TableCell>{stock.ticker}</TableCell>
            <TableCell>{stock.quantity}</TableCell>
            <TableCell>₹{stock.buyPrice.toFixed(2)}</TableCell>
            <TableCell>₹{stock.currentPrice.toFixed(2)}</TableCell>
            <TableCell className={`${stock.returns > '0' ? 'text-green-500' : 'text-red-500'} font-bold`}>
              {stock.returns}%
            </TableCell>
            <TableCell className={`${stock.currentValue.toFixed(2) > '0' ? 'text-green-500': 'text-red-500'} font-bold`}>
                {stock.currentValue.toFixed(2)}
            </TableCell>
            <TableCell>
              <Button
                className="text-white"
                // onClick={() => handleDelete(stock.id)}
                onClick={() => alert("Action not working")}
              >
                Buy/Sell
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default StockTable;