import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoEllipsisVertical } from "react-icons/io5";
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
  const inputRef = useRef(null);

  // useAutosizeInput(inputRef, title);

  const saveNote = () => {
    dispatch(
      editNote({
        key: noteKey,
        title: title || "Title",
        content: content || "",
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
        saveNote();
        setSelectedNote(null);
        navigate("/");
      }}
    >
      <motion.div
        layoutId={layoutId}
        className={`modal-card`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
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
            }}
          />
        </div>
        <div className="modal-body">
          <TextareaAutosize
            id="note-content-editor"
            defaultValue={note.content}
            minRows={1}
            maxRows={16}
            placeholder="Write something here"
            onChange={(e) => {
              setContent(e.target.value);
              debounced();
            }}
          />
        </div>
        <div classname="modal-footer">
          <IoEllipsisVertical className="icon" size={18} />
          <p>Close</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditorPopup;
