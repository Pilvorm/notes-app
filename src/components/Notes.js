import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaRegNoteSticky } from "react-icons/fa6";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { colors, useClickOutside, sortData } from "../helpers/noteHelper";
import EditorPopup from "./EditorPopup";
import { createNote, editNote, deleteNote } from "../redux/actions";
import { useNavigate } from "react-router-dom";

const Notes = ({ sortValue, sortDirection, searchQuery }) => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.note);
  const noteKey = sortData(notes, sortValue, sortDirection, searchQuery);

  const [editingTitle, setEditingTitle] = useState(null);
  const [dropdown, setDropdown] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();

  const editNoteTitle = (key, newTitle) => {
    dispatch(
      editNote({
        key,
        title: newTitle || "Title",
        dateModified: new Date(),
      })
    );
    setEditingTitle(null);
  };

  const editNoteColor = (key, color) => {
    dispatch(
      editNote({
        key,
        color,
        dateModified: new Date(),
      })
    );
    setEditingTitle(null);
  };

  const copyNote = (title, content, color) => {
    dispatch(
      createNote({
        title,
        content,
        color,
        starred: false,
        dateCreated: new Date(),
        dateModified: new Date(),
      })
    );
  };

  const newNoteAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const visibilityAnimation = {
    initial: { opacity: 0, translateY: "-10px" },
    animate: { opacity: 1, translateY: "0px" },
    exit: { opacity: 0, translateY: "-10px" },
  };

  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, () => {
    setDropdown(null);
  });

  return noteKey.length ? (
    <>
      <ul className="note-cards">
        <AnimatePresence mode="popLayout">
          {noteKey.map((key) => (
            <motion.li
              layout
              layoutId={key}
              variants={newNoteAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              key={key}
              className="card"
              style={dropdown === key && { zIndex: "99" }}
              // onClick={() => !editingTitle && navigate(`note/${key}`)}
              onClick={() => setSelectedNote(key)}
            >
              <div className={`card-body ${notes[key].color}`}>
                {editingTitle === key ? (
                  <textarea
                    autoFocus
                    className="card-title-input"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTitle(key);
                    }}
                  >
                    {notes[key].title}
                  </p>
                )}
                <div className="card-bottom">
                  <p>{moment(notes[key].dateCreated).format("MMM DD, YYYY")}</p>
                  <div
                    className="note-options"
                    ref={wrapperRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (dropdown === null) setDropdown(key);
                      else setDropdown(null);
                    }}
                  >
                    <IoEllipsisVertical className="icon" size={18} />
                    <AnimatePresence>
                      {dropdown == key && (
                        <motion.div
                          className="note-menu"
                          variants={visibilityAnimation}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <button
                            onClick={() => {
                              dispatch(deleteNote(key));
                            }}
                          >
                            Delete note
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdown(null);
                              copyNote(
                                notes[key].title,
                                notes[key].content,
                                notes[key].color
                              );
                            }}
                          >
                            Make a copy
                          </button>
                          <div className="edit-colors">
                            {colors.map((color, index) => (
                              <button
                                key={color}
                                className={`color-dot ${color} ${
                                  color === notes[key].color &&
                                  "selected-color-outline"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editNoteColor(key, color);
                                }}
                              ></button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <AnimatePresence>
        {selectedNote && <EditorPopup layoutId={selectedNote} />}
      </AnimatePresence>
    </>
  ) : (
    <div id="empty-notes">
      <FaRegNoteSticky size={75} />
      <p>No notes yet</p>
    </div>
  );
};

export default Notes;
