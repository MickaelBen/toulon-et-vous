import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = 'Rechercher...', value, onChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      />
    </div>
  );
};

export default SearchBar;