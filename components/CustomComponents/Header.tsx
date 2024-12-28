import React from 'react'
import SearchBar from './SearchBar'
import Image from 'next/image'

const Header = () => {
  return (
    <div className='flex justify-around items-center p-4 bg-[#2f2f33]'>
      {/* <h1>CapX</h1>*/}
      <Image src={'/logo.webp'} alt='Logo' width={100} height={100}/>
      <div className='w-[60%]'><SearchBar/></div>
    </div>
  )
}

export default Header
