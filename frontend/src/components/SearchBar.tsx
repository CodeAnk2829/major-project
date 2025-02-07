import { Button, TextInput } from "flowbite-react";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { customThemeTi } from "../utils/flowbiteCustomThemes";

const handleSubmit = (e) => {
  e.preventDefault();
  // const urlParams = new URLSearchParams(location.search);
  // urlParams.set('searchTerm', searchTerm);
  // const searchQuery = urlParams.toString();
  // navigate(`/search?${searchQuery}`);
};

function SearchBar() {
  return (
    <div className="max-w-max">
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="w-full p-2.5"
          theme={customThemeTi}
          color="gray"
          //   value={searchTerm}
          //   onChange={(e)=> setSearchTerm(e.target.value)}
        />
      </form>
    </div>
  );
}

export default SearchBar;
