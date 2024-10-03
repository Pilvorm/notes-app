import { useState } from "react";
import { FiHome, FiPlus } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { createNote } from "../redux/actions";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../helpers/noteHelper";
import { useParams, useNavigate } from "react-router-dom";

const Sidebar = ({}) => {
  const [newNote, setNewNote] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createNewNote = (color) => {
    dispatch(
      createNote({
        title: "Title",
        content: "Content",
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

  return (
    <nav>
      <p className="mt-5">Denote</p>
      <motion.button
        whileTap={{ scale: 0.85 }}
        className="sidebar-btn home-btn"
        onClick={() => navigate("/")}
      >
        <FiHome size={24} />
      </motion.button>
      <div className="new-note">
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="sidebar-btn"
          onClick={() => setNewNote(!newNote)}
        >
          <FiPlus size={24} />
        </motion.button>
        <AnimatePresence>
          {newNote && (
            <motion.div
              variants={visibilityAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              className="new-note-colors"
            >
              {colors.map((color, index) => (
                <motion.button
                  variants={visibilityAnimation}
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
