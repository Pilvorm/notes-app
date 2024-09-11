import { useState, useRef } from "react";
import { BsSortDown, BsArrowUp, BsArrowDown } from "react-icons/bs";
import { IoCheckmark } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "../helpers/noteHelper";

const sortValues = ["Title", "Date Created", "Date Modified"];

const Header = ({ sortValue, setSortValue, sortDirection, setSortDirection }) => {
  const [dropdown, setDropdown] = useState(false);

  const changeSortDirection = () => {
    setSortDirection(
      sortDirection === "descending" ? "ascending" : "descending"
    );
  };

  const visibility = {
    initial: { opacity: 0, translateY: "-10px" },
    animate: { opacity: 1, translateY: "0px" },
    exit: { opacity: 0, translateY: "-10px" },
  };

  const wrapperRef = useRef("menu");
  useClickOutside(wrapperRef, () => {
    setDropdown(false);
  });

  return (
    <div className="header">
      <h1>Notes</h1>
      <div className="sort-function" ref={wrapperRef}>
        <BsSortDown size={22} />
        <p onClick={() => setDropdown(!dropdown)}>{sortValue} |</p>
        <AnimatePresence>
          {dropdown && (
            <motion.div
              className="dropdown-menu"
              variants={visibility}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {sortValues.map((val, idx) => (
                <button
                  key={idx}
                  className={`${val == sortValue && "selected"}`}
                  onClick={() => {
                    setSortValue(val);
                    setDropdown(!dropdown);
                  }}
                >
                  {val}{" "}
                  {val === sortValue && (
                    <IoCheckmark size={22} className="icon" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          className="sort-direction"
          onClick={() => changeSortDirection()}
        >
          {sortDirection === "descending" ? (
            <BsArrowDown size={20} />
          ) : (
            <BsArrowUp size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
