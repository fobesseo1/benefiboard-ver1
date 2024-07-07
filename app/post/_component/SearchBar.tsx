//_components/SearchBar.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BiSearch } from 'react-icons/bi';

type SearchBarProps = {
  initialQuery?: string;
  searchUrl: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = '', searchUrl }) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`${searchUrl}?query=${searchTerm}`);
    }
  };

  return (
    <div className="flex justify-center mx-4">
      <div className="relative w-full max-w-lg">
        <BiSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 pl-10 w-full"
        />
      </div>
      <Button onClick={handleSearch} className="ml-2">
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
