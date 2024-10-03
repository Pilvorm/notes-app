import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { editNote, deleteNote } from "../redux/actions";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const EditorPopup = ({ layoutId, setSelectedNote }) => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.note);
  const note = notes[layoutId];
  const noteKey = layoutId;
  const navigate = useNavigate();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const editNoteTitle = (noteKey, newTitle) => {
    dispatch(
      editNote({
        noteKey,
        title: newTitle || "Title",
        dateModified: new Date(),
      })
    );
  };

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
        setSelectedNote(null);
        navigate("/");
      }}
    >
      <motion.div
        layoutId={layoutId}
        className={`modal-body`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <textarea
            id="note-title-editor"
            layout="position"
            defaultValue={note.title}
            maxLength={50}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (e.target.value !== note.title) {
                  editNoteTitle(noteKey, e.target.value);
                }
              }
            }}
            // onBlur={(e) => {
            //   if (e.target.value !== note.title) {
            //     editNoteTitle(noteKey, e.target.value);
            //   }
            // }}
          />
        </div>
        <div className="modal-body">
          {/* <textarea id="note-content-editor" defaultValue={note.content} /> */}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditorPopup;
