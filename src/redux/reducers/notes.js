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
        date: action.payload.date,
      };
      break;
    case "EDIT_NOTE":
      newState[action.payload.key] = {
        status:
          action.payload.status ?? newState[action.payload.key].status,
        title: action.payload.title ?? newState[action.payload.key].title,
        content: action.payload.content ?? newState[action.payload.key].content,
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
