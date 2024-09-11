import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdModeEdit } from "react-icons/md";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import {sortData } from "../helpers/noteHelper";
import { editNote } from "../redux/actions";

const sortValues = ["Title", "Date Created", "Date Modified"];

const Notes = ({ sortValue, sortDirection }) => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.note);
  const [noteKey, setNoteKey] = useState(Object.keys(notes));

  useEffect(() => {
    const sorted = sortData(notes, sortValue, sortDirection);
    setNoteKey(sorted);
  }, [notes, sortValue, sortDirection]);

  console.log("Render");
  console.log("======");

  const [editingTitle, setEditingTitle] = useState(null);

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
    initial: { opacity: 0, translateX: "-10px" },
    animate: { opacity: 1, translateX: "0px" },
    exit: { opacity: 0, translateX: "-10px" },
  };

  return (
    <div className="note-cards">
      <AnimatePresence mode="sync">
        {noteKey.map((key) => (
          <motion.div
            variants={newNoteAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            key={key}
            className="card"
          >
            <div className={`card-body ${notes[key].color}`}>
              {editingTitle === key ? (
                <textarea
                  className="card-title-input"
                  autoFocus
                  defaultValue={notes[key].title}
                  onBlur={(e) => editNoteTitle(key, e.target.value)}
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
                <div className="action-btn">
                  <MdModeEdit className="icon" size={18} />
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
