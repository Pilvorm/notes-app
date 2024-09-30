import { IoSearchOutline } from "react-icons/io5";

const Searchbar = ({ searchQuery, setSearchQuery }) => {
  return (
    <label className="mt-5 d-flex align-items-center">
      <IoSearchOutline size={22} />
      <input
        name="searchNote"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </label>
  );
};

export default Searchbar;
