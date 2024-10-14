import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoEllipsisVertical } from "react-icons/io5";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import moment from "moment";
import { editNote, deleteNote } from "../redux/actions";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import useAutosizeInput from "../helpers/autoSizeInput";
import TextareaAutosize from "react-textarea-autosize";

const EditorPopup = ({ layoutId, setSelectedNote }) => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.note);
  const note = notes[layoutId];
  const noteKey = layoutId;
  const navigate = useNavigate();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [starred, setStarred] = useState(note.starred);
  const [updated, setUpdated] = useState(false);
  const inputRef = useRef(null);

  // useAutosizeInput(inputRef, title);

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

  const debounced = useDebouncedCallback(() => {
    saveNote();
  }, 1000);

  const modalAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

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
            <IoIosStar
              size={32}
              onClick={() => {
                setStarred(!starred);
                setUpdated(true);
              }}
            />
          ) : (
            <IoIosStarOutline
              size={32}
              onClick={() => {
                setStarred(!starred);
                setUpdated(true);
              }}
            />
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
        </div>
        <div className="modal-footer">
          <div className="footer-action">
            <IoEllipsisVertical className="icon" size={18} />
          </div>
          <button className="close-btn">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditorPopup;
