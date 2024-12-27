import React from 'react'

const Metrics = () => {
  return (
    <div className='flex justify-around'>
      <div className='flex flex-col gap-4 justify-center w-[40%] p-4'>
        <h2>Current Total Value : ₹23000</h2>

        <h2>Invested Total Value : ₹25000</h2>

        <h2>Total Returns : -₹23000</h2>
      </div>

      <div className='flex flex-col gap-4 justify-center w-[40%] p-4'>
        <h2>1-Day Returns : ₹2000</h2>  

        <h2>Top Gainer Stock : XYZ</h2>
        
        <h2>Top Loser Stock : XYZ</h2>  
      </div>
      <div className='w-[20%]'></div>
    </div>
  )
}

export default Metrics
