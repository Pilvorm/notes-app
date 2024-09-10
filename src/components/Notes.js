import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdModeEdit } from "react-icons/md";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { BsSortDown, BsArrowUp, BsArrowDown } from "react-icons/bs";
import { IoCheckmark } from "react-icons/io5";
import { sortData } from "../helpers/noteHelper";

const sortValues = ["Title", "Date Created", "Date Modified"];

const useClickOutside = (ref, onClickOutside) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
};

const Notes = ({ data }) => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.note);
  const [noteKey, setNoteKey] = useState(Object.keys(notes));

  const [dropdown, setDropdown] = useState(false);
  const [sortValue, setSortValue] = useState("Date Modified");
  const [sortDirection, setSortDirection] = useState("descending");

  const changeSortDirection = () => {
    setSortDirection(
      sortDirection === "descending" ? "ascending" : "descending"
    );
  };

  useEffect(() => {
    setNoteKey(Object.keys(notes));
    const sorted = sortData(notes, sortValue, sortDirection);
    setNoteKey(sorted);
  }, [notes, sortValue, sortDirection]);

  const [selectedKey, setSelectedKey] = useState(null);
  const [editingTitle, setEditingTitle] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");

  const editTitle = (key, title) => {
    setEditingTitle(key);
    setNoteTitle(title);
  };

  const visibility = {
    initial: { opacity: 0, translateY: "-10px" },
    animate: { opacity: 1, translateY: "0px" },
    exit: { opacity: 0, translateY: "-10px" },
  };

  const newNote = {
    initial: { opacity: 0, translateX: "-10px" },
    animate: { opacity: 1, translateX: "0px" },
    exit: { opacity: 0, translateX: "-10px" },
  };

  const wrapperRef = useRef("menu");
  useClickOutside(wrapperRef, () => {
    setDropdown(false);
  });

  return (
    <div className="all-notes">
      <div className="header">
        <h1>Notes</h1>
        <div className="sort-function" ref={wrapperRef}>
          <BsSortDown size={22} />
          <p onClick={() => setDropdown(!dropdown)}>{sortValue} |</p>
          <AnimatePresence>
            {dropdown && (
              <motion.div
                className="dropdown-menu"
                variants={visibility}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {sortValues.map((val, idx) => (
                  <button
                    key={idx}
                    className={`${val == sortValue && "selected"}`}
                    onClick={() => {
                      setSortValue(val);
                      setDropdown(!dropdown);
                    }}
                  >
                    {val}{" "}
                    {val === sortValue && (
                      <IoCheckmark size={22} className="icon" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className="sort-direction"
            onClick={() => changeSortDirection()}
          >
            {sortDirection === "descending" ? (
              <BsArrowDown size={20} />
            ) : (
              <BsArrowUp size={20} />
            )}
          </button>
        </div>
      </div>
      <div className="note-cards">
        <AnimatePresence mode="sync">
          {noteKey.map((key) => (
            <motion.div
              variants={newNote}
              initial="initial"
              animate="animate"
              exit="exit"
              key={key}
              className="card"
              onClick={() => setSelectedKey(key)}
            >
              <div className={`card-body ${notes[key].color}`}>
                {editingTitle === key ? (
                  <textarea
                    className="card-title-input"
                    autoFocus
                    value={noteTitle ?? notes[key].title}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                ) : (
                  <p
                    className="card-text"
                    onDoubleClick={() => editTitle(key, notes[key].title)}
                  >
                    {notes[key].title}
                  </p>
                )}
                <div className="card-bottom">
                  <p>{moment(notes[key].dateCreated).format("MMM DD, YYYY")}</p>
                  <div className="action-btn">
                    <MdModeEdit className="icon" size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notes;
