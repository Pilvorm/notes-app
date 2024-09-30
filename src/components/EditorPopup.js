import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

const EditorPopup = ({ layoutId }) => {
  const notes = useSelector((state) => state.note);
  const note = notes[layoutId];

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
    >
      <motion.div layoutId={layoutId} className={`modal-body`}>
        <div className="modal-header">
          <motion.h2 layout="position">{note.title}</motion.h2>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditorPopup;
