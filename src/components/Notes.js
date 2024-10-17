import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaRegNoteSticky } from "react-icons/fa6";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { colors, useClickOutside, sortData } from "../helpers/noteHelper";
import EditorPopup from "./EditorPopup";
import { createNote, editNote, deleteNote } from "../redux/actions";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const NoteOptions = ({ note, noteKey }) => {
  const dispatch = useDispatch();
  const [dropdown, setDropdown] = useState(false);

  const editNoteColor = (key, color) => {
    dispatch(
      editNote({
        key,
        color,
        dateModified: new Date(),
      })
    );
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

  const visibilityAnimation = {
    initial: { opacity: 0, translateY: "-10px" },
    animate: { opacity: 1, translateY: "0px" },
    exit: { opacity: 0, translateY: "-10px" },
  };

  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, () => {
    setDropdown(false);
  });

  return (
    <div
      className="note-options"
      ref={wrapperRef}
      onClick={(e) => {
        e.stopPropagation();
        setDropdown(!dropdown);
      }}
    >
      <IoEllipsisVertical className="icon" size={18} />
      <AnimatePresence>
        {dropdown && (
          <motion.div
            className="note-menu"
            variants={visibilityAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <button
              onClick={() => {
                dispatch(deleteNote(noteKey));
              }}
            >
              Delete note
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdown(false);
                copyNote(note.title, note.content, note.color);
              }}
            >
              Make a copy
            </button>
            <div className="edit-colors">
              {colors.map((color, index) => (
                <button
                  key={color}
                  className={`color-dot ${color} ${
                    color === note.color && "selected-color-outline"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    editNoteColor(noteKey, color);
                  }}
                ></button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Notes = ({ sortValue, sortDirection, searchQuery }) => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.note);
  const noteKey = sortData(notes, sortValue, sortDirection, searchQuery);

  const navigate = useNavigate();
  const location = useLocation();
  let { noteID } = useParams();
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const deleteTimer = setTimeout(() => {
      if (deleteTarget) {
        dispatch(deleteNote(deleteTarget));
        setDeleteTarget(null);
      }
    }, 500);
    const noteTimer = setTimeout(() => {
      if (noteID) setSelectedNote(noteID);
      else setSelectedNote(null);
    }, 150);
    return () => {
      clearTimeout(deleteTimer);
      clearTimeout(noteTimer);
    };
  }, [location]);

  const newNoteAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

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
              className={`card ${selectedNote === key ? "selected-note" : ""}`}
              onClick={() => {
                setSelectedNote(key);
                navigate(`/notes/${key}`);
              }}
            >
              <div className={`card-body ${notes[key].color}`}>
                <p className="card-text" layout="position">
                  {notes[key].title}
                </p>
                <div className="card-bottom">
                  <p>{moment(notes[key].dateCreated).format("MMM DD, YYYY")}</p>
                  <NoteOptions note={notes[key]} noteKey={key} />
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <AnimatePresence>
        {selectedNote && (
          <EditorPopup
            layoutId={selectedNote}
            setSelectedNote={setSelectedNote}
            setDeleteTarget={setDeleteTarget}
          />
        )}
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
