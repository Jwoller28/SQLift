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

    if (typeIn) {
      typeIn.selectedIndex = -1;                // Reset the datalist input value
    }
  };

  return (
    <>
      <label htmlFor="search-form">Search the Feed: </label>
      <form id="search-form">
        <select id = "typeInput">
            <option value = "username">username</option>
            <option value = "tags">tags</option>
            <option value = "text">text</option>
        </select>
        <input
          type="search"
          id="feed-search"
          value={searchQuery}          // Bind input value to searchQuery state
          onChange={handleChange}      // Update searchQuery state on input change
        />
        <button type="submit" onClick={sendObj}>Search</button>
        {/* Clear button */}
        <button type="button" onClick={clearSearch}>Clear</button>
      </form>
    </>
  );
}

export default FeedSearch;
