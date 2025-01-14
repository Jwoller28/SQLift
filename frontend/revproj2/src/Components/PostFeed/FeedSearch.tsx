import React, { useState, useEffect } from 'react';
import { sendTypeFilter } from '../../API/Axios';

export interface FeedSearchProps {
  onSearch: (query: string, isSearched: boolean) => void;
  searchQuery: string;
  searched: boolean;
}

export interface searchType {
  type: string;
  value: string;
}

function FeedSearch({ onSearch, searchQuery, searched }: FeedSearchProps) {
  const [selectedType, setSelectedType] = useState("username");
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchT: searchType = {
      type: selectedType,
      value: localSearchQuery,
    };
    await sendTypeFilter(searchT);
    onSearch(localSearchQuery, true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    if (!value) {
      onSearch("", false);
    } else {
      onSearch(value, searched);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const clearSearch = () => {
    setLocalSearchQuery("");
    setSelectedType("username");
    onSearch("", false);
  };

  return (
    <form role = "form" onSubmit={handleSubmit}>
      <label htmlFor="typeInput">Search the Feed: </label>
      <select
        id="typeInput"
        value={selectedType}
        onChange={handleTypeChange}
      >
        <option value="usernames">username</option>
        <option value="tags">tags</option>
        <option value="text">text</option>
      </select>
      <input
        type="search"
        id="feed-search"
        value={localSearchQuery}
        onChange={handleChange}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
      <button type="button" onClick={clearSearch}>Clear</button>
    </form>
  );
}

export default FeedSearch;