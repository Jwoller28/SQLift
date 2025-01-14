import React, { useState } from 'react';
import { sendTypeFilter } from '../../API/Axios';

interface FeedSearchProp {
  onChange: Function; // Checking if input is clear
  setSearched: Function; // Checking when to use filter
}

export interface searchType {
  type: string;
  value: string;
}

function FeedSearch(prop: FeedSearchProp) {
  const typeIn = document.querySelector('#typeInput') as HTMLSelectElement; // Ensure type casting
  const [searchQuery, setSearchQuery] = useState("");

  // Function to send the search object to API
  const sendObj = async (e: any) => {
    e.preventDefault();
    prop.setSearched((prev: any) => !prev);
    let searchT: searchType = {
      type: typeIn.value, // Get the value of the datalist input
      value: searchQuery,
    };
    await sendTypeFilter(searchT);
  };

  // Handle search input change
  const handleChange = (e: any) => {
    const value = e.target?.value;
    setSearchQuery(value);
    prop.onChange(value);
  };

  // Function to clear the search
  const clearSearch = () => {
    setSearchQuery("");                  // Reset search query state
    prop.onChange("");                   // Reset the parent search handler
    prop.setSearched(false);             // Reset the searched flag
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <label
        htmlFor="search-form"
        style={{
          fontWeight: 'bold',
          marginBottom: '5px',
          color: '#fff',
          fontSize: '1.2rem',
        }}
      >
        Search the Feed:
      </label>
      <form
        id="search-form"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <select
          id="typeInput"
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #aaa',
            fontSize: '1rem',
            outline: 'none',
            backgroundColor: '#1A1A1A',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="username">Username</option>
          <option value="tags">Tags</option>
          <option value="text">Text</option>
        </select>
        <input
          type="search"
          id="feed-search"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Type your search..."
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #aaa',
            fontSize: '1rem',
            width: '200px',
            backgroundColor: '#1A1A1A',
            color: '#fff',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          onClick={sendObj}
          style={{
            padding: '10px 20px',
            backgroundColor: '#504dff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Search
        </button>
        <button
          type="button"
          onClick={clearSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff4444',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Clear
        </button>
      </form>
    </div>
  );
  
}

export default FeedSearch;
