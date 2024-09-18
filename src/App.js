import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import Notes from "./components/Notes";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoSearchOutline } from "react-icons/io5";
import Header from "./components/Header";
import { useState } from "react";

function App() {
  const [sortValue, setSortValue] = useState("Date Modified");
  const [sortDirection, setSortDirection] = useState("descending");
  const [searchQuery, setSearchQuery] = useState("");

  console.log("APP RENDER");

  return (
    <div className="App">
      <Sidebar />
      <main>
        <label className="mt-5 d-flex align-items-center">
          <IoSearchOutline size={22} />
          <input
            name="searchNote"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
        <div className="all-notes">
          <Header
            sortValue={sortValue}
            setSortValue={setSortValue}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
          <Notes
            searchQuery={searchQuery}
            sortValue={sortValue}
            sortDirection={sortDirection}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
