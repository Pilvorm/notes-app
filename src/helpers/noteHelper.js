import { useEffect } from "react";

export const useClickOutside = (ref, onClickOutside) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
};

export const filterData = (notes, noteKey, query) => {
  query = query.toLowerCase();
  return noteKey.filter((key) =>
    // notes[key].title.split(" ").some((word) => word.toLowerCase().includes(query))
    notes[key].title.toLowerCase().includes(query)
  );
};

export const sortData = (notes, sortValue, sortDirection, query) => {
  // Default sort is descending
  let result = [];
  if (sortValue === "Title") {
    result = Object.keys(notes).sort((a, b) =>
      notes[a].title < notes[b].title
        ? 1
        : notes[b].title < notes[a].title
        ? -1
        : 0
    );
  } else if (sortValue === "Date Created") {
    result = Object.keys(notes).reverse();
  } else if (sortValue === "Date Modified") {
    result = Object.keys(notes).sort(
      (a, b) =>
        new Date(notes[b].dateModified) - new Date(notes[a].dateModified)
    );
  }
  if (sortDirection === "ascending") {
    result.reverse();
  }
  return filterData(notes, result, query);
};
