const noteReducer = (state = {}, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case "ADD_NOTE":
      newState[
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
      ] = {
        title: action.payload.title,
        content: action.payload.content,
        color: action.payload.color,
        starred: action.payload.starred,
        dateCreated: action.payload.dateCreated,
        dateModified: action.payload.dateModified,
      };
      break;
    case "EDIT_NOTE":
      newState[action.payload.key] = {
        title: action.payload.title ?? newState[action.payload.key].title,
        content: action.payload.content ?? newState[action.payload.key].content,
        color: action.payload.color ?? newState[action.payload.key].color,
        starred: action.payload.starred ?? newState[action.payload.key].starred,
        dateCreated: action.payload.dateCreated ?? newState[action.payload.key].dateCreated,
        dateModified: action.payload.dateModified ?? newState[action.payload.key].dateModified,
      };
      break;
    case "DELETE_NOTE":
      delete newState[action.payload];
      break;
    default:
      break;
  }

  return newState;
};

export default noteReducer;
