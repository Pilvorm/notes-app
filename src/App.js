import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import Notes from "./components/Notes";
import { notesData } from "./data";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoSearchOutline } from "react-icons/io5";
import { BsSortDown, BsArrowUp, BsArrowDown } from "react-icons/bs";
import Header from "./components/Header";
import { useState } from "react";

function App() {
  const [sortValue, setSortValue] = useState("Date Modified");
  const [sortDirection, setSortDirection] = useState("descending");

  return (
    <div className="App">
      <Sidebar />
      <main>
        <label className="mt-5 d-flex align-items-center">
          <IoSearchOutline size={22} />
          <input name="searchNote" placeholder="Search" className="" />
        </label>
        <div className="all-notes">
          <Header
            sortValue={sortValue}
            setSortValue={setSortValue}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
          <Notes
            sortValue={sortValue}
            sortDirection={sortDirection}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
