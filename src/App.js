import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import Notes from "./components/Notes";
import { notesData } from "./data";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoSearchOutline } from "react-icons/io5";
import { BsSortDown, BsArrowUp, BsArrowDown } from "react-icons/bs";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <main>
        <label className="mt-5 d-flex align-items-center">
          <IoSearchOutline size={22} />
          <input name="searchNote" placeholder="Search" className="" />
        </label>
        <Notes notes={notesData} />
      </main>
    </div>
  );
}

export default App;
