import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoEllipsisVertical, IoColorPaletteOutline } from "react-icons/io5";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { FiCopy, FiTrash } from "react-icons/fi";
import moment from "moment";
import { createNote, editNote, deleteNote } from "../redux/actions";
import { colors, useClickOutside } from "../helpers/noteHelper";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import useAutosizeInput from "../helpers/autoSizeInput";
import TextareaAutosize from "react-textarea-autosize";

const EditorPopup = ({ layoutId, setSelectedNote, setDeleteTarget }) => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.note);
  const note = notes[layoutId];
  const noteKey = layoutId;
  const navigate = useNavigate();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [starred, setStarred] = useState(note.starred);
  const [updated, setUpdated] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const inputRef = useRef(null);

  const saveNote = () => {
    dispatch(
      editNote({
        key: noteKey,
        title: title || "Title",
        content: content || "",
        starred: starred,
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

  const editNoteColor = (key, color) => {
    dispatch(
      editNote({
        key,
        color,
        dateModified: new Date(),
      })
    );
  };

  const debounced = useDebouncedCallback(() => {
    saveNote();
  }, 1000);

  const modalAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
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
    <motion.div
      variants={modalAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      id="editor-modal"
      onClick={() => {
        if (updated) saveNote();
        setSelectedNote(null);
        navigate("/");
      }}
    >
      <motion.div
        layoutId={layoutId}
        className={`modal-card ${note.color}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-header`}>
          <TextareaAutosize
            id="note-title-editor"
            layout="position"
            ref={inputRef}
            defaultValue={note.title}
            maxLength={50}
            minRows={1}
            maxRows={2}
            onChange={(e) => {
              setTitle(e.target.value);
              debounced();
              setUpdated(true);
            }}
          />
          {starred ? (
            <div
              className="action"
              onClick={() => {
                setStarred(!starred);
                setUpdated(true);
              }}
            >
              <IoIosStar size={28} />
            </div>
          ) : (
            <div
              className="action"
              onClick={() => {
                setStarred(!starred);
                setUpdated(true);
              }}
            >
              <IoIosStarOutline size={28} />
            </div>
          )}
        </div>
        <div className="modal-body">
          <TextareaAutosize
            id="note-content-editor"
            className={`${note.color}`}
            defaultValue={note.content}
            minRows={1}
            maxRows={20}
            placeholder="Write something here"
            onChange={(e) => {
              setContent(e.target.value);
              debounced();
              setUpdated(true);
            }}
          />
          <p className="edit-date">Edited {moment(note.dateModified).format("MMM DD HH:mm")}</p>
        </div>
        <div className="modal-footer">
          <div className="footer-action">
            <div
              className="action"
              onClick={() => {
                copyNote(note.title, note.content, note.color);
              }}
            >
              <FiCopy className="icon" size={18} />
            </div>
            <div
              className="action"
              onClick={() => {
                setSelectedNote(null);
                navigate("/");
                setDeleteTarget(noteKey);
              }}
            >
              <FiTrash className="icon" size={18} />
            </div>
            <div className="action" ref={wrapperRef} onClick={() => setDropdown(!dropdown)}>
              <IoColorPaletteOutline className="icon" size={18} />
              <AnimatePresence>
                {dropdown && (
                  <motion.div
                    className="color-menu"
                    variants={visibilityAnimation}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
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
          </div>
          <button
            className="close-btn"
            onClick={() => {
              if (updated) saveNote();
              setSelectedNote(null);
              navigate("/");
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditorPopup;
