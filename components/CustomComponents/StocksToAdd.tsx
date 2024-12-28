"use client"

import { stocks } from '@/data'
import React from 'react'
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const StocksToAdd = () => {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-orange-500 uppercase text-[2rem]'>Stocks you might wanna add ....</h1>
      <div className='flex items-center justify-around gap-[2rem]'>
        {stocks.map((stock) => (
          <Dialog key={stock.id}>
            <DialogTrigger asChild>
              <Button className='text-[#ed8e36] text-lg'>{stock.name}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Buy</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 ">
                <div>Market Price : ₹430</div>
                <div className="grid grid-cols-4 items-center gap-4">
                  Quantity : 
                  <Input type='number' id="name" value="Pedro Duarte" className="col-span-3" />
                </div>
                <div>Amount to Pay : ₹8000</div>
              </div>
              <DialogFooter>
                <Button className='bg-green-500 text-white' type="submit">Confirm Buy</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}

export default StocksToAdd;