import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { createNote } from "../redux/actions";
import { motion, AnimatePresence } from "framer-motion";

const colors = ["orange", "peach", "violet", "cyan", "lime"];

const Sidebar = ({}) => {
  const [newNote, setNewNote] = useState(false);

  const dispatch = useDispatch();

  const createNewNote = (color) => {
    dispatch(
      createNote({
        title: "C418",
        content: "Content",
        color,
        starred: false,
        dateCreated: new Date(),
        dateModified: new Date(),
      })
    );
  };

  const visibility = {
    initial: { opacity: 0, translateY: "-10px" },
    animate: { opacity: 1, translateY: "0px" },
    exit: { opacity: 0, translateY: "-10px" },
  };

  return (
    <nav className="d-flex flex-column align-items-center">
      <p className="mt-5">Denote</p>
      <div className="new-note">
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="new-note-btn"
          onClick={() => setNewNote(!newNote)}
        >
          <FiPlus size={24} />
        </motion.button>
        <AnimatePresence>
          {newNote && (
            <motion.div
              variants={visibility}
              initial="initial"
              animate="animate"
              exit="exit"
              className="new-note-colors"
            >
              {colors.map((color, index) => (
                <motion.button
                  variants={visibility}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: (index + 1) / 30 }}
                  key={color}
                  className={`color-dot ${color}`}
                  onClick={() => createNewNote(color)}
                ></motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Sidebar;
