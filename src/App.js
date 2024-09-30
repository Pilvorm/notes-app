import { useState } from "react";
import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Sidebar";
import Searchbar from "./components/Searchbar";
import Header from "./components/Header";
import Notes from "./components/Notes";
import { Outlet, useParams } from "react-router-dom";

function App() {
  const [sortValue, setSortValue] = useState("Date modified");
  const [sortDirection, setSortDirection] = useState("descending");
  const [searchQuery, setSearchQuery] = useState("");
  // const [key, setKey] = useState(null);

  const { noteID } = useParams();

  return (
    <div className="App">
      <Sidebar />
      <main>
        {!noteID ? (
          <>
            <Searchbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <div className="all-notes">
              <Header
                title="All notes"
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
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}

export default App;
