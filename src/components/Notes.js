import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoEllipsisVertical, IoClose } from "react-icons/io5";
import { FaRegNoteSticky } from "react-icons/fa6";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { colors, useClickOutside, sortData } from "../helpers/noteHelper";
import EditorPopup from "./EditorPopup";
import { createNote, editNote, deleteNote } from "../redux/actions";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useWindowSize } from "@uidotdev/usehooks";

const NoteOptions = ({ note, noteKey, setDeletedNote }) => {
  const dispatch = useDispatch();
  const [dropdown, setDropdown] = useState(false);
  const [offScreen, setOffScreen] = useState(false);
  const size = useWindowSize();

  const editNoteColor = (key, color) => {
    dispatch(
      editNote({
        key,
        color,
        dateModified: new Date(),
      })
    );
  };

  const copyNote = (title, content, color, starred) => {
    dispatch(
      createNote({
        title,
        content,
        color,
        starred,
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
  const dropdownRef = useRef(null);
  useClickOutside(wrapperRef, () => {
    setDropdown(false);
  });

  useEffect(() => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      if (rect.x + rect.width > size.width) {
        setOffScreen(true);
      } else setOffScreen(false);
    }
  }, [dropdown]);

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
            className={`note-menu ${
              !offScreen ? "note-menu-default" : "note-menu-alt"
            }`}
            ref={dropdownRef}
            variants={visibilityAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <button
              onClick={() => {
                dispatch(deleteNote(noteKey));
                setDeletedNote(note);
              }}
            >
              Delete note
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdown(false);
                copyNote(note.title, note.content, note.color, note.starred);
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
  const isTabletWidth = useMediaQuery({ query: "(max-width: 768px)" });
  const isMobileWidth = useMediaQuery({ query: "(max-width: 640px)" });
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.note);
  const noteKey = sortData(notes, sortValue, sortDirection, searchQuery);

  const navigate = useNavigate();
  const location = useLocation();
  let { noteID } = useParams();
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletedNote, setDeletedNote] = useState(null);

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

  const undoDelete = () => {
    dispatch(
      createNote({
        title: deletedNote.title,
        content: deletedNote.content,
        color: deletedNote.color,
        starred: deletedNote.starred,
        dateCreated: deletedNote.dateCreated,
        dateModified: deletedNote.dateModified,
      })
    );
  };

  const newNoteAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const undoPopupAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  const truncate = (string) => {
    const tabletLimit = 30;
    const defaultLimit = 60;
    if (isMobileWidth) {
      return string.length > defaultLimit
        ? string.substring(0, defaultLimit - 3) + "..."
        : string;
    } else if (isTabletWidth) {
      return string.length > tabletLimit
        ? string.substring(0, tabletLimit - 3) + "..."
        : string;
    }
    return string.length > defaultLimit
      ? string.substring(0, defaultLimit - 3) + "..."
      : string;
  };

  return (
    <>
      {noteKey ? (
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
                  className={`card ${
                    selectedNote === key ? "selected-note" : ""
                  }`}
                  onClick={() => {
                    setSelectedNote(key);
                    navigate(`/notes/${key}`);
                  }}
                >
                  <div className={`card-body ${notes[key].color}`}>
                    <p className="card-title" layout="position">
                      {notes[key].title}
                    </p>
                    <p className="card-content">
                      {truncate(notes[key].content)}
                    </p>
                    <div className="card-bottom">
                      <p>
                        {moment(notes[key].dateCreated).format("MMM DD, YYYY")}
                      </p>
                      <NoteOptions
                        note={notes[key]}
                        noteKey={key}
                        setDeletedNote={setDeletedNote}
                      />
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
      )}
      <AnimatePresence>
        {deletedNote && (
          <motion.div
            layout
            id="undo-popup"
            variants={undoPopupAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <p>Note deleted</p>
            <div className="undo-actions">
              <p
                onClick={() => {
                  undoDelete();
                  setDeletedNote(null);
                }}
              >
                Undo
              </p>
              <IoClose size={24} onClick={() => setDeletedNote(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Notes;
