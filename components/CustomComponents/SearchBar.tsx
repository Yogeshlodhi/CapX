
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import React from 'react'

const SearchBar = () => {
    return (
        <div className="flex w-full items-center space-x-4">
            <Input type="text" placeholder="Search Stocks....." />
            <Button>Search</Button>
        </div>
    )
}

export default SearchBar
