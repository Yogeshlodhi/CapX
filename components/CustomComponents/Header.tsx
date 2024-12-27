import React from 'react'
import SearchBar from './SearchBar'

const Header = () => {
  return (
    <div className='flex justify-around items-center p-4 bg-gray-300'>
      <h1>CapX</h1>
      <div className='w-[60%]'><SearchBar/></div>
    </div>
  )
}

export default Header
