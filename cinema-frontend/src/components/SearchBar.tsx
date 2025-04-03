// Updated SearchBar.tsx with debug console logs
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = React.useState('');
  const navigate = useNavigate();

  // Debug effect to log state changes
  useEffect(() => {
    console.log('Current query:', query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting query:', query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          console.log('Typed:', e.target.value); // Debug log
          setQuery(e.target.value);
        }}
        placeholder="Search..."
        className="py-1 px-3 w-full border rounded-l-lg focus:outline-none bg-purple-100 text-black"
        style={{ color: 'black !important' }} // Force text color
      />
      <button 
        type="submit"
        className="bg-white text-blue-800 px-3 py-1 rounded-r-lg hover:bg-gray-100"
      >
        🔍
      </button>
    </form>
  );
};

export default SearchBar;