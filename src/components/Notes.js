import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdModeEdit } from "react-icons/md";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { sortData } from "../helpers/noteHelper";
import { editNote, deleteNote } from "../redux/actions";
import { useClickOutside } from "../helpers/noteHelper";

const Notes = ({ sortValue, sortDirection, searchQuery }) => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.note);
  const noteKey = sortData(notes, sortValue, sortDirection, searchQuery);

  console.log("NOTE RENDER");

  const [editingTitle, setEditingTitle] = useState(null);
  const [dropdown, setDropdown] = useState(null);

  const editNoteTitle = (key, newTitle) => {
    dispatch(
      editNote({
        key,
        title: newTitle,
        dateModified: new Date(),
      })
    );
    setEditingTitle(null);
  };

  const newNoteAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  };

  const visibility = {
    initial: { opacity: 0, translateY: "-10px" },
    animate: { opacity: 1, translateY: "0px" },
    exit: { opacity: 0, translateY: "-10px" },
  };

  const wrapperRef = useRef("menu");
  useClickOutside(wrapperRef, () => {
    setDropdown(false);
  });

  return (
    <div className="note-cards">
      <AnimatePresence mode="sync">
        {noteKey.map((key) => (
          <motion.div
            variants={newNoteAnimation}
            initial="initial"
            animate="animate"
            key={key}
            className="card"
          >
            <div className={`card-body ${notes[key].color}`}>
              {editingTitle === key ? (
                <textarea
                  className="card-title-input"
                  autoFocus
                  defaultValue={notes[key].title}
                  maxLength={50}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (e.target.value !== notes[key].title) {
                        editNoteTitle(key, e.target.value);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== notes[key].title) {
                      editNoteTitle(key, e.target.value);
                    }
                    setEditingTitle(null);
                  }}
                />
              ) : (
                <p
                  className="card-text"
                  onDoubleClick={() => setEditingTitle(key)}
                >
                  {notes[key].title}
                </p>
              )}
              <div className="card-bottom">
                <p>{moment(notes[key].dateCreated).format("MMM DD, YYYY")}</p>
                <div
                  className="note-options"
                  ref={wrapperRef}
                  onClick={() => setDropdown(key)}
                >
                  <MdModeEdit className="icon" size={18} />
                  <AnimatePresence>
                    {dropdown == key && (
                      <motion.div
                        className="note-menu"
                        variants={visibility}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <button
                          onClick={() => {
                            dispatch(deleteNote(key));
                          }}
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notes;
